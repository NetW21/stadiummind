# StadiumMind AI - Database & State Architecture

StadiumMind AI uses a hybrid data model:
1. **Server-Side In-Memory Operational Store**: Tracks high-velocity real-time incidents, crowd flows, shuttle capacities, and active emergency alerts during stadium operations.
2. **Client-Side Persistent Cache**: Preserves local operator preferences, active terminal sessions, and local log configurations across page reloads via `localStorage`.

---

## 1. Core Data Models (TypeScript Interfaces)

### A. Incident Schema
Represents an operational incident, medical request, or security event.
```typescript
export interface Incident {
  id: string;
  category: 'CROWD' | 'MEDICAL' | 'SECURITY' | 'INFRASTRUCTURE' | 'TRANSPORT';
  zone: 'GATE_A' | 'GATE_B' | 'CONCOURSE_1' | 'CONCOURSE_2' | 'SECTORS_100' | 'SECTORS_200';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  status: 'REPORTED' | 'DISPATCHED' | 'RESOLVED';
  description: string;
  reportedAt: string;
  resolvedAt?: string;
  assignedVolunteers: string[];
}
```

### B. Shuttle Route Schema
Tracks terminal-to-stadium transportation metrics.
```typescript
export interface ShuttleRoute {
  id: string;
  name: string;
  source: string;
  destination: string;
  capacityPercentage: number;
  frequencyMinutes: number;
  status: 'NORMAL' | 'DELAYED' | 'SUSPENDED';
  etaMinutes: number;
}
```

### C. Volunteer Assignment Schema
Defines volunteer staffing rosters and real-time zone placements.
```typescript
export interface Volunteer {
  id: string;
  name: string;
  languages: string[];
  skills: string[];
  assignedZone: string;
  status: 'ACTIVE' | 'BREAK' | 'OFF_DUTY';
  currentTaskId?: string;
}
```

---

## 2. In-Memory Database Initialization
Upon initialization, the backend loads a comprehensive mock dataset representing the active operational state of a World Cup matchday (e.g., Mexico vs. USA, at Estadio Azteca). This dataset provides immediate realistic data for charts, metrics, maps, and agent evaluation.
