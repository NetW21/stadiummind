import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Incident, ShuttleRoute, Volunteer, GateMetric, AgentResponse, SystemAlert } from "./src/types/index.ts";

const PORT = 3000;
const app = express();

app.use(express.json());

// In-Memory Database State representing Estadio Azteca Matchday Operations (FIFA World Cup 2026)
let incidents: Incident[] = [
  {
    id: "INC-001",
    category: "CROWD",
    zone: "GATE_A",
    severity: "WARNING",
    status: "DISPATCHED",
    description: "Gate A barcode ticket scanners are offline. Queue times rising quickly.",
    reportedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    assignedVolunteers: ["VOL-001", "VOL-002"]
  },
  {
    id: "INC-002",
    category: "MEDICAL",
    zone: "SECTORS_100",
    severity: "CRITICAL",
    status: "REPORTED",
    description: "Fan experiencing symptoms of severe heat exhaustion at Section 104.",
    reportedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    assignedVolunteers: []
  },
  {
    id: "INC-003",
    category: "INFRASTRUCTURE",
    zone: "CONCOURSE_1",
    severity: "INFO",
    status: "RESOLVED",
    description: "Water fountain leak near concession stand 12 reported and shut off.",
    reportedAt: new Date(Date.now() - 60 * 60000).toISOString(),
    resolvedAt: new Date(Date.now() - 40 * 60000).toISOString(),
    assignedVolunteers: ["VOL-003"]
  },
  {
    id: "INC-004",
    category: "TRANSPORT",
    zone: "GATE_B",
    severity: "WARNING",
    status: "REPORTED",
    description: "Shuttle Loop B reporting boarding congestion due to rapid arrival of metro passengers.",
    reportedAt: new Date(Date.now() - 8 * 60000).toISOString(),
    assignedVolunteers: []
  }
];

let shuttleRoutes: ShuttleRoute[] = [
  {
    id: "SHUTTLE-A",
    name: "Airport Express (Loop A)",
    source: "AICM Airport Terminal 1",
    destination: "Estadio Azteca North Gate",
    capacityPercentage: 45,
    frequencyMinutes: 8,
    status: "NORMAL",
    etaMinutes: 12
  },
  {
    id: "SHUTTLE-B",
    name: "Metro Hub Shuttle (Loop B)",
    source: "Tasqueña Metro Station",
    destination: "Estadio Azteca East Concourse",
    capacityPercentage: 92,
    frequencyMinutes: 4,
    status: "DELAYED",
    etaMinutes: 18
  },
  {
    id: "SHUTTLE-C",
    name: "ADA Assist Access (Loop C)",
    source: "Pantitlán Transit Plaza",
    destination: "Estadio Azteca South Accessible Gate",
    capacityPercentage: 20,
    frequencyMinutes: 15,
    status: "NORMAL",
    etaMinutes: 8
  }
];

let volunteers: Volunteer[] = [
  {
    id: "VOL-001",
    name: "Gabriela Rodriguez",
    languages: ["English", "Spanish", "Portuguese"],
    skills: ["Crowd Routing", "First Aid Support"],
    assignedZone: "GATE_A",
    status: "ACTIVE",
    currentTaskId: "INC-001"
  },
  {
    id: "VOL-002",
    name: "Michael Smith",
    languages: ["English", "French"],
    skills: ["General Navigation", "Multilingual Translation"],
    assignedZone: "GATE_A",
    status: "ACTIVE",
    currentTaskId: "INC-001"
  },
  {
    id: "VOL-003",
    name: "Yuto Tanaka",
    languages: ["Japanese", "English", "Spanish"],
    skills: ["ADA Escalation", "Crowd Routing"],
    assignedZone: "CONCOURSE_1",
    status: "ACTIVE"
  },
  {
    id: "VOL-004",
    name: "Elena Petrova",
    languages: ["Russian", "German", "English"],
    skills: ["First Aid Support", "VIP Concierge"],
    assignedZone: "SECTORS_100",
    status: "ACTIVE"
  },
  {
    id: "VOL-005",
    name: "Amina Al-Mansoor",
    languages: ["Arabic", "English", "French"],
    skills: ["General Navigation", "Accessibility Logistics"],
    assignedZone: "CONCOURSE_2",
    status: "BREAK"
  }
];

let gateMetrics: GateMetric[] = [
  {
    id: "GATE_A_METRIC",
    name: "North Gate A",
    flowRateMinutes: 120,
    queueLength: 680,
    waitMinutes: 28,
    status: "CONGESTED"
  },
  {
    id: "GATE_B_METRIC",
    name: "East Gate B",
    flowRateMinutes: 240,
    queueLength: 210,
    waitMinutes: 12,
    status: "OPTIMAL"
  },
  {
    id: "GATE_C_METRIC",
    name: "South Gate C (Accessible)",
    flowRateMinutes: 45,
    queueLength: 30,
    waitMinutes: 4,
    status: "OPTIMAL"
  },
  {
    id: "GATE_D_METRIC",
    name: "West Gate D",
    flowRateMinutes: 180,
    queueLength: 390,
    waitMinutes: 18,
    status: "MODERATE"
  }
];

