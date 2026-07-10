# StadiumMind AI - System Architecture
## "The Autonomous AI Operating System for Smart Stadiums"

StadiumMind AI is designed as a modular, autonomous multi-agent operating system for managing smart stadium logistics, fan engagement, crowd movement, security, and operations for the FIFA World Cup 2026. This document details the software, hardware, and integration architecture of the platform.

---

## 1. High-Level Architectural Pattern
StadiumMind AI utilizes a **Full-Stack Clean Architecture** combined with a **Server-Side Orchestrated Multi-Agent Autonomous Pipeline**.

```
+--------------------------------------------------------------------------------+
|                                FRONTEND LAYER                                  |
|                 (React 19, Tailwind CSS v4, Motion Animation)                 |
+------------------------------------+-------------------------------------------+
                                     |
                                     | JSON REST API / Server-Sent Events (SSE)
                                     v
+--------------------------------------------------------------------------------+
|                                BACKEND LAYER                                   |
|                (Node.js, Express, tsx Engine, Unified Server)                  |
+------------------------------------+-------------------------------------------+
                                     |
             +-----------------------+-----------------------+
             |                                               |
             v                                               v
+------------------------+                       +------------------------+
|   MULTI-AGENT ENGINE   |                       |    DATABASE & CACHE    |
|  (Gemini 2.5 SDK API)  |                       |  (In-Memory DB /       |
|  - Operations Agent    |                       |   Volatile Registry)   |
|  - Crowd Intel Agent   |                       +------------------------+
|  - Emergency Agent     |
|  - Transport Agent     |
|  - Volunteer Agent     |
+------------------------+
```

---

## 2. Directory Layout
```
/
├── .env.example                # Template for environment variables
├── package.json                # Project dependencies and scripts
├── server.ts                   # Express Backend Entrypoint & Vite Dev Middleware
├── metadata.json               # Platform-specific capabilities & permissions
├── tsconfig.json               # TypeScript Configuration
├── vite.config.ts              # Vite Bundler Configuration
├── SYSTEM_ARCHITECTURE.md      # This document
├── SECURITY.md                 # Security blueprints & OWASP guides
├── DATABASE.md                 # State persistence & collection schemas
├── AGENTS.md                   # Multi-agent prompt definitions & inputs
├── TESTING.md                  # Test design and mock suites
├── GOOGLE_TECH.md              # Google integration points
├── DEPLOYMENT.md               # Continuous integration & production builds
└── src/                        # Client-side codebase
    ├── main.tsx                # Client Entrypoint
    ├── index.css               # Tailwind & font imports
    ├── App.tsx                 # Core Application Controller
    ├── types/                  # Strict Type Declarations
    │   └── index.ts
    ├── components/             # Reusable UI Components
    │   ├── Navigation.tsx      # Fluid Header & Controller
    │   ├── Dashboard.tsx       # Live Executive Summary Screen
    │   ├── CrowdHeatmap.tsx    # Interactive Stadium Map / Crowd flow
    │   ├── TransportHub.tsx    # Traffic, Shuttles & Optimization
    │   ├── EmergencyCentre.tsx # Alert systems & agent overrides
    │   ├── AgentTerminal.tsx   # Interactive Multi-Agent Operating System Core
    │   └── Accessibility.tsx   # Screen Assist & WCAG controls
    └── lib/                    # Shared Helpers & Utilities
        └── api.ts              # Server-proxied fetch and streaming interfaces
```

---

## 3. Modular AI Agent Pipeline
Every operational request is parsed, categorized, and delegated to a specialized agent.
1. **Operations Commander**: Evaluates overall stadium status, synthesizes reports from other agents, and outputs high-level strategic commands.
2. **Crowd Intelligence**: Evaluates gate bottlenecks, seating congestion, and calculates predictive wait times.
3. **Emergency Response**: Triggers active hazard evacuations, medical dispatch routes, and explains safety reasoning.
4. **Transportation Optimizer**: Manages real-time shuttle loops, train frequencies, and parking lot capacity.
5. **Volunteer Coordinator**: Handles volunteer check-ins, skill matching, and dynamic zone assignments.
6. **Accessibility Assistant**: Facilitates wheelchair routing, companion seat searches, and sensory room navigation.

---

## 4. API Design & Security Proxying
The backend acts as a **secure gateway** for all Gemini API calls and system manipulations, ensuring zero secrets are exposed to the client. Rate-limiting and schema-enforcement are implemented on every route via standard Express middlewares.

---

## 5. Offline & Caching Strategy
* **Data Caching**: Local states are cached using browser `localStorage` and synchronized with the backend.
* **Service Resiliency**: Fallback standard operations are hardcoded so the terminal is still usable even when external API services are momentarily unreachable.
