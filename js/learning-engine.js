export function getMastery(progress, skill, item) {
  const x = progress.skills?.[skill]?.[item];
  if (!x || !x.attempts) return 0;
  return x.correct / x.attempts;
}

export function getSkillStats(progress, skill) {
  const items = Object.values(progress.skills?.[skill] || {});
  const attempts = items.reduce((n, x) => n + x.attempts, 0);
  const correct = items.reduce((n, x) => n + x.correct, 0);
  return { items: items.length, attempts, correct, mastery: attempts ? correct / attempts : 0 };
}

export function chooseLearningAction(progress, skill, item) {
  const x = progress.skills?.[skill]?.[item];
  if (!x) return "NEW";
  const mastery = getMastery(progress, skill, item);
  if ((x.wrong || 0) > 0 && mastery < 0.7) return "HINT";
  if (mastery >= 0.9) return "CHALLENGE";
  return "PRACTICE";
}

export function getDifficulty(progress, skill, item) {
  const mastery = getMastery(progress, skill, item);
  if (mastery < 0.5) return "gentle";
  if (mastery < 0.8) return "steady";
  return "stretch";
}

export function getRecommendationReason(progress, skill, item) {
  const x = progress.skills?.[skill]?.[item];
  if (!x) return "This is a new skill.";
  if (x.wrong > 0 && getMastery(progress, skill, item) < 0.7) return "Let's practice a tricky part.";
  if (getMastery(progress, skill, item) >= 0.9) return "You're ready for a stretch.";
  return "A little more practice will help.";
}
