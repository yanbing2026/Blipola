# Architecture

## Layers

### UI
Presents Blipola, missions, hints, and learning states.

### Blipola API
Small product-facing interface:
- recommend(skill, item)
- hint(context)
- explain(context)
- speak(kind)

### Learning Engine
Owns learning decisions and difficulty:
- mastery
- action selection
- difficulty
- future review scheduling

### Progress
Stores attempts and per-item learning evidence.

### AI Provider (future)
Optional provider interface for richer language generation. It is not required for the offline core.

## Integration

A learning product should provide structured learning context to Blipola rather than embedding Blipola-specific logic throughout the product.

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
