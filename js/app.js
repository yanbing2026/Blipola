import { loadProgress } from "./progress.js";
import { createBlipola } from "./blipola.js";
import { getMissionSummary, completeMission, missionForAction } from "./missions.js";

const progress = loadProgress();
const speech = document.querySelector("#speech");
const status = document.querySelector("#status");
const buddy = document.querySelector("#buddy");
const question = document.querySelector("#question");
const choices = document.querySelector("#choices");
const questList = document.querySelector("#questList");
const adventure = document.querySelector("#adventure");

let current = null;
let attempts = 0;

const blipola = createBlipola({
  progress,
  onEvent: event => {
    if (event.type === "buddy-state") {
      buddy.dataset.state = event.state;
      buddy.setAttribute("aria-label", `Blipola is ${event.state}`);
    }
  }
});

function animateBuddy() {
  buddy.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.07) rotate(-2deg)" }, { transform: "scale(1)" }],
    { duration: 450, easing: "ease-out" }
  );
}

function renderMissions() {
  const summary = getMissionSummary(progress);
  questList.innerHTML = summary.missions.map(m =>
    `<li class="${m.done ? "done" : ""}"><span>${m.done ? "✓" : "○"}</span><strong>${m.title}</strong><small>${m.description}</small></li>`
  ).join("");
}

function showAdventure() {
  const a = blipola.dailyAdventure();
  adventure.textContent = `${a.title} • ${a.reason}`;
}

function startQuestion() {
  attempts = 0;
  current = blipola.startQuestion({
    skill: "letters",
    item: "A",
    question: "Which letter is A?",
    choices: ["A", "B", "C"],
    answer: "A"
  });
  current.recommendedAction = blipola.recommend(current.skill, current.item).action;
  question.textContent = current.question;
  choices.innerHTML = current.choices.map(choice =>
    `<button class="choice" data-answer="${choice}">${choice}</button>`
  ).join("");
  choices.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => answerQuestion(button.dataset.answer));
  });
  speech.textContent = blipola.speak("practice");
  status.textContent = "Think first, then choose an answer.";
  animateBuddy();
}

function answerQuestion(answer) {
  if (!current) return;
  attempts++;
  const correct = answer === current.answer;
  const message = blipola.respond({ correct, attempts });
  speech.textContent = message;
  animateBuddy();

  if (correct) {
    const result = blipola.complete(current, { correct: true, firstTry: attempts === 1, attempts });
    const mission = missionForAction(current.recommendedAction);
    if (mission) completeMission(progress, mission);
    question.textContent = "Nice! Ready for another?";
    choices.innerHTML = '<button class="primary" id="nextBtn">Next Adventure</button>';
    document.querySelector("#nextBtn").onclick = startQuestion;
    status.textContent = `+${result.result.outcome.firstTry ? 10 : 5} XP • ${progress.streak.current} day streak`;
    renderMissions();
    showAdventure();
    return;
  }

  if (attempts >= 3) {
    speech.textContent = blipola.explain(current);
    status.textContent = "Blipola gave a small step. Try again.";
  } else {
    speech.textContent = blipola.hint({ ...current, wrongAttempts: attempts });
    status.textContent = `Hint ${attempts} • Think, then try again.`;
  }
}

document.querySelector("#learnBtn").onclick = startQuestion;

document.querySelector("#hintBtn").onclick = () => {
  if (!current) startQuestion();
  speech.textContent = blipola.hint({ ...current, wrongAttempts: Math.max(1, attempts) });
  status.textContent = "A clue, not the answer.";
  animateBuddy();
};

document.querySelector("#questBtn").onclick = () => {
  showAdventure();
  speech.textContent = blipola.speak("quest");
  status.textContent = "Your Daily Adventure is ready.";
  animateBuddy();
};

renderMissions();
showAdventure();

if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js");
