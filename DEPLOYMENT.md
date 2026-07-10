# StadiumMind AI - Deployment & Operations Guide

This document describes the production build flow, containerization, and horizontal scaling strategies on Google Cloud Run.

---

## 1. Production Build Pipeline
The build pipeline is designed to compile the Express full-stack server and the Vite React single-page application into a unified, lightweight production artifact:

```bash
# 1. Installs all required packages and dependencies
npm install

# 2. Builds the Vite React SPA static assets into the /dist folder
npm run build
```

Under full-stack mode, `npm run build` runs:
`vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`

This bundles `server.ts` into a fast, standalone file (`dist/server.cjs`) that is immediately ready for production deployment.

---

## 2. Running in Production
In production, the application is started using:
```bash
npm run start
```
Which maps directly to: `node dist/server.cjs`

### Configuration Variables
* `PORT`: Set by the environment (defaulting to 3000).
* `NODE_ENV`: Should be set to `production` in live clusters to deactivate file-watching and enable maximum optimizations.
* `GEMINI_API_KEY`: Injected into the secrets registry of the hosting environment.

---

## 3. High Availability & Scaling
* **Cloud Run Auto-scaling**: Configured with a minimum of 1 instance to completely eliminate cold starts during match days, scaling up to 100+ instances during mass gate egress surges.
* **Health Checks**: The backend exposes `GET /api/health` as a readiness and liveness probe, ensuring that requests are only routed to operational containers.
---
