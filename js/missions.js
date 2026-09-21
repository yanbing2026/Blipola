import { localDay } from "./progress.js";

export const DAILY_MISSIONS = [
  { id: "learn", title: "Learn", description: "Practice one new skill." },
  { id: "think", title: "Think", description: "Solve one challenge." },
  { id: "remember", title: "Remember", description: "Review something you learned." }
];

export function getMissionSummary(progress) {
  const today = localDay();
  const done = progress.missions?.[today] || {};
  const missions = DAILY_MISSIONS.map(m => ({ ...m, done: !!done[m.id] }));
  const completed = missions.filter(m => m.done).length;
  return { total: missions.length, completed, allDone: completed === missions.length, missions };
}

export function completeMission(progress, id) {
  const today = localDay();
  progress.missions ||= {};
  progress.missions[today] ||= {};
  if (progress.missions[today][id]) return false;
  progress.missions[today][id] = true;
  return true;
}

export function missionForAction(action) {
  if (action === "NEW" || action === "PRACTICE") return "learn";
  if (action === "CHALLENGE") return "think";
  if (action === "REVIEW" || action === "RETRY") return "remember";
  return null;
}
