import { getSkillStats } from "./learning-engine.js";

export function getParentInsights(progress) {
  const attempts = progress.attempts || [];
  const correct = attempts.filter(a => a.correct).length;
  const skills = Object.entries(progress.skills || {}).map(([skill, items]) => {
    const stats = getSkillStats(progress, skill);
    return { skill, ...stats };
  }).sort((a, b) => b.mastery - a.mastery);
  return {
    attempts: attempts.length,
    correct,
    accuracy: attempts.length ? Math.round(correct / attempts.length * 100) : 0,
    skillsPracticed: skills.length,
    rewards: progress.rewards,
    streak: progress.streak,
    skills
  };
}
