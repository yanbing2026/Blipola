# Blipola Product Specification

## 1. Purpose

Blipola is an offline-first learning companion for young children. It is designed to sit above learning products and provide consistent guidance, hints, practice selection, encouragement, and parent-facing insights.

## 2. Core teaching loop

**Think → Try → Learn → Celebrate**

Blipola should:
1. encourage the child to think before answering;
2. offer a small hint after difficulty;
3. simplify or demonstrate when repeated attempts fail;
4. celebrate effort and progress;
5. recommend review or a new challenge based on learning evidence.

## 3. Learning actions

The engine can choose:
- NEW — introduce a skill/item;
- PRACTICE — reinforce it;
- HINT — provide a clue;
- RETRY — retry with support;
- REVIEW — revisit later;
- CHALLENGE — extend a mastered skill;
- CELEBRATE — acknowledge meaningful progress.

## 4. Dialogue rules

Use short, warm, child-friendly language.

Preferred pattern:
**short sentence + one action + one question**

Avoid:
- shaming language;
- comparisons with other children;
- pressure or guilt;
- revealing answers immediately when a hint can help.

## 5. AI boundary

The Learning Engine remains authoritative.

A future AI provider may generate:
- hints;
- explanations;
- practice variations;
- parent summaries.

The AI provider must receive structured learning context and must not independently change mastery, scoring, progression, or safety rules.

## 6. Daily Quest

Three recurring goals:
- Learn — practice something new;
- Think — solve a challenge;
- Remember — review a learned skill.

Completing the daily set can award a small in-app reward.

## 7. Privacy direction

Child mode should be usable without:
- child email;
- precise location;
- unnecessary personal profile data;
- advertising identifiers;
- external AI credentials.

The prototype stores learning state locally.

## 8. Integration target

The first product integration is Kindergarten Classroom. Blipola should remain reusable so future learning products can share the same buddy, learning engine, and parent insight model.
