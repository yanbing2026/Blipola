const DAY = 86400000;

function itemData(progress, skill, item) {
  return progress.skills?.[skill]?.[item] || null;
}

export function getMastery(progress, skill, item) {
  const x = itemData(progress, skill, item);
  return !x?.attempts ? 0 : x.correct / x.attempts;
}

export function getSkillStats(progress, skill) {
  const items = Object.values(progress.skills?.[skill] || {});
  const attempts = items.reduce((n, x) => n + (x.attempts || 0), 0);
  const correct = items.reduce((n, x) => n + (x.correct || 0), 0);
  return { items: items.length, attempts, correct, mastery: attempts ? correct / attempts : 0 };
}

export function isDue(progress, skill, item, now = new Date()) {
  const x = itemData(progress, skill, item);
  if (!x?.nextReview) return false;
  return Date.parse(x.nextReview) <= now.getTime();
}

export function scheduleNextReview(progress, skill, item, correct, now = new Date()) {
  const x = itemData(progress, skill, item);
  if (!x) return null;
  const mastery = getMastery(progress, skill, item);
  const intervals = correct ? [1, 2, 4, 7] : [0, 1];
  const index = correct ? Math.min(3, Math.max(0, (x.correctStreak || 1) - 1)) : 0;
  let days = intervals[index];
  if (!correct) days = mastery < 0.5 ? 0 : 1;
  const next = new Date(now.getTime() + days * DAY);
  x.nextReview = next.toISOString();
  return x.nextReview;
}

export function getDueReviews(progress, now = new Date(), limit = 3) {
  const due = [];
  for (const [skill, items] of Object.entries(progress.skills || {})) {
    for (const [item, data] of Object.entries(items || {})) {
      if (data?.nextReview && Date.parse(data.nextReview) <= now.getTime()) {
        due.push({ skill, item, mastery: getMastery(progress, skill, item), nextReview: data.nextReview });
      }
    }
  }
  return due
    .sort((a, b) => a.mastery - b.mastery || Date.parse(a.nextReview) - Date.parse(b.nextReview))
    .slice(0, limit);
}

export function getRecentErrors(progress, limit = 3) {
  return (progress.attempts || [])
    .filter(a => !a.correct)
    .slice(-limit)
    .reverse();
}

export function chooseLearningAction(progress, skill, item, now = new Date()) {
  const x = itemData(progress, skill, item);
  if (!x) return "NEW";
  if (isDue(progress, skill, item, now)) return "REVIEW";
  const mastery = getMastery(progress, skill, item);
  if ((x.recentErrors || 0) > 0 && mastery < 0.7) return "HINT";
  if (mastery >= 0.9) return "CHALLENGE";
  return "PRACTICE";
}

export function getDifficulty(progress, skill, item) {
  const m = getMastery(progress, skill, item);
  return m < 0.5 ? "gentle" : m < 0.8 ? "steady" : "stretch";
}

export function getRecommendationReason(progress, skill, item, now = new Date()) {
  const x = itemData(progress, skill, item);
  if (!x) return "This is a new skill.";
  if (isDue(progress, skill, item, now)) return "This is a good time to remember it.";
  const m = getMastery(progress, skill, item);
  if ((x.recentErrors || 0) > 0 && m < 0.7) return "Let's practice a tricky part.";
  if (m >= 0.9) return "You're ready for a stretch.";
  return "A little more practice will help.";
}

export function getDailyAdventure(progress, now = new Date()) {
  const review = getDueReviews(progress, now, 1)[0];
  const error = getRecentErrors(progress, 1)[0];
  if (review) return { type: "REVIEW", skill: review.skill, item: review.item, title: "Remember", reason: "A review is ready." };
  if (error) return { type: "RETRY", skill: error.skill, item: error.item, title: "Try Again", reason: "Let's revisit a tricky one." };
  for (const [skill, items] of Object.entries(progress.skills || {})) {
    const challenge = Object.entries(items || {}).find(([item]) => getMastery(progress, skill, item) >= 0.9);
    if (challenge) return { type: "CHALLENGE", skill, item: challenge[0], title: "Challenge", reason: "You're ready to stretch your thinking." };
  }
  return { type: "NEW", skill: "letters", item: "A", title: "Discover", reason: "Let's discover something new." };
}