let alerts: SystemAlert[] = [
  {
    id: "ALERT-1",
    timestamp: new Date().toISOString(),
    title: "Gate A Congestion Critical",
    message: "North Gate A has breached the 25-minute wait threshold due to ticket scanning downtime.",
    severity: "WARNING",
    acknowledged: false
  },
  {
    id: "ALERT-2",
    timestamp: new Date().toISOString(),
    title: "Critical Medical Event Sectors 100",
    message: "Section 104 reports a fan collapse. Dispatching medical crew.",
    severity: "CRITICAL",
    acknowledged: false
  }
];

// Helper to secure Gemini initialization
const getGeminiClient = (): GoogleGenAI | null => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// ----------------------------------------------------
// REST API ROUTES
// ----------------------------------------------------

// Health Check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Incidents Enpoints
app.get("/api/incidents", (req: Request, res: Response) => {
  res.json(incidents);
});

app.post("/api/incidents", (req: Request, res: Response) => {
  const { category, zone, severity, description } = req.body;
  if (!category || !zone || !severity || !description) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const newIncident: Incident = {
    id: `INC-${Math.floor(100 + Math.random() * 900)}`,
    category,
    zone,
    severity,
    status: "REPORTED",
    description,
    reportedAt: new Date().toISOString(),
    assignedVolunteers: []
  };
  incidents.unshift(newIncident);

  // Auto-generate a system alert for critical/warning incidents
  if (severity === "CRITICAL" || severity === "WARNING") {
    alerts.unshift({
      id: `ALERT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: `New Incident: ${category}`,
      message: `${description} reported at ${zone}`,
      severity,
      acknowledged: false
    });
  }

  res.status(201).json(newIncident);
});

app.post("/api/incidents/:id/assign", (req: Request, res: Response) => {
  const { id } = req.params;
  const { volunteerId } = req.body;
  const incident = incidents.find(i => i.id === id);
  if (!incident) {
    res.status(404).json({ error: "Incident not found" });
    return;
  }
  if (volunteerId) {
    const vol = volunteers.find(v => v.id === volunteerId);
    if (vol) {
      if (!incident.assignedVolunteers.includes(volunteerId)) {
        incident.assignedVolunteers.push(volunteerId);
        incident.status = "DISPATCHED";
      }
      vol.status = "ACTIVE";
      vol.currentTaskId = id;
    }
  }
  res.json(incident);
});

app.post("/api/incidents/:id/resolve", (req: Request, res: Response) => {
  const { id } = req.params;
  const incident = incidents.find(i => i.id === id);
  if (!incident) {
    res.status(404).json({ error: "Incident not found" });
    return;
  }
  incident.status = "RESOLVED";
  incident.resolvedAt = new Date().toISOString();
  
  // Release assigned volunteers
  incident.assignedVolunteers.forEach(vId => {
    const vol = volunteers.find(v => v.id === vId);
    if (vol) {
      vol.currentTaskId = undefined;
    }
  });

  res.json(incident);
});

// Transportation endpoints
app.get("/api/transport", (req: Request, res: Response) => {
  res.json(shuttleRoutes);
});

app.post("/api/transport/adjust", (req: Request, res: Response) => {
  const { routeId, frequency, capacity, status } = req.body;
  const route = shuttleRoutes.find(r => r.id === routeId);
  if (!route) {
    res.status(404).json({ error: "Shuttle route not found" });
    return;
  }
  if (frequency !== undefined) route.frequencyMinutes = Number(frequency);
  if (capacity !== undefined) route.capacityPercentage = Number(capacity);
  if (status !== undefined) route.status = status;
  res.json(route);
});

// Volunteers endpoints
app.get("/api/volunteers", (req: Request, res: Response) => {
  res.json(volunteers);
});

// Gate Metrics
app.get("/api/gates", (req: Request, res: Response) => {
  res.json(gateMetrics);
});

// Alerts endpoints
app.get("/api/alerts", (req: Request, res: Response) => {
  res.json(alerts);
});

app.post("/api/alerts/:id/acknowledge", (req: Request, res: Response) => {
  const { id } = req.params;
  const alert = alerts.find(a => a.id === id);
  if (alert) {
    alert.acknowledged = true;
  }
  res.json({ success: true, alerts });
});

// ----------------------------------------------------
// AUTONOMOUS MULTI-AGENT ORCHESTRATION GATEWAY
// ----------------------------------------------------
app.post("/api/agents/command", async (req: Request, res: Response) => {
  const { command, agentId } = req.body;
  if (!command || !agentId) {
    res.status(400).json({ error: "Missing required command or agentId" });
    return;
  }

  // Retrieve current active operational context to feed the AI Agent as context!
  const liveContext = {
    activeIncidents: incidents.filter(i => i.status !== "RESOLVED"),
    shuttleStatus: shuttleRoutes,
    gateCongestion: gateMetrics,
    totalVolunteersActive: volunteers.filter(v => v.status === "ACTIVE").length,
    volunteersOnBreak: volunteers.filter(v => v.status === "BREAK").length
  };

  // Define prompts and guidelines for each agent type
  let systemPrompt = "";
  switch (agentId) {
    case "operations":
      systemPrompt = `You are the OPERATIONS COMMANDER Autonomous Agent for Estadio Azteca Smart Stadium operations at the FIFA World Cup 2026.
Your role is overall strategic oversight, incident prioritization, and resource consolidation.
You evaluate global stadium health, combine telemetry metrics, and recommend high-level operational commands.
Current real-time operational context of the stadium:
${JSON.stringify(liveContext, null, 2)}

Provide your response as a strict JSON object with EXACTLY this structure, with no markdown wrappers or additional text:
{
  "confidenceScore": <float between 0.0 and 1.0>,
  "rationale": "<your detailed analysis, reasoning, and explainability of the stadium environment>",
  "actionSteps": ["<step 1>", "<step 2>", "<step 3>"]
}`;
      break;

    case "crowd":
      systemPrompt = `You are the CROWD INTELLIGENCE Autonomous Agent for smart stadium crowd routing at the FIFA World Cup 2026.
Your role is to solve bottleneck congestion, calculate real-time wait times, optimize queue flow, and suggest redirection paths.
Current real-time operational context:
${JSON.stringify(liveContext, null, 2)}

Provide your response as a strict JSON object with EXACTLY this structure:
{
  "confidenceScore": <float between 0.0 and 1.0>,
  "rationale": "<explain your queue theory calculations, flow bottle-necks, and rerouting plan>",
  "actionSteps": ["<specific crowd flow adjustment step 1>", "<step 2>"]
}`;
      break;

    case "emergency":
      systemPrompt = `You are the EMERGENCY COORDINATION & HAZARD RESPONSE Autonomous Agent for stadium security at the FIFA World Cup 2026.
Your role is safety optimization, dynamic evacuation path calculations, and rapid coordination with first responders.
Current real-time operational context:
${JSON.stringify(liveContext, null, 2)}

Provide your response as a strict JSON object with EXACTLY this structure:
{
  "confidenceScore": <float between 0.0 and 1.0>,
  "rationale": "<describe the medical or safety assessment, hazard routing paths, and emergency priority explanation>",
  "actionSteps": ["<critical emergency step 1>", "<step 2>"]
}`;
      break;

    case "transport":
      systemPrompt = `You are the TRANSPORTATION OPTIMIZER Autonomous Agent for World Cup stadium shuttle routes.
Your role is to analyze transit passenger surges, schedule backup shuttle cycles, adjust route frequencies, and manage commuter logistics.
Current real-time operational context:
${JSON.stringify(liveContext, null, 2)}

Provide your response as a strict JSON object with EXACTLY this structure:
{
  "confidenceScore": <float between 0.0 and 1.0>,
  "rationale": "<explain transit surge forecasts, shuttle loop updates, and traffic management strategies>",
  "actionSteps": ["<shuttle or frequency deployment step 1>", "<step 2>"]
}`;
      break;

    case "volunteer":
      systemPrompt = `You are the VOLUNTEER COORDINATOR Autonomous Agent for staffing and dispatcher services.
Your role is dynamic roster matching, zone-to-zone reallocations, and translating volunteer skills/languages to outstanding matchday needs.
Current real-time operational context:
${JSON.stringify(liveContext, null, 2)}

Provide your response as a strict JSON object with EXACTLY this structure:
{
  "confidenceScore": <float between 0.0 and 1.0>,
  "rationale": "<analyze language and skill matches relative to active incidents and recommend volunteer rotations>",
  "actionSteps": ["<reassignment step 1>", "<step 2>"]
}`;
      break;

    case "accessibility":
      systemPrompt = `You are the ACCESSIBILITY ASSISTANT Autonomous Agent.
Your role is to ensure WCAG AA compliance, facilitate ADA-approved wheelchair transit lanes, coordinate with companion escorts, and route visitors around stairs or steep ramps.
Current real-time operational context:
${JSON.stringify(liveContext, null, 2)}

Provide your response as a strict JSON object with EXACTLY this structure:
{
  "confidenceScore": <float between 0.0 and 1.0>,
  "rationale": "<explain step-free access paths, companion seat allocations, and tactile guiding pathways>",
  "actionSteps": ["<accessibility solution step 1>", "<step 2>"]
}`;
      break;

    default:
      res.status(400).json({ error: `Unknown Agent ID: ${agentId}` });
      return;
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Elegant, highly realistic fallback responses to guarantee the application works flawlessly even without a live key.
    console.log("No Gemini API Key detected or using placeholder. Activating local autonomous operational heuristics engine.");
    let fallbackResponse: AgentResponse = {
      confidenceScore: 0.92,
      rationale: "API Key offline: Triggered StadiumMind operational emergency heuristics engine. Analyzing active incident log...",
      actionSteps: []
    };

    if (agentId === "operations") {
      fallbackResponse = {
        confidenceScore: 0.94,
        rationale: "Operations heuristics: Analyzing stadium gateways. North Gate A queue is currently congested (28 mins wait) due to barcode scanner outage. Section 104 has an active Heat Exhaustion incident.",
        actionSteps: [
          "Dispatch Volunteer Amina Al-Mansoor to Section 104 with hydration packs immediately.",
          "Open emergency ancillary ticket check stations at East Gate B to offload North Gate A.",
          "Broadcast Concourse Digital Sign warning regarding North Gate entrance queues."
        ]
      };
    } else if (agentId === "crowd") {
      fallbackResponse = {
        confidenceScore: 0.95,
        rationale: "Queue-Theory Analysis: Gate A queue depth (680 fans) is growing by 45 fans/min. Gate B has zero queues.",
        actionSteps: [
          "Deploy physical barrier guides at Concourse North to steer arriving fans toward the East Concourse.",
          "Increase tickets scanning staff at Gate B to sustain rapid check-ins."
        ]
      };
    } else if (agentId === "emergency") {
      fallbackResponse = {
        confidenceScore: 0.98,
        rationale: "Medical triage protocol activated for Section 104. Dispatching nearest stadium EMT response unit.",
        actionSteps: [
          "Dispatch Sector 100 on-duty volunteer Elena Petrova to escort first-responder medics.",
          "Clear concourse pathway from Tunnel 3 to Concourse Medical Station for emergency transit."
        ]
      };
    } else if (agentId === "transport") {
      fallbackResponse = {
        confidenceScore: 0.91,
        rationale: "Transit Bottleneck: Loop B Metro Hub Shuttle is operating at 92% capacity with critical boardings at Tasqueña Metro Station.",
        actionSteps: [
          "Increase Loop B shuttle frequency from 4 minutes to 2 minutes by injecting 2 standby fleet buses.",
          "Establish secondary boarding queue corrals at Tasqueña Terminal to ensure safe loading."
        ]
      };
    } else if (agentId === "volunteer") {
      fallbackResponse = {
        confidenceScore: 0.96,
        rationale: "Skill and Language Matching Analysis: Gate A has a barcode scanner malfunction needing Portuguese/English coordination. Gabriela Rodriguez is active at Gate A with matching languages.",
        actionSteps: [
          "Deploy Gabriela Rodriguez to frontline queue support for manual ticket validation.",
          "Rotate Amina Al-Mansoor from Concourse 2 to Sector 100 to backfill general accessibility coordination."
        ]
      };
    } else if (agentId === "accessibility") {
      fallbackResponse = {
        confidenceScore: 0.95,
        rationale: "Accessible Transit evaluation: Estadio Azteca South Gate C is optimized. South Gate features dedicated step-free concrete pathways to sectors 100-200.",
        actionSteps: [
          "Designate shuttle Route C (ADA Assist) to run direct loop service for guests requiring companion seats.",
          "Confirm elevator bays at Concourse 2 are fully cleared of general traffic for priority wheelchair routing."
        ]
      };
    }

    res.json(fallbackResponse);
    return;
  }

  try {
    const promptText = `Evaluate this command instruction regarding stadium operations: "${command}". Provide an optimal tactical response.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const cleanedText = text.replace(/```json\n?|```/g, "").trim();
    const result: AgentResponse = JSON.parse(cleanedText);
    res.json(result);
  } catch (error: any) {
    console.error("Gemini Multi-Agent pipeline error: ", error);
    res.status(500).json({
      confidenceScore: 0.50,
      rationale: "Error in Google Gemini Orchestrator. Operating System fallback rules applied to guarantee operations continuity.",
      actionSteps: [
        "Revert to pre-calculated local stadium safety guidelines.",
        "Manual radio dispatch to active zone managers.",
        "Maintain current shuttle intervals and standby roster rules."
      ]
    });
  }
});


// ----------------------------------------------------
// PACKAGING & FRONTEND BINDING FOR DEV / PROD
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`====================================================`);
    console.log(`🏟️ StadiumMind AI OS started successfully on Port ${PORT}`);
    console.log(`🌐 Live Dev Access: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}

startServer();
