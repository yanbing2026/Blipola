export function createLearningContext(progress, input = {}) {
  const { skill, item, question = "", choices = [], answer = null } = input;
  const history = progress.skills?.[skill]?.[item] || null;
  return {
    skill, item, question,
    choices: Array.isArray(choices) ? choices : [],
    answer,
    history: history ? {
      attempts: history.attempts || 0,
      correct: history.correct || 0,
      wrong: history.wrong || 0,
      firstTry: history.firstTry || 0,
      recentErrors: history.recentErrors || 0,
      correctStreak: history.correctStreak || 0,
      mastery: history.attempts ? history.correct / history.attempts : 0,
      nextReview: history.nextReview || null
    } : null
  };
}

export function recordOutcome(context, outcome = {}) {
  return {
    ...context,
    outcome: {
      correct: !!outcome.correct,
      firstTry: outcome.firstTry !== false,
      attempts: outcome.attempts || 1
    }
  };
}
