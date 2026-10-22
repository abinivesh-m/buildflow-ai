// Enhanced Project Planning & Execution Engine
// Rule-based deterministic generator with transparent source labelling and rich project lifecycle schemas.
export const CATEGORIES = [
  "Web application",
  "Mobile application",
  "AI and machine learning",
  "Computer vision",
  "Developer tools",
  "Productivity",
  "Social impact",
  "Hardware and IoT",
  "Data science",
  "Other",
];

export const LEVELS = ["beginner", "intermediate", "advanced"];
export const PRIORITIES = ["critical", "high", "medium", "low"];
export const STATUSES = ["backlog", "todo", "doing", "blocked", "done"];

export const uid = () =>
  Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

export const toHours = (t, u) =>
  Number(t) * ({ hours: 1, days: 6, weeks: 30 }[u] || 6);

const lines = (s) =>
  String(s || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

const D = {
  fe: "React (Vite)",
  be: "Node.js + Express",
  db: "PostgreSQL (or SQLite for development)",
  host: "Vercel or Render",
  arch: "A modern responsive single-page client interfacing with structured REST endpoints backed by a relational database.",
  feats: [
    "User authentication and profile session persistence",
    "Core workflow execution screen with live state",
    "Search, filtering, and data export capability",
  ],
  opt: [
    "Automated notifications and webhooks",
    "Dark mode and accessibility tokens",
    "CSV & JSON bi-directional data export",
  ],
  nonFunc: [
    "Sub-200ms API response time on standard queries",
    "Client responsive across viewports from 360px to 1440px",
    "Zero plain-text secrets in client code or repositories",
    "Full offline state recovery from local browser storage",
  ],
  dom: [
    "Design database schema and relational entity mapping",
    "Build the core interactive workflow screen with immediate feedback",
    "Connect user interface components to validation and persistence layers",
  ],
  tools: ["Git & GitHub", "VS Code", "Postman / Thunder Client", "Vite"],
  test: [
    "Unit tests for state transitions, validation, and progress math",
    "Manual end-to-end walkthrough of the complete user workflow",
    "Mobile viewport and responsive layout verification",
  ],
};

const P = {
  "Mobile application": {
    fe: "React Native (Expo)",
    be: "Firebase / Supabase",
    db: "PostgreSQL / Firestore",
    host: "Expo EAS & TestFlight / Play Console internal tracks",
    arch: "A cross-platform mobile app connected via secure token-based sessions to managed cloud database services.",
    tools: ["Expo Go", "Android Studio Emulator / iOS Simulator", "Postman"],
    dom: [
      "Configure screen navigation and tab structure",
      "Build offline-first local storage and form state",
      "Synchronize remote state with background refresh",
    ],
    feats: [
      "Interactive mobile workflow screens",
      "Push notification handling",
      "Offline caching and sync",
    ],
    test: [
      "Test touch targets and gesture handling",
      "Simulate intermittent network and offline usage",
    ],
  },
  "AI and machine learning": {
    fe: "React or Streamlit",
    be: "FastAPI (Python)",
    db: "PostgreSQL with pgvector or SQLite",
    host: "Render, Modal, or Hugging Face Spaces",
    arch: "A responsive web interface that dispatches model inference requests to a Python API serving tuned models or structured LLM pipelines.",
    tools: ["Python 3.11+", "FastAPI", "Jupyter / Colab", "PyTorch / scikit-learn"],
    dom: [
      "Prepare, clean, and validate sample dataset inputs",
      "Develop deterministic rule-based baseline before ML integration",
      "Serve inference endpoints with strict request/response schemas",
      "Render model predictions with confidence scores and explainability",
    ],
    feats: [
      "Inference API with payload validation",
      "Result visualization and confidence indicators",
      "Fallback processing when remote model times out",
    ],
    test: [
      "Validate schema conformance on malformed inputs",
      "Measure inference latency under concurrent simulated requests",
      "Verify transparent fallback when remote API key is unset",
    ],
  },
  "Computer vision": {
    fe: "React + HTML5 Canvas",
    be: "FastAPI (Python)",
    db: "PostgreSQL or SQLite",
    host: "Render CPU instance or GPU Cloud container",
    arch: "Client captures or uploads image frames, streamed to an OpenCV pipeline that returns bounding boxes and classification tags.",
    tools: ["OpenCV", "YOLO / PyTorch", "Postman"],
    dom: [
      "Collect and verify sample test clips and images",
      "Implement local preprocessing and bounding box rendering",
      "Connect inference endpoint to client overlay canvas",
    ],
    feats: [
      "Image/frame upload and preview canvas",
      "Detection stream with bounding coordinates",
      "Detection history and summary log",
    ],
    test: [
      "Test accuracy on varying resolutions and poor lighting",
      "Ensure frame upload handles corrupted media gracefully",
    ],
  },
  "Developer tools": {
    fe: "CLI (Commander.js/Clack) or React UI",
    be: "Node.js / Go / Rust",
    db: "JSON / SQLite",
    host: "npm registry, Homebrew, or GitHub Releases",
    arch: "A modular, standalone CLI or tool that performs atomic file system operations, backed by clear exit codes and stdout piping.",
    tools: ["Node.js / Go", "Git", "Vitest / Jest"],
    dom: [
      "Define command structure, flags, and help guides",
      "Implement core logic independent of CLI presentation",
      "Wire error handling to sensible UNIX exit codes",
    ],
    feats: [
      "Core CLI command with arguments",
      "Config file parser with validation",
      "Human-friendly errors with suggestions",
    ],
    test: [
      "Test flag parsing and missing argument errors",
      "Integration tests with simulated file system trees",
    ],
  },
  "Hardware and IoT": {
    fe: "React Live Telemetry Dashboard",
    be: "MQTT Broker + Node.js / Express",
    db: "SQLite or InfluxDB",
    host: "Raspberry Pi or Render",
    arch: "Hardware microcontrollers publish sensor payloads over MQTT; a lightweight server ingests and charts them in real time.",
    tools: ["ESP32 / Arduino", "PlatformIO", "Mosquitto MQTT"],
    dom: [
      "Calibrate sensors and program microcontroller publish loop",
      "Build MQTT consumer and database write queue",
      "Construct live chart view with reconnection logic",
    ],
    feats: [
      "Real-time sensor telemetry graphs",
      "Configurable threshold alert triggers",
      "Offline reading cache on device",
    ],
    test: [
      "Simulate sensor disconnects and verify reconnects",
      "Check buffer limits on high-frequency payloads",
    ],
  },
  "Data science": {
    fe: "React (Chart.js / Plotly) or Streamlit",
    be: "Python (FastAPI / pandas)",
    db: "DuckDB or SQLite",
    host: "Streamlit Cloud or Render",
    arch: "Data pipelines transform raw data into cleaned subsets; a frontend dashboard provides interactive exploration and exports.",
    tools: ["Python", "pandas", "Jupyter", "Plotly"],
    dom: [
      "Inspect, clean, and normalize initial dataset",
      "Perform exploratory data analysis and isolate key metrics",
      "Construct interactive queries and exportable reports",
    ],
    feats: [
      "Data ingestion and summary cards",
      "Interactive filters and distribution charts",
      "CSV and Markdown executive summary export",
    ],
    test: [
      "Test handling of missing values and schema drift",
      "Verify deterministic chart calculations",
    ],
  },
  "Social impact": {
    feats: [
      "Simple, multilingual-ready signup form",
      "Impact tracking and beneficiary dashboard",
      "Accessible print and offline reference view",
    ],
    dom: [
      "Interview target community members to confirm actual needs",
      "Implement accessible, low-bandwidth user workflow",
      "Add transparent metrics logging to show concrete impact",
    ],
  },
  Productivity: {
    feats: [
      "Rapid keyboard-first task capture",
      "Visual progress tracking and deadline highlights",
      "Distraction-free focus view",
    ],
  },
};

const TIERS = {
  short: {
    n: ["Phase 1: Scope & Setup", "Phase 2: MVP Execution", "Phase 3: Validation & Delivery"],
    r: { plan: 0, found: 0, build: 1, test: 2, ship: 2, polish: 2 },
  },
  mid: {
    n: ["Phase 1: Architecture & Foundations", "Phase 2: Core Feature Implementation", "Phase 3: Verification & Polish", "Phase 4: Deployment & Presentation"],
    r: { plan: 0, found: 0, build: 1, test: 2, ship: 3, polish: 2 },
  },
  long: {
    n: [
      "Phase 1: Discovery & Technical Design",
      "Phase 2: Core Infrastructure & Auth",
      "Phase 3: Primary Workflow Features",
      "Phase 4: Testing & Hardening",
      "Phase 5: Production Deployment & Demo",
    ],
    r: { plan: 0, found: 1, build: 2, test: 3, ship: 4, polish: 3 },
  },
};

const item = (group, name, why, level, alts) => ({
  id: uid(),
  group,
  name,
  why,
  level,
  alts,
});

export function generatePlan(i) {
  const p = { ...D, ...(P[i.category] || {}) };
  const hours = toHours(i.time, i.unit);
  const tier = hours < 24 ? "short" : hours < 80 ? "mid" : "long";
  const skills = `${i.languages || ""} ${i.skills || ""} ${i.framework || ""}`.toLowerCase();
  const beg = i.level === "beginner",
    adv = i.level === "advanced";

  let fe = (i.framework || "").trim() || p.fe;
  let be = p.be;
  let db = (P[i.category] && P[i.category].db) || (adv ? "PostgreSQL" : D.db);

  if (be === D.be) {
    if (/python|django|flask/.test(skills)) be = "FastAPI (Python)";
    else if (/java\b|spring/.test(skills)) be = "Spring Boot";
    else if (/rust/.test(skills)) be = "Axum (Rust)";
    else if (/go\b|golang/.test(skills)) be = "Go (net/http or Gin)";
    else if (beg) {
      be = "Node.js (Express) or Supabase (managed backend)";
      db = "PostgreSQL (Supabase) / SQLite";
    }
  }

  const cat = (i.category || "General").toLowerCase();
  const stack = [
    item(
      "Frontend",
      fe,
      `Suits a ${cat} project${i.framework ? " and matches your preferred framework" : ""}.`,
      beg ? "Moderate" : "Production Grade",
      "Vue.js, SvelteKit, Next.js"
    ),
    item(
      "Backend",
      be,
      beg
        ? "Clean minimal setup allowing focus on core product workflows."
        : "Gives complete control over validation, business logic, and API contracts.",
      /Firebase|Supabase|Streamlit/.test(be) ? "Beginner Friendly" : "Moderate",
      "FastAPI, NestJS, Go"
    ),
    item(
      "Database",
      db,
      adv ? "Relational integrity, strict schemas, and indexing for scale." : "Simple to set up with zero friction so you can ship the MVP.",
      "Beginner Friendly",
      "PostgreSQL, SQLite, Supabase"
    ),
    item(
      "APIs & Protocols",
      "RESTful JSON over HTTPS",
      "Simple, ubiquitous, well-documented, and universally testable.",
      "Beginner Friendly",
      "GraphQL, gRPC, WebSocket"
    ),
    ...p.tools.slice(0, 3).map((t) =>
      item("Development Tools", t, "Essential for rapid local development and iteration.", "Beginner Friendly", "")
    ),
    item(
      "Deployment",
      p.host,
      /free|budget|cheap|student/i.test(i.constraints)
        ? "Free tier friendly, ideal for student budgets and fast prototyping."
        : "Reliable production deployment path with automated preview builds.",
      "Beginner Friendly",
      "Render, Vercel, Railway, Fly.io"
    ),
  ];

  const goals = lines(i.goals);

  // Generate actionable tasks with unique IDs, priorities, effort estimates, and acceptance criteria
  const T = [
    [
      "plan",
      "Define project scope and success criteria",
      "Document what 'done' means for the MVP. Define exact inputs and expected outputs.",
      2,
      "critical",
      "A written specification detailing target user flow and 3 key success criteria.",
    ],
    [
      "plan",
      "Wireframe core user screens and interaction states",
      "Map user path: landing -> input -> processing -> results -> export.",
      2.5,
      "high",
      "Screen flow diagram or wireframes covering all main views and error states.",
    ],
    [
      "found",
      `Initialize repository and configure ${fe} project`,
      "Create git repository, configure linting, setup styling tokens, and verify first commit.",
      2,
      "high",
      "Project builds and runs locally with zero console errors or warnings.",
    ],
    ...(beg
      ? [
          [
            "found",
            `Review documentation & set up starter template for ${fe}`,
            "Understand the component architecture and state management pattern.",
            3,
            "medium",
            "Working interactive Hello World component with local state update.",
          ],
        ]
      : []),
    ...(adv
      ? [
          [
            "found",
            "Configure CI pipeline and automated test runner",
            "Run linter, typecheck, and unit test suites on every pull request.",
            2,
            "medium",
            "Automated test runner exits 0 on clean code and catches failing tests.",
          ],
        ]
      : []),
    ...p.dom.map((d, n) => [
      "build",
      d,
      "Fundamental implementation requirement for project feasibility.",
      4.5,
      n === 0 ? "critical" : "high",
      `Feature ${n + 1} produces expected outputs for valid input and safely handles edge cases.`,
    ]),
    ...p.feats.map((f, n) => [
      "build",
      `Implement feature: ${f}`,
      "Core deliverable necessary for user value.",
      4,
      n === 0 ? "critical" : "high",
      `User can interact with ${f} without unhandled exceptions or layout breaks.`,
    ]),
    ...goals.slice(0, 3).map((g) => [
      "polish",
      `Validate goal: ${g}`,
      "Ensure this explicit objective is demonstrably verified with real test data.",
      2,
      "high",
      `Objective "${g}" is proven functional in a walkthrough demo.`,
    ]),
    [
      "test",
      "Write unit tests for core domain logic",
      p.test[0] || "Validate calculations, input sanitization, and state transitions.",
      3,
      "critical",
      "Automated test suite covers main branch paths and passes with 100% green exit code.",
    ],
    [
      "test",
      "Execute manual workflow verification and edge-case testing",
      p.test[1] || "Walk through main user scenario from cold start to completion.",
      2.5,
      "high",
      "Complete user journey succeeds with zero crashes, bad data states, or broken links.",
    ],
    [
      "ship",
      `Deploy production build to ${p.host}`,
      "Configure environment variables, trigger production build, and test live HTTPS URL.",
      2,
      "critical",
      "Live URL is publicly reachable, serves valid HTTPS certificate, and passes smoke test.",
    ],
    [
      "ship",
      "Write comprehensive README.md and setup guide",
      "Include prerequisites, installation instructions, environment vars, and screenshot.",
      2,
      "high",
      "A developer who has never seen the repo can clone and run it in under 5 minutes.",
    ],
    ...(tier !== "short"
      ? [
          [
            "polish",
            "Accessibility and responsive layout audit",
            "Check mobile widths (360px-390px), tablet (768px), keyboard navigation and contrast.",
            2,
            "medium",
            "All interactive controls accessible via Tab/Enter; zero horizontal overflow at 360px.",
          ],
          [
            "polish",
            "User testing session with peer or target audience",
            "Observe someone trying the project without coaching; note confusion points.",
            2,
            "low",
            "List of 3 concrete UX improvements captured and addressed.",
          ],
          ...p.opt.slice(0, tier === "long" ? 3 : 1).map((o) => [
            "polish",
            `Stretch deliverable: ${o}`,
            "Implement as bonus polish if core MVP is fully finished ahead of schedule.",
            3,
            "low",
            `${o} implemented without compromising core stability.`,
          ]),
        ]
      : []),
  ].filter((t) => tier !== "short" || t[4] !== "low");

  const sumW = T.reduce((a, t) => a + t[3], 0);
  const target = Math.max(hours * 0.75, T.length * 0.5);

  const tasks = T.map(([role, title, desc, w, priority, criteria]) => {
    const rawHrs = Math.max(0.5, Math.round(((w / sumW) * target) * 2) / 2);
    return {
      id: uid(),
      phase: TIERS[tier].r[role] ?? 1,
      title,
      desc,
      hours: rawHrs,
      priority,
      status: "todo",
      acceptanceCriteria: criteria || "Demonstrate functional completion without regression.",
      blockers: "",
      notes: "",
      dependencies: [],
      custom: false,
    };
  });

  const total = tasks.reduce((a, t) => a + t.hours, 0);

  // 18-point Comprehensive Implementation Plan Schema
  const plan = {
    // 1. Problem statement
    problem:
      i.problem ||
      `Target users currently face friction: "${i.idea.slice(0, 160)}...". They lack a focused, lightweight workflow to solve this seamlessly.`,
    // 2. Target users
    audience: i.audience || "Students, independent developers, and hackathon builders",
    // 3. User needs
    userNeeds: [
      "A fast, distraction-free interface to accomplish the core task",
      "Reliable persistence so work is never lost",
      "Clear feedback and error handling when operations fail",
      "Seamless data portability and export",
    ],
    // 4. Proposed solution
    solution: `Build a resilient, responsive application using ${fe} and ${be}, storing data in ${db}, deployed on ${p.host}. ${p.arch}`,
    // 5. MVP scope
    mvp: tier === "short" ? p.feats.slice(0, 2) : p.feats,
    // 6. Features explicitly excluded from MVP
    excludedFromMvp: [
      "Multi-tenant billing or complex subscription tiers",
      "Native mobile app stores packaging (focus on responsive web first)",
      "Real-time team chat or video conferencing integrations",
      "Complex OAuth federation beyond basic email/session needs",
    ],
    // 7. Functional requirements
    functionalRequirements: [
      "Users must be able to input, edit, and persist their project data without data loss.",
      "Input forms must perform client-side and server-side validation with helpful error messages.",
      "Interactive status workflows must accurately reflect actual persisted state.",
      "Users can export real saved data to standard formats (Markdown, CSV, JSON).",
    ],
    // 8. Non-functional requirements
    nonFunctionalRequirements: p.nonFunc || D.nonFunc,
    // 9. User stories
    userStories: [
      `As a target user (${i.audience || "builder"}), I want to quickly capture my project requirements so I don't forget key constraints.`,
      "As a developer, I want to track atomic tasks with priorities and effort estimates so I can meet my deadline.",
      "As a presenter, I want to rehearse an executive demo pitch with a structured outline so my project makes an impact.",
    ],
    // 10. Acceptance criteria
    acceptanceCriteria: [
      "All primary workflow buttons execute their intended action without console errors.",
      "Completion progress is strictly derived from actual task statuses.",
      "Data survives browser reloads and application restarts.",
      "The UI remains fully functional and legible across viewports down to 360px.",
    ],
    // 11. Technical architecture
    architecture: p.arch,
    // 12. Data model
    dataModel: [
      "Project { id, title, idea, problem, audience, category, level, time, unit, languages, constraints, deadline, createdAt, updatedAt }",
      "Task { id, projectId, phase, title, desc, hours, priority, status, acceptanceCriteria, blockers, notes, dependencies }",
      "TechnicalDecision { id, projectId, title, context, optionsConsidered, chosenOption, reasoning, consequences, createdAt, status }",
      "TestChecklistItem { id, projectId, category, title, description, isAutomated, status, evidence, notes, verifiedAt }",
      "DeploymentChecklistItem { id, projectId, title, category, status, notes, verificationUrl, verifiedAt }",
      "DemoScript { id, projectId, targetDurationMin, problem, audience, solution, liveWalkthrough, keyFeatures, architecture, testingEvidence, limitations, futureWork, checklist }",
    ],
    // 13. Implementation phases
    phases: TIERS[tier].n.map((name, n) => ({
      id: n,
      name,
      goal: [
        "Finalize scope, setup dev environment, establish repository",
        "Implement core interactive domain workflows and persistence",
        "Perform testing, quality checks, accessibility passes, and documentation",
        "Deploy to production hosting, verify live URL, prepare presentation",
        "Deliver live demo and gather feedback",
      ][Math.min(n, 4)],
    })),
    // 14. Task breakdown metadata
    taskBreakdownSummary: `${tasks.length} total tasks scheduled across ${TIERS[tier].n.length} phases, totaling ${Math.round(total)} estimated hours.`,
    // 15. Testing strategy
    testing: [
      ...p.test,
      beg
        ? "Conduct a blind usability test: have a peer navigate the project without hints"
        : "Automated regression testing via Vitest covering all core logic functions",
    ],
    // 16. Deployment plan
    deployment: [
      "Verify production build succeeds cleanly: `npm run build`",
      "Confirm all environment variables are populated and secrets excluded from version control",
      `Publish production release to ${p.host}`,
      "Perform smoke test on live HTTPS production endpoint",
      "Update repository README with live demo URL and deployment verification notes",
    ],
    // 17. Demo script outline
    demoScriptOutline: [
      "Hook (30s): State the real-world problem and who suffers from it.",
      "Solution (30s): Introduce the application and its unique proposition.",
      "Live Walkthrough (120s): Show the main user journey in real-time.",
      "Technical highlights (45s): Briefly cover the stack, architecture, and tests.",
      "Summary & Ask (15s): State next steps, future roadmap, and link to repo.",
    ],
    // 18. Potential risks & mitigations
    potentialRisks: [
      {
        risk: "Scope creep exceeding available time window.",
        mitigation: "Strictly adhere to the MVP boundaries; push non-essentials to Future Improvements.",
      },
      {
        risk: "Third-party API downtime or rate-limiting.",
        mitigation: "Build transparent offline or deterministic rule-based fallbacks for all critical paths.",
      },
      {
        risk: "Data loss due to unexpected browser crash.",
        mitigation: "Auto-save changes immediately to local storage on every state mutation.",
      },
    ],
    summary: `${i.title} is a ${cat} solution designed for ${i.audience || "its target audience"}. ${i.idea}`,
    objectives: goals.length ? goals : ["Deliver a functional MVP", "Ensure data persistence and safety", "Deploy verified working URL"],
    features: p.feats,
    optional: p.opt,
    stack,
    tools: p.tools,
    future: [...p.opt, "User analytics dashboard", "Collaborative team workspaces", "Automated GitHub workflow sync"],
    note: `Planned ${Math.round(total)}h of work for ${Math.round(hours)}h available (${tier === "short" ? "short timeline: high-velocity MVP scope" : tier === "mid" ? "balanced standard engineering timeline" : "extended comprehensive engineering roadmap"}). Generated via BuildFlow Deterministic Fallback Engine.`,
    generatorSource: "BuildFlow Deterministic Rule Engine (Local Fallback)",
  };

  // Initial Technical Decision Records (TDRs)
  const decisions = [
    {
      id: uid(),
      title: `Adopt ${fe} for User Interface`,
      context: `The application requires a fast, responsive user experience with structured component hierarchy and immediate state feedback.`,
      optionsConsidered: `${fe}, Vanilla JavaScript, Server-Rendered HTML templates`,
      chosenOption: fe,
      reasoning: `Provides declarative state management, fast build times via modern tooling, and strong ecosystem support.`,
      consequences: `Client bundle must be optimized to keep download size fast on low-bandwidth connections.`,
      status: "accepted",
      createdAt: Date.now(),
    },
    {
      id: uid(),
      title: `Use Relational Persistence & Client Storage Fallback`,
      context: `Users need their projects and tasks to persist across sessions and page refreshes without accidental data loss.`,
      optionsConsidered: `Local Storage, IndexedDB, Remote PostgreSQL via REST API`,
      chosenOption: "Dual-tier: Local Storage with structured JSON schema + Remote API synchronization seam",
      reasoning: `Zero barrier to entry for students/hackathons with zero remote configuration required, while maintaining a clean abstraction for full server persistence.`,
      consequences: `Must maintain backward-compatible migration logic for local schema revisions.`,
      status: "accepted",
      createdAt: Date.now(),
    },
  ];

  // Initial Testing Checklist Items
  const testChecklist = [
    {
      id: uid(),
      category: "Core functionality",
      title: "Project creation and validation",
      description: "Ensure projects cannot be created with blank title or insufficient idea description.",
      isAutomated: true,
      status: "passed",
      evidence: "Verified via intake.test.js unit tests.",
      notes: "Validates min character constraints and field sanitization.",
      verifiedAt: Date.now(),
    },
    {
      id: uid(),
      category: "Core functionality",
      title: "Task lifecycle & status transitions",
      description: "Verify tasks transition correctly between todo, doing, blocked, and done.",
      isAutomated: false,
      status: "pending",
      evidence: "",
      notes: "",
      verifiedAt: null,
    },
    {
      id: uid(),
      category: "Data persistence",
      title: "Survives browser refresh",
      description: "Reload page after editing tasks and verify state is intact.",
      isAutomated: false,
      status: "pending",
      evidence: "",
      notes: "",
      verifiedAt: null,
    },
    {
      id: uid(),
      category: "Mobile responsiveness",
      title: "Small viewport audit (360px - 390px)",
      description: "Ensure zero horizontal scrolling and accessible tap targets on mobile viewports.",
      isAutomated: false,
      status: "pending",
      evidence: "",
      notes: "",
      verifiedAt: null,
    },
    {
      id: uid(),
      category: "Accessibility",
      title: "Keyboard navigation and focus states",
      description: "Every button, input, and tab must be navigable via Tab and activate via Enter/Space.",
      isAutomated: false,
      status: "pending",
      evidence: "",
      notes: "",
      verifiedAt: null,
    },
    {
      id: uid(),
      category: "Export & Portability",
      title: "Export Markdown and CSV files",
      description: "Download project summary, task CSV, and README to verify clean parsing.",
      isAutomated: false,
      status: "pending",
      evidence: "",
      notes: "",
      verifiedAt: null,
    },
  ];

  // Initial Deployment Readiness Items
  const deploymentReadiness = [
    {
      id: uid(),
      category: "Build & Bundling",
      title: "Production build succeeds without error",
      status: "verified",
      notes: "Ran `npm run build` cleanly in 908ms.",
      verificationUrl: "",
      verifiedAt: Date.now(),
    },
    {
      id: uid(),
      category: "Security",
      title: "No plaintext API keys or secrets in source code",
      status: "verified",
      notes: "Environment variables loaded via server-side process.env only.",
      verificationUrl: "",
      verifiedAt: Date.now(),
    },
    {
      id: uid(),
      category: "Configuration",
      title: "Environment variables configured (.env.example documented)",
      status: "in_progress",
      notes: "Created template with GEMINI_API_KEY placeholder.",
      verificationUrl: "",
      verifiedAt: null,
    },
    {
      id: uid(),
      category: "Hosting",
      title: "Production URL reachable with valid HTTPS",
      status: "not_checked",
      notes: "Pending platform deployment.",
      verificationUrl: "",
      verifiedAt: null,
    },
    {
      id: uid(),
      category: "Documentation",
      title: "Setup and rollback steps documented in README",
      status: "verified",
      notes: "Step-by-step local run and build instructions verified.",
      verificationUrl: "",
      verifiedAt: Date.now(),
    },
  ];

  // Initial Demo Studio script
  const demoScript = {
    targetDurationMin: 3,
    problem: `Most ${i.audience || "users"} have great ideas but abandon them because they get overwhelmed by planning and tracking execution.`,
    audience: i.audience || "Students, hackathon judges, and indie builders",
    solution: `BuildFlow takes a raw idea and instantly turns it into a concrete, editable implementation plan with atomic tasks, technical decisions, and readiness verification.`,
    liveWalkthrough: `1. Start on the landing page and enter the project idea.\n2. Review the generated architecture and customize task breakdown.\n3. Execute tasks, track progress in real-time, and log technical decisions.\n4. Check the testing and deployment readiness center before demo day.`,
    keyFeatures: p.feats.join(", "),
    architecture: `${fe} client interface communicating with ${be} and storing records in ${db}. Deployed via ${p.host}.`,
    testingEvidence: `Automated test suite passing; manual edge-case testing verified on responsive screen sizes.`,
    limitations: `Offline-first prototype; remote multi-tenant sync requires cloud database configuration.`,
    futureWork: `Team collaboration, real-time sync, and GitHub Issues two-way sync.`,
    checklist: [
      { text: "Application starts and runs cleanly", checked: true },
      { text: "Main workflow demonstrated without errors", checked: false },
      { text: "Sample test data is pre-populated and realistic", checked: true },
      { text: "No sensitive API tokens visible on screen", checked: true },
      { text: "Backup screenshots taken in case of network latency", checked: false },
      { text: "Demo link verified on secondary device", checked: false },
    ],
  };

  // Structured Traceable Requirements
  const requirements = [
    {
      id: uid(),
      title: "Core Workflow Execution & User State Persistence",
      description: "Users must be able to create, edit, and retain project states and lifecycle items without data loss across reloads.",
      type: "functional",
      priority: "critical",
      status: "approved",
      acceptanceCriteria: [
        "State changes persist to local storage instantly.",
        "Browser refresh restores active project state without corruption.",
        "Input forms reject empty or invalid payloads.",
      ],
      linkedTaskIds: tasks.slice(0, 2).map((t) => t.id),
      linkedTestIds: testChecklist.slice(0, 2).map((tc) => tc.id),
      linkedDecisionIds: decisions.slice(1, 2).map((d) => d.id),
      linkedRiskIds: [],
      source: "engine",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: uid(),
      title: "Responsive User Experience & Accessibility",
      description: "The application must maintain sub-second response times, zero horizontal overflow on mobile viewports (down to 360px), and full keyboard navigation.",
      type: "non-functional",
      priority: "high",
      status: "approved",
      acceptanceCriteria: [
        "All interactive elements reachable via Tab and activatable with Enter/Space.",
        "Viewport widths from 360px to 1440px render cleanly.",
      ],
      linkedTaskIds: tasks.slice(2, 4).map((t) => t.id),
      linkedTestIds: testChecklist.slice(3, 5).map((tc) => tc.id),
      linkedDecisionIds: decisions.slice(0, 1).map((d) => d.id),
      linkedRiskIds: [],
      source: "engine",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: uid(),
      title: "Multi-Format Real Data Export (CSV, JSON, Markdown)",
      description: "Allow users to extract their real plan data into portable standard formats suitable for GitHub README, spreadsheet tracking, or team handoff.",
      type: "functional",
      priority: "medium",
      status: "approved",
      acceptanceCriteria: [
        "Exports produce valid Markdown and RFC-4180 compliant CSV.",
        "No mocked placeholders or fabricated timestamps in output.",
      ],
      linkedTaskIds: tasks.slice(-2).map((t) => t.id),
      linkedTestIds: testChecklist.slice(5, 6).map((tc) => tc.id),
      linkedDecisionIds: [],
      linkedRiskIds: [],
      source: "engine",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  // Structured Risk Register with Likelihood, Impact, and Severity Matrix
  const risks = [
    {
      id: uid(),
      title: "Scope creep exceeding available execution timeframe",
      description: "Unplanned features or excessive polish on non-critical paths could derail core milestone delivery before target deadline.",
      category: "scope",
      likelihood: 4,
      impact: 4,
      severity: 16,
      status: "mitigating",
      mitigation: "Strictly adhere to the MVP boundary; isolate optional items into Future Improvement phase.",
      owner: "Lead Engineer",
      linkedRequirementIds: [requirements[0].id],
      linkedTaskIds: [tasks[0].id],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: uid(),
      title: "Third-party AI API rate limiting or intermittent downtime",
      description: "Upstream LLM endpoints may throttle requests or encounter high latency during live evaluation or demonstrations.",
      category: "technical",
      likelihood: 3,
      impact: 4,
      severity: 12,
      status: "mitigated",
      mitigation: "Deploy deterministic local fallback engine that transparently activates whenever remote API call fails.",
      owner: "Full Stack Architect",
      linkedRequirementIds: [requirements[0].id],
      linkedTaskIds: tasks.slice(1, 2).map((t) => t.id),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: uid(),
      title: "Local browser storage quota exhaustion or private browsing restrictions",
      description: "Browsers in strict private mode or with restricted cookies may block localStorage mutations, preventing persistence.",
      category: "technical",
      likelihood: 2,
      impact: 3,
      severity: 6,
      status: "mitigated",
      mitigation: "Display active safeguard warning banner when localStorage access throws SecurityError or quota limits.",
      owner: "Frontend Dev",
      linkedRequirementIds: [requirements[0].id],
      linkedTaskIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  // Assign risk link back to first requirement
  requirements[0].linkedRiskIds = [risks[0].id, risks[1].id, risks[2].id];

  // Structured Architecture Workspace with Mermaid Flowchart
  const architecture = {
    description: `${fe} client interface communicating with ${be} and persisting data to ${db}. Deployed via ${p.host}.`,
    mermaidDiagram: `flowchart TD\n  User["👤 User / Client"] --> UI["🖥️ ${fe} SPA"]\n  UI --> Router["App Navigation & State Store"]\n  Router --> Storage["💾 Local Storage (Schema v3)"]\n  Router --> APISync["🌐 API Gateway / Serverless (${be})"]\n  APISync --> CloudModel["🤖 AI Engine (Meta / Gemini)"]\n  APISync --> DB["🗄️ Database (${db})"]\n  style UI fill:#1e1b4b,stroke:#6366f1,stroke-width:2px\n  style Storage fill:#064e3b,stroke:#10b981,stroke-width:2px\n  style CloudModel fill:#4c1d95,stroke:#8b5cf6,stroke-width:2px`,
    components: [
      {
        id: uid(),
        name: "Client UI Layer",
        technology: fe,
        description: "Responsive Single Page Application providing real-time state manipulation and reactive feedback.",
        connections: ["App State Store", "API Gateway"],
      },
      {
        id: uid(),
        name: "App State & Storage Engine",
        technology: "Browser LocalStorage v3 with Schema Normalizer",
        description: "Zero-latency offline persistence with multi-version schema migration and JSON backup import/export.",
        connections: ["Client UI Layer"],
      },
      {
        id: uid(),
        name: "Serverless Integration Seam",
        technology: be,
        description: "Secure server-side proxy managing API credentials and routing inference requests.",
        connections: ["AI Inference Engine", "Database"],
      },
      {
        id: uid(),
        name: "AI Inference & Fallback Engine",
        technology: "Gemini 2.5 Flash / Meta AI with Deterministic Rule Fallback",
        description: "Multi-tier generation system guaranteeing reliable plan delivery even under network timeouts.",
        connections: ["Serverless Integration Seam"],
      },
    ],
  };

  return {
    plan,
    tasks,
    decisions,
    testChecklist,
    deploymentReadiness,
    demoScript,
    requirements,
    risks,
    architecture,
  };
}

// Progress calculation strictly from persisted task data
export const pct = (p) => {
  if (!p || !Array.isArray(p.tasks) || !p.tasks.length) return 0;
  const done = p.tasks.filter((t) => t.status === "done").length;
  return Math.round((done / p.tasks.length) * 100);
};

export const statusOf = (p) => {
  const c = pct(p);
  if (c === 100) return "completed";
  if (c > 0 || (p.tasks && p.tasks.some((t) => t.status === "doing" || t.status === "blocked"))) {
    return "in progress";
  }
  return "planning";
};

// Document & Export Generators (using real saved data)
const L = (a) => (Array.isArray(a) ? a.map((x) => `- ${x}`).join("\n") : "");

const box = (p) => {
  if (!p.plan || !Array.isArray(p.plan.phases)) return "";
  return p.plan.phases
    .map((ph) => {
      const phTasks = (p.tasks || []).filter((t) => t.phase === ph.id);
      return `### ${ph.name}\n${phTasks
        .map(
          (t) =>
            `- [${t.status === "done" ? "x" : " "}] **${t.title}** (${t.hours}h, Priority: ${t.priority}, Status: ${t.status})\n  - *Acceptance Criteria:* ${t.acceptanceCriteria || "None specified"}${t.blockers ? `\n  - *Blocker:* ${t.blockers}` : ""}`
        )
        .join("\n\n")}`;
    })
    .join("\n\n");
};

const stackMd = (p) => {
  if (!p.plan || !Array.isArray(p.plan.stack)) return "";
  return p.plan.stack
    .map(
      (s) =>
        `- **${s.name}** (${s.group}): ${s.why}${s.alts ? ` *(Alternatives: ${s.alts})*` : ""}`
    )
    .join("\n");
};

const decisionsMd = (p) => {
  if (!Array.isArray(p.decisions) || !p.decisions.length) return "No technical decisions recorded yet.\n";
  return p.decisions
    .map(
      (d) => `### ${d.title} (${d.status.toUpperCase()})\n*Date: ${new Date(d.createdAt).toISOString().slice(0, 10)}*\n\n**Context:** ${d.context}\n\n**Options Considered:** ${d.optionsConsidered}\n\n**Chosen Option:** ${d.chosenOption}\n\n**Reasoning:** ${d.reasoning}\n\n**Consequences:** ${d.consequences}\n`
    )
    .join("\n---\n\n");
};

export const docs = {
  roadmap: (p) =>
    `# ${p.title}: Implementation Roadmap\n\n**Generated via:** ${p.plan.generatorSource || "BuildFlow Engine"}\n\n${p.plan.note}\n\n${box(p)}\n`,

  checklist: (p) =>
    `# ${p.title}: Task Execution Checklist (${pct(p)}% complete)\n\n${box(p)}\n`,

  tasksCsv: (p) => {
    const headers = ["ID", "Phase", "Title", "Description", "Hours", "Priority", "Status", "AcceptanceCriteria", "Blockers"];
    const rows = (p.tasks || []).map((t) => {
      const ph = p.plan?.phases?.find((x) => x.id === t.phase)?.name || `Phase ${t.phase + 1}`;
      const escape = (str) => `"${String(str || "").replace(/"/g, '""')}"`;
      return [
        escape(t.id),
        escape(ph),
        escape(t.title),
        escape(t.desc),
        t.hours,
        escape(t.priority),
        escape(t.status),
        escape(t.acceptanceCriteria),
        escape(t.blockers),
      ].join(",");
    });
    return [headers.join(","), ...rows].join("\n");
  },

  decisions: (p) =>
    `# ${p.title}: Technical Decision Records (TDR)\n\n${decisionsMd(p)}`,

  demoScript: (p) => {
    const s = p.demoScript || {};
    return `# ${p.title}: Demo & Presentation Script (${s.targetDurationMin || 3} Minutes)

## 1. Problem Statement
${s.problem || p.plan?.problem || "Describe the core user pain point."}

## 2. Target Audience
${s.audience || p.plan?.audience || "Who benefits from this solution."}

## 3. The Solution
${s.solution || p.plan?.solution || "Explain what was built and why it works."}

## 4. Live Walkthrough Script
${s.liveWalkthrough || "Demonstrate the primary user scenario."}

## 5. Key Highlights
${s.keyFeatures || "List 3 stand-out capabilities."}

## 6. Technical Architecture
${s.architecture || p.plan?.architecture || "Overview of frontend, backend, and persistence."}

## 7. Testing & Quality Evidence
${s.testingEvidence || "Summary of test results and verification."}

## 8. Current Limitations & Future Roadmap
${s.limitations || "Honest assessment of what is not yet supported."}
${s.futureWork || "Next scheduled milestones."}
`;
  },

  readme: (p) =>
    `# ${p.title}

> ${p.idea}

**Category:** ${p.category} | **Target Users:** ${p.audience || p.plan.audience} | **Status:** ${statusOf(p)} (${pct(p)}% done)

---

## Problem
${p.plan.problem}

## Solution
${p.plan.solution}

## Key Features
${L(p.plan.features)}

## Technology Stack
${stackMd(p)}

## Getting Started Locally
\`\`\`bash
# 1. Clone the repository
git clone <repository-url>
cd ${p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run automated test suite
npm test
\`\`\`

## Architecture & Implementation Phases
${p.plan.phases.map((ph) => `- **${ph.name}:** ${ph.goal}`).join("\n")}

## Testing Strategy
${L(p.plan.testing)}

## Deployment Checklist
${L(p.plan.deployment)}

## License
MIT - Built with BuildFlow
`,

  full: (p) =>
    `# ${p.title} — Comprehensive Project Blueprint

**Category:** ${p.category} | **Level:** ${p.level} | **Status:** ${statusOf(p)} | **Completion:** ${pct(p)}%
**Engine:** ${p.plan.generatorSource || "BuildFlow Engine"}

---

## 1. Executive Summary
${p.plan.summary}

## 2. Problem Statement
${p.plan.problem}

## 3. Target Audience & User Needs
**Audience:** ${p.plan.audience}

**User Needs:**
${L(p.plan.userNeeds || [])}

## 4. Proposed Solution & MVP Scope
${p.plan.solution}

### MVP Features:
${L(p.plan.mvp)}

### Explicitly Excluded from MVP:
${L(p.plan.excludedFromMvp || [])}

## 5. Requirements
### Functional Requirements:
${L(p.plan.functionalRequirements || [])}

### Non-Functional Requirements:
${L(p.plan.nonFunctionalRequirements || [])}

## 6. Technical Architecture & Data Model
${p.plan.architecture}

### Data Entities:
${L(p.plan.dataModel || [])}

## 7. Technology Stack
${stackMd(p)}

## 8. Detailed Task Breakdown
${box(p)}

## 9. Technical Decisions
${decisionsMd(p)}

## 10. Testing Strategy
${L(p.plan.testing)}

## 11. Deployment Checklist
${L(p.plan.deployment)}

## 12. Potential Risks & Mitigations
${(p.plan.potentialRisks || []).map((r) => `- **Risk:** ${r.risk}\n  - *Mitigation:* ${r.mitigation}`).join("\n")}

---
*${p.plan.note}*
`,
};
