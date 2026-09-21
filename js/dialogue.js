const lines = {
  welcome:"Hi! I'm Blipola. Let's learn something together!",
  thinking:"Hmm... let's think about it.", hint:"Take another look. What clue can you find?",
  hint2:"Can you spot one clue?", hint3:"Let's do one small step together.",
  retry:"That's okay. Let's try it a different way.", correct:"You figured it out! Nice thinking!",
  celebrate:"Great work! You kept trying!", quest:"Today we will learn, think, and remember.",
  newSkill:"Let's discover something new!", practice:"Let's practice this one together.",
  challenge:"You're ready for a little challenge!"
};
export function say(kind){ return lines[kind] || lines.welcome; }
export function responseFor({correct, attempts=0}) {
  if(correct) return attempts <= 1 ? say("correct") : say("celebrate");
  return attempts <= 1 ? say("hint") : attempts===2 ? say("hint2") : say("hint3");
}
