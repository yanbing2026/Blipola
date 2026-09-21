const EVENT_TYPES = [
  "buddy-state",
  "question-started",
  "hint-requested",
  "learning-complete",
  "daily-adventure"
];

export function createEventBus() {
  const listeners = new Map();

  function on(type, handler) {
    if (typeof handler !== "function") return () => {};
    const list = listeners.get(type) || [];
    list.push(handler);
    listeners.set(type, list);
    return () => {
      const current = listeners.get(type) || [];
      listeners.set(type, current.filter(fn => fn !== handler));
    };
  }

  function emit(event) {
    if (!event?.type) return;
    const list = listeners.get(event.type) || [];
    const all = listeners.get("*") || [];
    [...list, ...all].forEach(handler => handler(event));
  }

  function clear() {
    listeners.clear();
  }

  return { on, emit, clear, types: [...EVENT_TYPES] };
}
