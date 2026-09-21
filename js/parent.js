export function getParentInsights(progress) {
  const attempts = progress.attempts || [];
  const correct = attempts.filter(a => a.correct).length;
  const skills = Object.entries(progress.skills || {});
  return {
    attempts: attempts.length,
    correct,
    accuracy: attempts.length ? Math.round(correct / attempts.length * 100) : 0,
    skillsPracticed: skills.length
  };
}
