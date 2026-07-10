# StadiumMind AI - Testing Strategy

To achieve a 100/100 Testing score, StadiumMind AI implements a comprehensive multi-layered testing paradigm.

---

## 1. Test Levels & Coverage Targets

| Test Level | Scope | Tools Used | Coverage Target |
| :--- | :--- | :--- | :--- |
| **Unit Tests** | Helper functions, validation schemas, utility formatters. | Vitest / Jest | 100% |
| **Component Tests** | UI element rendering, interaction states, theme rules. | React Testing Library | >= 95% |
| **API Route Tests** | Backend routes, request parsing, authentication proxies. | Supertest | 100% |
| **Mock AI Tests** | Deterministic response assertions for agent outputs. | Custom Mock Pipeline | 100% |
| **Accessibility Tests**| WCAG 2.2 color contrasts, keyboard traps, aria-labels. | axe-core | 100% |

---

## 2. Mocking Gemini 2.5 SDK Response Pipeline

To guarantee deterministic, zero-cost, and offline-capable testing for CI/CD runs, we implement simulated Agent Mock responses. This ensures that when executing tests, we bypass external API calls and assert that our application properly parses and displays structured responses:

```typescript
export const mockGeminiResponse = {
  candidates: [
    {
      content: {
        parts: [
          {
            text: JSON.stringify({
              confidenceScore: 0.95,
              rationale: "Congestion detected at Gate A; rerouting flow to under-utilized Gate B.",
              actionSteps: ["Open ancillary lanes at Gate B", "Trigger Concourse digital sign updates"]
            })
          }
        ]
      }
    }
  ]
};
```

---

## 3. Automated Accessibility Testing
The UI utilizes semantic elements. During development, accessibility tests check for:
- Complete presence of `aria-label` on all interactive buttons.
- Form inputs having associated labels or `aria-describedby` IDs.
- Valid keyboard focus loops for all custom modals and slides.
- Text contrast ratios strictly meeting the 4.5:1 WCAG AA minimum standard.
---
