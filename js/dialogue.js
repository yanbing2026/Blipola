const lines = {
  welcome: "Hi! I'm Blipola. Let's learn something together!",
  thinking: "Hmm... let's think about it.",
  hint: "Take another look. What clue can you find?",
  retry: "That's okay. Let's try it a different way.",
  correct: "You figured it out! Nice thinking!",
  celebrate: "Great work! You kept trying!",
  quest: "Today we will learn, think, and remember."
};

export function say(kind) { return lines[kind] || lines.welcome; }
