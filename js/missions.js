export const DAILY_MISSIONS = [
  { id: "learn", title: "Learn", description: "Practice one new skill." },
  { id: "think", title: "Think", description: "Solve one challenge." },
  { id: "remember", title: "Remember", description: "Review something you learned." }
];

export function getMissionSummary(progress) {
  const today = new Date().toISOString().slice(0, 10);
  const done = progress.missions?.[today] || {};
  const completed = DAILY_MISSIONS.filter(m => done[m.id]).length;
  return { total: DAILY_MISSIONS.length, completed, allDone: completed === DAILY_MISSIONS.length };
}
