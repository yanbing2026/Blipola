import { chooseLearningAction, getDifficulty } from "./learning-engine.js";
import { getHint, getExplanation } from "./hints.js";
import { say } from "./dialogue.js";

export function createBlipola({ progress }) {
  return {
    recommend(skill, item) {
      return {
        action: chooseLearningAction(progress, skill, item),
        difficulty: getDifficulty(progress, skill, item),
        message: say("thinking")
      };
    },
    hint(context) { return getHint(context); },
    explain(context) { return getExplanation(context); },
    speak(kind) { return say(kind); }
  };
}
