export function getMastery(progress, skill, item) {
  const x = progress.skills?.[skill]?.[item]; return !x?.attempts ? 0 : x.correct / x.attempts;
}
export function getSkillStats(progress, skill) {
  const items = Object.values(progress.skills?.[skill] || {});
  const attempts = items.reduce((n,x)=>n+x.attempts,0), correct = items.reduce((n,x)=>n+x.correct,0);
  return { items: items.length, attempts, correct, mastery: attempts ? correct/attempts : 0 };
}
export function chooseLearningAction(progress, skill, item) {
  const x = progress.skills?.[skill]?.[item]; if (!x) return "NEW";
  const mastery = getMastery(progress, skill, item);
  if (x.wrong > 0 && mastery < .7) return "HINT";
  if (mastery >= .9) return "CHALLENGE";
  return "PRACTICE";
}
export function getDifficulty(progress, skill, item) {
  const m = getMastery(progress, skill, item); return m < .5 ? "gentle" : m < .8 ? "steady" : "stretch";
}
export function getRecommendationReason(progress, skill, item) {
  const x = progress.skills?.[skill]?.[item]; if (!x) return "This is a new skill.";
  const m = getMastery(progress, skill, item);
  if (x.wrong > 0 && m < .7) return "Let's practice a tricky part.";
  if (m >= .9) return "You're ready for a stretch.";
  return "A little more practice will help.";
}
