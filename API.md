# StadiumMind AI - API Documentation

The StadiumMind AI backend exposes a secure, high-performance REST and streaming API to the React client on Port 3000.

---

## 1. Incidents & Operations Management

### `GET /api/incidents`
Returns a list of all active or resolved stadium operational incidents.
* **Response**: `200 OK` (Array of Incident objects)

### `POST /api/incidents`
Reports a new incident. Auto-validated by Zod schema.
* **Payload**:
  ```json
  {
    "category": "MEDICAL",
    "zone": "SECTORS_100",
    "severity": "WARNING",
    "description": "Dehydrated fan requires assistance."
  }
  ```
* **Response**: `201 Created`

### `POST /api/incidents/:id/resolve`
Marks an active incident as resolved.
* **Response**: `200 OK`

---

## 2. Transportation & Shuttles

### `GET /api/transport`
Retrieves live subway frequencies, shuttle capacities, and ETAs.
* **Response**: `200 OK`

### `POST /api/transport/adjust`
Allows an operator to trigger frequency changes or dispatch backup shuttles.
* **Payload**:
  ```json
  {
    "routeId": "SHUTTLE_LOOP_A",
    "frequency": 5
  }
  ```

---

## 3. Autonomous Multi-Agent OS Engine

### `POST /api/agents/command`
Invokes the multi-agent operating system with a high-level operational command or query.
* **Payload**:
  ```json
  {
    "command": "We have heavy crowd congestion at Gate A due to security scanner malfunctions. How should we redeploy?",
    "agentId": "operations"
  }
  ```
* **Response**: `200 OK`
  ```json
  {
    "agentId": "operations",
    "response": {
      "confidenceScore": 0.98,
      "rationale": "Mitigating scanner delay by opening overflow Gate B lines and assigning volunteers.",
      "actionSteps": [
        "Reassign 5 volunteers from Sector 100 to Gate B for manual ticket checks",
        "Broadcast push notifications to fans advising Gate B routing"
      ]
    }
  }
  ```
---
