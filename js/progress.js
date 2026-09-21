const KEY = "blipola_progress_v2";

const emptyProgress = () => ({
  attempts: [], skills: {}, missions: {},
  rewards: { xp: 0, diamonds: 0, stars: 0 },
  streak: { current: 0, best: 0, lastDay: null }
});

export function loadProgress() {
  try { const saved = JSON.parse(localStorage.getItem(KEY)); return saved ? { ...emptyProgress(), ...saved } : emptyProgress(); }
  catch { return emptyProgress(); }
}
export function saveProgress(progress) { localStorage.setItem(KEY, JSON.stringify(progress)); }

export function recordAttempt(progress, skill, item, correct, firstTry = true) {
  const at = new Date().toISOString();
  progress.attempts.push({ skill, item, correct: !!correct, firstTry: !!firstTry, at });
  const s = progress.skills[skill] ||= {};
  const x = s[item] ||= { attempts: 0, correct: 0, wrong: 0, firstTry: 0, lastSeen: null };
  x.attempts++; correct ? x.correct++ : x.wrong++;
  if (correct && firstTry) x.firstTry++;
  x.lastSeen = at; saveProgress(progress); return x;
}
export function awardReward(progress, { xp = 0, diamonds = 0, stars = 0 } = {}) {
  progress.rewards.xp += xp; progress.rewards.diamonds += diamonds; progress.rewards.stars += stars;
  saveProgress(progress); return progress.rewards;
}
