# AI Game Concierge

AI Game Concierge is a production-minded Expo + TypeScript prototype for Cash Giraffe. The app presents a Quest Log rewards home and an Explore More discovery surface where players describe what they want to play right now and receive explainable game recommendations.

## Problem Statement

Game recommendations often overweight historical behavior. A player who wanted a merge game yesterday may want a logic game today, a story adventure tomorrow, or the highest reward opportunity during a short session. Static history is not the same as current intent.

## Product Hypothesis

If users can express their current gaming intent in natural language, Cash Giraffe can recommend games that better match mood, time, reward goals, and genre preferences in the moment. This improves trust because every recommendation includes a clear "Why we recommended this" explanation.

## Architecture Overview

- `src/pages` contains screen-level UI for Quest Log and Explore More.
- `src/components` contains reusable presentation primitives and recommendation-specific cards/lists.
- `src/store/useGameDiscoveryStore.ts` owns query, loading, routing, errors, and recommendations.
- `src/utils/gameMatcher.ts` performs local keyword-to-preference extraction.
- `src/services/recommendationService.ts` scores games across title, genres, mood, rich descriptions, and structured attributes, then returns the top five matches.
- `src/services/llmService.ts` calls DeepSeek only for ambiguous intent.
- `src/constants` defines the light, friendly visual system.

## Routing Logic

1. The user submits a natural-language query.
2. The app first runs local keyword extraction and catalog inspection across title, genres, mood, description, and structured attributes.
3. If meaningful preferences or strong catalog matches are found, recommendations are generated locally and `routingPath` is `keyword`.
4. If the query is ambiguous, the app streams a DeepSeek request and `routingPath` is `llm`.
5. DeepSeek returns structured JSON preferences, never user-facing chat copy.

## AI Flow

Natural Language → Catalog + Keyword Inspection → Optional AI Intent Extraction → Structured Preferences → Weighted Game Matching → Explainable Recommendations

DeepSeek is used as a preference extraction service, not as a chatbot. The UI presents recommendation results rather than a conversational transcript.

## Recommendation Scoring

The recommendation engine applies weighted scoring:

- Genre Match: +5
- Mood Match: +4
- Storyline Match: +4
- Reward Potential Match: +3
- Reward Frequency Match: +2
- Progression Match: +3
- Complexity Match: +2
- Session Length Match: +2

Each result includes `score` and `matchReason` so users understand the recommendation. Description matches add semantic weight because game descriptions contain richer intent signals than tags alone.

## Why Zustand

The requested architecture uses a small centralized game discovery store rather than Redux, MobX, React Query, Firebase, Supabase, or backend state. This keeps prototype state easy to reason about while preserving a scalable boundary between UI, AI extraction, and recommendation scoring.

## Future Improvements

- Add real Cash Giraffe catalog data and reward telemetry.
- Add personalization signals as optional ranking features rather than hard filters.
- A/B test keyword-only, LLM-assisted, and hybrid routing.
- Persist dismissed recommendations locally.
- Add analytics around query intent, routing path, and recommendation selection.
- Introduce accessibility-focused motion reduction settings.

## Environment Setup

A `.env` file should already exist and contain:

```bash
EXPO_PUBLIC_DEEPSEEK_API_KEY=your_deepseek_api_key
```

Install dependencies and start Expo:

```bash
npm install
npm run start
```

No backend, database, Firebase, Supabase, React Query, Redux, Redux Toolkit, MobX, or app-state Context API is required.
