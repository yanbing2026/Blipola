import { loadProgress, awardReward } from "./progress.js";
import { createBlipola } from "./blipola.js";
import { getMissionSummary, completeMission } from "./missions.js";

const progress = loadProgress();
const blipola = createBlipola({ progress });
const speech = document.querySelector("#speech");
const status = document.querySelector("#status");
const buddy = document.querySelector("#buddy");

function animateBuddy() {
  buddy.animate([{ transform: "scale(1) rotate(0deg)" }, { transform: "scale(1.08) rotate(-2deg)" }, { transform: "scale(1) rotate(0deg)" }], { duration: 500, easing: "ease-out" });
}

function show(kind, message = null) {
  speech.textContent = message || blipola.speak(kind);
  animateBuddy();
}

document.querySelector("#learnBtn").onclick = () => {
  const recommendation = blipola.recommend("letters", "A");
  show(null, recommendation.message);
  status.textContent = `Blipola • ${recommendation.action} • ${recommendation.difficulty} • ${recommendation.reason}`;
};

document.querySelector("#hintBtn").onclick = () => {
  speech.textContent = blipola.hint({ wrongAttempts: 1 });
  status.textContent = "Hint 1 • Think first, then try.";
  animateBuddy();
};

document.querySelector("#questBtn").onclick = () => {
  const summary = getMissionSummary(progress);
  if (!summary.allDone && completeMission(progress, summary.missions.find(m => !m.done)?.id || "learn")) awardReward(progress, { xp: 10 });
  const next = getMissionSummary(progress);
  speech.textContent = next.allDone ? blipola.speak("celebrate") : blipola.speak("quest");
  status.textContent = `Daily Quest • ${next.completed}/${next.total} complete • ${progress.rewards.xp} XP`;
  animateBuddy();
};

if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js");
