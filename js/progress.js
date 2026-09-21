const KEY = "blipola_progress_v1";

export function loadProgress() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { attempts: [], skills: {}, missions: {} }; }
  catch { return { attempts: [], skills: {}, missions: {} }; }
}

export function saveProgress(progress) {
  localStorage.setItem(KEY, JSON.stringify(progress));
}

export function recordAttempt(progress, skill, item, correct) {
  progress.attempts.push({ skill, item, correct, at: new Date().toISOString() });
  const s = progress.skills[skill] ||= {};
  const x = s[item] ||= { attempts: 0, correct: 0, wrong: 0 };
  x.attempts++;
  correct ? x.correct++ : x.wrong++;
  saveProgress(progress);
}
