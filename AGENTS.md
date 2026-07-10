# StadiumMind AI - Autonomous Multi-Agent Design

StadiumMind AI is an autonomous Operating System orchestrated by a cohort of specialized, single-responsibility intelligence agents.

---

## 1. Multi-Agent Organization Matrix

| Agent Name | Scope of Responsibility | Critical Input Signals | Output Schema Fields |
| :--- | :--- | :--- | :--- |
| **Operations Commander** | Global stadium health synthesis & tactical command. | System-wide aggregates, active incidents, weather. | `strategicAction`, `priority`, `agentCoordination` |
| **Crowd Intelligence** | Monitoring bottlenecks, flow routing, & waiting lines. | Gate check-ins, sensor metrics, camera feeds. | `gateStatus`, `congestionIndex`, `reroutingAdvise` |
| **Emergency response** | Dynamic hazard mitigations, safety path calculations. | Medical alarms, safety breaches, smoke indicators. | `evacuateAlert`, `dispatchInstructions`, `safetyRationale` |
| **Transport Optimizer** | Managing shuttle loops, passenger surges, and traffic. | Metro frequency, shuttle loads, parking levels. | `metroFrequencies`, `shuttleAdjustments`, `waitTimes` |
| **Volunteer Coordinator** | Dynamic rostering, skill matching, zone assignment. | Missing staffing levels, language mismatches. | `reassignments`, `taskDispatches`, `shiftSchedules` |
| **Accessibility Assistant**| Accessible navigation, sensory support, wheel assistance. | Help requests, sensory overload reports. | `accessibleRoutes`, `seatAvailability`, `sensoryStatus` |

---

## 2. Multi-Agent Communication Architecture

Each agent is defined on the server side using the `@google/genai` SDK and structured prompting:

```
[ Incoming Request / Event Trigger ]
                 │
                 ▼
     [ Operations Commander ]
                 │
   ┌─────────────┼─────────────┐
   ▼             ▼             ▼
[ Crowd ]   [ Emergency ]  [ Transport ] ...
   │             │             │
   └─────────────┼─────────────┘
                 ▼
  [ Synthesized Strategic Action ]
```

---

## 3. Structure Enforcement & Error Fallbacks
Every agent returns a strict JSON schema with:
- `confidenceScore` (0.0 to 1.0)
- `rationale` (Detailed thinking steps for AI Explainability)
- `actionSteps` (Array of literal execution actions)

If an agent fails to return valid JSON or encounters a model timeout, the system falls back to a deterministic rules-engine response (e.g., standard evacuation protocol for Emergencies).
