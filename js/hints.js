export function getHint(context = {}) {
  if (context.level === 3) return "Let's do one small step together.";
  if (context.level === 2) return "Can you spot one clue?";
  if (context.level === 1) return "Take another look. What do you notice?";
  if (context.hint) return context.hint;
  return "Look for one clue in the question.";
}

export function getExplanation() {
  return "Let's break the idea into one small step.";
}

export function getHintLevel(wrongAttempts = 0) {
  return Math.min(3, Math.max(0, wrongAttempts));
}
