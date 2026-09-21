import {
  chooseLearningAction, getDifficulty, getRecommendationReason,
  getDailyAdventure, scheduleNextReview
} from "./learning-engine.js";
import { getHint, getExplanation, getHintLevel } from "./hints.js";
import { say, responseFor } from "./dialogue.js";
import { recordAttempt, awardReward, saveProgress } from "./progress.js";
import { createLearningContext, recordOutcome } from "./learning-context.js";
import { createEventBus } from "./events.js";

export function createBlipola({ progress, onEvent = () => {}, events = createEventBus() }) {
  let state = "idle";

  const emit = event => {
    events.emit(event);
    onEvent(event);
  };

  const setState = (next, detail = {}) => {
    state = next;
    emit({ type: "buddy-state", state, ...detail });
    return state;
  };

  return {
    get state() { return state; },
    events,

    on(type, handler) {
      return events.on(type, handler);
    },

    recommend(skill, item) {
      const action = chooseLearningAction(progress, skill, item);
      return {
        action,
        difficulty: getDifficulty(progress, skill, item),
        reason: getRecommendationReason(progress, skill, item),
        message: say(
          action === "NEW" ? "newSkill" :
          action === "CHALLENGE" ? "challenge" :
          action === "REVIEW" ? "quest" : "practice"
        )
      };
    },

    startQuestion(input) {
      const context = createLearningContext(progress, input);
      setState("thinking", { context });
      emit({ type: "question-started", context });
      return context;
    },

    hint(context) {
      setState("hint", { context });
      const hint = getHint({
        ...context,
        level: getHintLevel(context.wrongAttempts || context.history?.recentErrors || 0)
      });
      emit({ type: "hint-requested", context, hint });
      return hint;
    },

    explain(context) {
      setState("thinking", { context });
      return getExplanation(context);
    },

    respond(context) {
      const message = responseFor(context);
      setState(context.correct ? "correct" : "retry", { context });
      return message;
    },

    complete(context, outcome) {
      const result = recordOutcome(context, outcome);
      const item = recordAttempt(
        progress, context.skill, context.item,
        result.outcome.correct, result.outcome.firstTry
      );
      scheduleNextReview(progress, context.skill, context.item, result.outcome.correct);
      saveProgress(progress);

      const action = result.outcome.correct ? "CELEBRATE" : "RETRY";
      setState(result.outcome.correct ? "celebrate" : "retry", { result });

      if (result.outcome.correct) {
        awardReward(progress, { xp: result.outcome.firstTry ? 10 : 5 });
      }

      emit({ type: "learning-complete", action, result, item });
      return { action, result, item };
    },

    dailyAdventure() {
      const adventure = getDailyAdventure(progress);
      emit({ type: "daily-adventure", adventure });
      return adventure;
    },

    speak(kind) {
      return say(kind);
    }
  };
}
