import { loadProgress } from "./progress.js";
import { createBlipola } from "./blipola.js";
import { getMissionSummary } from "./missions.js";

const progress = loadProgress();
const blipola = createBlipola({ progress });
const speech = document.querySelector("#speech");
const status = document.querySelector("#status");
const buddy = document.querySelector("#buddy");

function show(kind) {
  speech.textContent = blipola.speak(kind);
  buddy.animate([{transform:"scale(1)"},{transform:"scale(1.08)"},{transform:"scale(1)"}], {duration:450});
}

document.querySelector("#learnBtn").onclick = () => {
  show("thinking");
  status.textContent = "Blipola is choosing a gentle next step.";
};

document.querySelector("#hintBtn").onclick = () => {
  speech.textContent = blipola.hint({});
  status.textContent = "Hint mode • Think first, then try.";
};

document.querySelector("#questBtn").onclick = () => {
  const m = getMissionSummary(progress);
  speech.textContent = m.allDone ? blipola.speak("celebrate") : blipola.speak("quest");
  status.textContent = `Daily Quest • ${m.completed}/${m.total} complete`;
};

if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js");
