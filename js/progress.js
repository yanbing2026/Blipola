const KEY = "blipola_progress_v3";

const emptyProgress = () => ({
  attempts: [], skills: {}, missions: {},
  rewards: { xp: 0, diamonds: 0, stars: 0 },
  streak: { current: 0, best: 0, lastDay: null }
});

function mergeProgress(saved) {
  const base = emptyProgress();
  return {
    ...base, ...saved,
    rewards: { ...base.rewards, ...(saved?.rewards || {}) },
    streak: { ...base.streak, ...(saved?.streak || {}) },
    attempts: Array.isArray(saved?.attempts) ? saved.attempts : [],
    skills: saved?.skills && typeof saved.skills === "object" ? saved.skills : {},
    missions: saved?.missions && typeof saved.missions === "object" ? saved.missions : {}
  };
}

export function localDay(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function daysBetween(a, b) {
  if (!a || !b) return null;
  const ms = Date.parse(`${b}T00:00:00`) - Date.parse(`${a}T00:00:00`);
  return Math.round(ms / 86400000);
}

export function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return saved ? mergeProgress(saved) : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress) {
  localStorage.setItem(KEY, JSON.stringify(progress));
  return progress;
}

export function touchStreak(progress, date = new Date()) {
  const today = localDay(date);
  const last = progress.streak?.lastDay;
  if (last === today) return progress.streak;
  const gap = last ? daysBetween(last, today) : null;
  const current = gap === 1 ? progress.streak.current + 1 : 1;
  progress.streak.current = current;
  progress.streak.best = Math.max(progress.streak.best || 0, current);
  progress.streak.lastDay = today;
  saveProgress(progress);
  return progress.streak;
}

export function recordAttempt(progress, skill, item, correct, firstTry = true) {
  const at = new Date().toISOString();
  progress.attempts.push({ skill, item, correct: !!correct, firstTry: !!firstTry, at });
  const s = progress.skills[skill] ||= {};
  const x = s[item] ||= {
    attempts: 0, correct: 0, wrong: 0, firstTry: 0,
    lastSeen: null, lastCorrect: null, recentErrors: 0,
    correctStreak: 0, nextReview: null
  };
  x.attempts++;
  if (correct) {
    x.correct++;
    x.lastCorrect = at;
    x.correctStreak++;
    x.recentErrors = 0;
  } else {
    x.wrong++;
    x.recentErrors = Math.min(5, (x.recentErrors || 0) + 1);
    x.correctStreak = 0;
  }
  if (correct && firstTry) x.firstTry++;
  x.lastSeen = at;
  touchStreak(progress);
  saveProgress(progress);
  return x;
}

export function awardReward(progress, { xp = 0, diamonds = 0, stars = 0 } = {}) {
  progress.rewards.xp += xp;
  progress.rewards.diamonds += diamonds;
  progress.rewards.stars += stars;
  saveProgress(progress);
  return progress.rewards;
}
