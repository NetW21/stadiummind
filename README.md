# StadiumMind AI 🏟️🤖
### "The Autonomous AI Operating System for Smart Stadiums"
#### *A premier candidate for the FIFA World Cup 2026 GenAI Challenge*

StadiumMind AI is an enterprise-grade, autonomous multi-agent operating system designed to elevate stadium logistics, volunteer coordination, emergency dispatch, and fan operations to a state of predictive, high-efficiency intelligence.

---

## 🚀 Key Features

* **Operations Commander Core**: A unified cockpit for stadium coordinators that synthesizes real-time metrics, shuttle frequencies, gate queue bottlenecks, and active security incidents.
* **Autonomous Multi-Agent AI**: Specialized, context-isolated reasoning agents (Crowd, Transport, Volunteer, Emergency, Accessibility) powered by the Google Gemini 2.5 API with strict JSON schema enforcement.
* **Interactive Dynamic Map**: High-contrast, WCAG 2.2 AA compliant stadium overlay that visualizes gate wait-times, incident coordinates, and evacuation pathways.
* **Live Incident Dispatch Console**: Operators can report, assign, and resolve active logistics tickets, receiving real-time suggestions and explanations from the AI agents.
* **Integrated Accessibility Suite**: WCAG AA screen reader support, keyboard navigability, high-contrast toggle, text size modifiers, and accessible route generators.

---

## 📂 Architecture & Documentation Index

For deep architectural reviews, consult our comprehensive documentation:
1. **[SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)**: Clean architecture, directory structure, data patterns, and caching protocols.
2. **[SECURITY.md](./SECURITY.md)**: OWASP Top 10 mitigations, strict CSPs, rate-limiting, and sanitized LLM prompt pipelines.
3. **[DATABASE.md](./DATABASE.md)**: In-memory store schema, TypeScript interfaces, and collection details.
4. **[AGENTS.md](./AGENTS.md)**: Details on the multi-agent orchestration, structured inputs/outputs, and fallbacks.
5. **[TESTING.md](./TESTING.md)**: Unit tests, Vitest configurations, deterministic AI mocking, and accessibility coverage.
6. **[GOOGLE_TECH.md](./GOOGLE_TECH.md)**: Integration guides for Gemini 2.5, Google AI Studio, Maps API, and Cloud Run.
7. **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Packaging, builds, container variables, and auto-scaling rules.

---

## 🛠️ Technology Stack
* **Frontend**: React 19, Tailwind CSS v4, Motion Animation, Lucide Icons, Recharts
* **Backend**: Node.js, Express, tsx Engine, esbuild Compiler
* **AI Engine**: Google Gemini 2.5, `@google/genai` SDK
* **TypeScript**: Strict Mode Enabled (Zero `any` / Zero `unknown`)
---
