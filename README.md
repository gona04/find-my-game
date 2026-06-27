# AI Game Concierge

AI Game Concierge is a production-minded React Native (Expo) prototype built for the Cash Giraffe take-home assignment. It introduces an AI-powered game discovery experience where players can describe what they want to play in natural language and receive explainable recommendations.

---

# Problem Statement

Cash Giraffe recommends games based on existing logic, but sometimes users already know the type of game they want to play.

Examples:

* "I want something relaxing before bed."
* "Games similar to Monkey Island."
* "I only have 10 minutes."
* "I want the highest reward potential."

The goal of this prototype is to allow users to search using natural language instead of browsing the catalog manually.

---

# Product Hypothesis

If users can express their current gaming intent in natural language, recommendations become more relevant because they reflect the player's current mood instead of only historical behavior.

Every recommendation includes a short explanation describing why it was suggested.

---

# Features

* AI-powered natural language search
* Explainable recommendations
* Hybrid keyword + AI routing
* SERPER-assisted contextual search
* Reusable component architecture
* Feature-based project organization
* Fully typed with TypeScript
* Jest test suite

---

# Architecture

The project is organized using a feature-first architecture.

```text
src/
│
├── features/
│   ├── explore/
│   ├── quest/
│   └── recommendations/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   └── theme/
│
├── store/
└── assets/
```

The application separates:

* UI Components
* Business Logic
* Search Logic
* AI Services
* Recommendation Engine
* Shared Utilities

making the project easier to scale and maintain.

---

# Search Pipeline

The recommendation pipeline is intentionally hybrid.

```
User Query
      │
      ▼
Keyword Matching
      │
      ├── Strong Match
      │      │
      │      ▼
      │  Recommendation Engine
      │
      └── Weak Match
             │
             ▼
       SERPER Context Search
             │
             ▼
      Quality Evaluation
             │
      ├── High Confidence
      │         │
      │         ▼
      │  Recommendation Engine
      │
      └── Low Confidence
                │
                ▼
         DeepSeek Intent Extraction
                │
                ▼
        Recommendation Engine
```

The objective is to avoid unnecessary LLM calls while still supporting abstract searches and game references.

---

# Recommendation Engine

Recommendations are ranked using weighted scoring across:

* Genres
* Mood
* Storyline
* Reward Potential
* Reward Frequency
* Progression
* Complexity
* Session Length
* Description Similarity

Every recommendation contains:

* score
* matchReason

so users understand why it was suggested.

---

# Tech Stack

* React Native
* Expo SDK 54
* TypeScript
* Zustand
* Jest
* DeepSeek API
* SERPER API

---

# Testing

The project currently contains:

* **152 passing tests**
* **7 test suites**
* **93.46% statement coverage**
* **94.46% line coverage**
* **95.38% function coverage**

Tests cover recommendation logic, matching utilities, services, and reusable UI components.

Run the test suite:

```bash
npm test
```

Run coverage:

```bash
npm run test:coverage
```

---

# Environment Setup

Create a `.env.local` file in the project root.

```bash
EXPO_PUBLIC_DEEPSEEK_API_KEY=YOUR_DEEPSEEK_API_KEY
EXPO_PUBLIC_SERPER_API_KEY=YOUR_SERPER_API_KEY
```

Install dependencies:

```bash
npm install
```

Run the project:

```bash
npm start
```

---

# Future Improvements

Given more time, I would prioritise:

* Vector database for semantic retrieval
* Backend proxy to protect API keys
* User personalization based on play history
* Query caching
* Analytics and A/B testing
* Redux Toolkit + Async Thunks for larger-scale state management
* Real Cash Giraffe reward data integration

---

# Notes

This prototype communicates directly with external AI services for simplicity.

In a production environment, these API calls would be routed through a backend service to protect API keys, enable caching, rate limiting, analytics, and request validation.
