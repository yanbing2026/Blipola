import { createBlipola } from "./blipola.js";

const LABELS = {
  letters: "Letters",
  numbers: "Numbers",
  words: "English",
  chinese: "Chinese",
  spanish: "Spanish",
  math: "Math",
  science: "Science",
  patterns: "Patterns",
  comparing: "Comparing",
  positions: "Positions",
  measurement: "Measuring",
  time: "Time",
  money: "Money",
  onemoreless: "More or Less",
  rhyming: "Rhyming",
  sightwords: "Sight Words",
  make10: "Make 10",
  decompose: "Decompose",
  teennumbers: "Teen Numbers"
};

function sourceKey(question = {}) {
  return question.sourceKey || question.key || question.category || "unknown";
}

function sourceLevel(question = {}) {
  return question.sourceLevel || question.level || "L1";
}

export function normalizeQuestion(question = {}) {
  const skill = sourceKey(question);
  const item = question.itemId ?? question.answer ?? "";
  const choices = Array.isArray(question.choices)
    ? question.choices.map(choice => ({
        id: choice?.id ?? choice,
        label: choice?.html ?? choice?.id ?? choice,
        speak: choice?.speak ?? choice?.id ?? choice
      }))
    : [];

  return {
    skill,
    skillLabel: LABELS[skill] || skill,
    level: sourceLevel(question),
    item: String(item),
    question: question.promptText || question.speakText || LABELS[skill] || "Let's learn!",
    promptHTML: question.promptHTML || "",
    choices,
    answer: String(item),
    mode: question.mode || null,
    language: question.lang || "en-US",
    source: {
      key: skill,
      level: sourceLevel(question),
      item: String(item)
    }
  };
}

export function selectionIsCorrect(question, selectedId) {
  const normalized = normalizeQuestion(question);
  return String(selectedId) === normalized.answer;
}

export function createLearningOutcome(question, selectedId, attempts = 1) {
  return {
    correct: selectionIsCorrect(question, selectedId),
    firstTry: Number(attempts) === 1,
    attempts: Math.max(1, Number(attempts) || 1)
  };
}

export function classroomActivity(outcome, question, selectedId) {
  const normalized = normalizeQuestion(question);
  return {
    key: normalized.skill,
    level: normalized.level,
    item: normalized.item,
    selected: selectedId == null ? null : String(selectedId),
    correct: !!outcome.correct,
    firstTry: !!outcome.firstTry,
    attempts: outcome.attempts,
    at: new Date().toISOString()
  };
}

export function seedBlipolaProgressFromClassroom(blipolaProgress, classroomProgress = {}) {
  const activity = Array.isArray(classroomProgress.activityLog)
    ? classroomProgress.activityLog
    : [];

  for (const entry of activity) {
    const skill = entry.key || entry.skill;
    const item = entry.itemId ?? entry.item;
    if (!skill || item == null) continue;
    const history = blipolaProgress.skills[skill] ||= {};
    const existing = history[String(item)] ||= {
      attempts: 0,
      correct: 0,
      wrong: 0,
      firstTry: 0,
      lastSeen: null,
      lastCorrect: null,
      recentErrors: 0,
      correctStreak: 0,
      nextReview: null
    };

    existing.attempts = Math.max(existing.attempts || 0, Number(entry.attempts) || 0);
    if (entry.correct) existing.correct = Math.max(existing.correct || 0, 1);
    else existing.wrong = Math.max(existing.wrong || 0, 1);
    existing.firstTry = Math.max(existing.firstTry || 0, entry.firstTry ? 1 : 0);
    existing.lastSeen = entry.at ? new Date(entry.at).toISOString() : existing.lastSeen;
  }

  return blipolaProgress;
}

export function createKindergartenIntegration({
  progress,
  onEvent = () => {},
  onHostActivity = () => {},
  classroomProgress = null
} = {}) {
  const seeded = classroomProgress
    ? seedBlipolaProgressFromClassroom(progress, classroomProgress)
    : progress;

  const blipola = createBlipola({ progress: seeded, onEvent });

  function start(question) {
    const normalized = normalizeQuestion(question);
    return {
      ...blipola.startQuestion({
        skill: normalized.skill,
        item: normalized.item,
        question: normalized.question,
        choices: normalized.choices.map(choice => choice.id),
        answer: normalized.answer
      }),
      ...normalized,
      hostQuestion: question
    };
  }

  function complete(context, selectedId, attempts = 1) {
    const outcome = createLearningOutcome(context.hostQuestion || context, selectedId, attempts);
    const result = blipola.complete(context, outcome);
    onHostActivity(classroomActivity(outcome, context.hostQuestion || context, selectedId));
    return { ...result, outcome };
  }

  return {
    blipola,
    start,
    hint: context => blipola.hint(context),
    explain: context => blipola.explain(context),
    complete,
    recommend: (skill, item) => blipola.recommend(skill, item),
    dailyAdventure: () => blipola.dailyAdventure(),
    on: (type, handler) => blipola.on(type, handler)
  };
}
