import { createBlipola } from "./blipola.js";
import { loadProgress } from "./progress.js";

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
  const mastery = classroomProgress.mastery || {};
  const due = classroomProgress.due || {};

  for (const [categoryLevel, items] of Object.entries(mastery)) {
    if (!items || typeof items !== "object") continue;
    const separator = categoryLevel.indexOf("_");
    const skill = separator > 0 ? categoryLevel.slice(0, separator) : categoryLevel;
    const history = blipolaProgress.skills[skill] ||= {};

    for (const [item, count] of Object.entries(items)) {
      const n = Math.max(0, Number(count) || 0);
      if (!n) continue;
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
      existing.attempts = Math.max(existing.attempts || 0, n);
      existing.correct = Math.max(existing.correct || 0, n);
      existing.correctStreak = Math.max(existing.correctStreak || 0, n);
      const dueAt = due[categoryLevel]?.[item];
      if (dueAt) existing.nextReview = new Date(Number(dueAt)).toISOString();
    }
  }

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
    existing.lastSeen = entry.at ? new Date(Number(entry.at)).toISOString() : existing.lastSeen;
    if (!entry.correct) {
      existing.wrong += 1;
      existing.recentErrors = Math.min(5, (existing.recentErrors || 0) + 1);
    }
  }

  return blipolaProgress;
}

export function createKindergartenIntegration({
  progress = null,
  onEvent = () => {},
  onHostActivity = () => {},
  classroomProgress = null
} = {}) {
  const baseProgress = progress || loadProgress();
  const seeded = classroomProgress
    ? seedBlipolaProgressFromClassroom(baseProgress, classroomProgress)
    : baseProgress;

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
