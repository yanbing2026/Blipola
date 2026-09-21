# Architecture

## Layers
- **UI** — questions, missions, hints, and buddy states.
- **Blipola API** — the stable product-facing integration surface.
- **Learning Engine** — mastery, action selection, difficulty, review scheduling, and Daily Adventure.
- **Progress** — attempts, first-try accuracy, recent errors, streak, rewards, and review dates.
- **AI Provider (future)** — optional language generation only.

## Product API
- `recommend(skill, item)`
- `startQuestion(context)`
- `respond(context)`
- `hint(context)`
- `explain(context)`
- `complete(context, outcome)`
- `dailyAdventure()`
- `speak(kind)`

## Event API
`onEvent(event)` receives:
- `buddy-state`
- `learning-complete`
- `daily-adventure`

## Integration flow
```
Learning Product
      │
      ▼
  Blipola API
      │
 ┌────┴─────────────┐
 ▼                  ▼
Learning Engine   AI Provider
 ▼
Progress
```

The Learning Engine remains authoritative. AI may generate language, but it cannot change scoring, mastery, progression, review timing, or safety decisions.
