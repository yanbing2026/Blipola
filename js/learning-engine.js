export function getMastery(progress, skill, item) {
  const x = progress.skills?.[skill]?.[item];
  if (!x || !x.attempts) return 0;
  return x.correct / x.attempts;
}

export function chooseLearningAction(progress, skill, item) {
  const x = progress.skills?.[skill]?.[item];
  if (!x) return "NEW";
  if ((x.wrong || 0) > 0 && getMastery(progress, skill, item) < 0.7) return "HINT";
  if (getMastery(progress, skill, item) >= 0.9) return "CHALLENGE";
  return "PRACTICE";
}

export function getDifficulty(progress, skill, item) {
  const mastery = getMastery(progress, skill, item);
  if (mastery < 0.5) return "gentle";
  if (mastery < 0.8) return "steady";
  return "stretch";
}
