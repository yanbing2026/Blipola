export function createQuestionAdapter(source = {}) {
  return {
    getQuestion() {
      if (typeof source.getQuestion === "function") return source.getQuestion();
      return source.question || null;
    },
    getAnswer() {
      if (typeof source.getAnswer === "function") return source.getAnswer();
      return source.answer ?? null;
    },
    getChoices() {
      if (typeof source.getChoices === "function") return source.getChoices();
      return Array.isArray(source.choices) ? source.choices : [];
    }
  };
}

export function createProgressAdapter(progress, source = {}) {
  return {
    load() {
      return typeof source.load === "function" ? source.load() : progress;
    },
    save(next) {
      if (typeof source.save === "function") return source.save(next);
      return next;
    }
  };
}
