# Kindergarten Classroom Integration

Blipola is designed as a reusable learning layer, not as a replacement for the classroom application's question engine.

## Minimal integration

```js
import { createBlipola } from "./blipola.js";

const blipola = createBlipola({
  progress,
  onEvent: event => {
    // Connect to the host application's UI/analytics adapter.
  }
});

const recommendation = blipola.recommend("letters", "A");

const context = blipola.startQuestion({
  skill: "letters",
  item: "A",
  question: "Which letter is A?",
  choices: ["A", "B", "C"],
  answer: "A"
});

const hint = blipola.hint(context);

blipola.complete(context, {
  correct: selectedAnswer === context.answer,
  firstTry: attemptCount === 1,
  attempts: attemptCount
});
```

## Host application responsibilities

The host product owns:
- question content;
- answer validation;
- UI rendering;
- navigation;
- child-facing content;
- authentication/account boundaries.

Blipola owns:
- learning context;
- recommendations;
- hint progression;
- mastery evidence;
- review timing;
- Daily Adventure;
- buddy states and events.

## Event contract

The host can subscribe to:
- `buddy-state`
- `question-started`
- `hint-requested`
- `learning-complete`
- `daily-adventure`

The event payload is intentionally small and contains learning context rather than private child profile data.

## Adapter boundary

Use `createQuestionAdapter()` and `createProgressAdapter()` when the host product's data model differs from Blipola's internal model. This keeps integration code out of the learning engine.
