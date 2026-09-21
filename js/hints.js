export function getHint(context = {}) {
  if (context.hint) return context.hint;
  if (context.question) return "Look for one clue in the question.";
  return "Take another look. What do you notice?";
}

export function getExplanation(context = {}) {
  if (context.answer != null) return "Let's look at the clues and work it out together.";
  return "Let's break the idea into one small step.";
}
