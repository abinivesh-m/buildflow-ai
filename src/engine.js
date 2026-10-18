// Local plan generator. This is rule-based, NOT an LLM. generatePlan() is the single seam
// where an AI provider (e.g. api/generate.js) can later be swapped in.
export const CATEGORIES = ["Web application", "Mobile application", "AI and machine learning", "Computer vision", "Developer tools", "Productivity", "Social impact", "Hardware and IoT", "Data science", "Other"];
export const LEVELS = ["beginner", "intermediate", "advanced"];
export const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
export const toHours = (t, u) => Number(t) * ({ hours: 1, days: 6, weeks: 30 }[u] || 6);
const lines = (s) => String(s || "").split("\n").map((x) => x.trim()).filter(Boolean);

const D = { fe: "React", be: "Node.js + Express", db: "SQLite", host: "Vercel or Render",
  feats: ["User accounts and saved data", "Main workflow screen", "Search and filtering"], opt: ["Notifications", "Dark mode", "Data export"],
  dom: ["Design the data model and API routes", "Build the main user workflow", "Connect the interface to the data layer"],
  arch: "A browser client calls a REST API that reads and writes a database.", tools: ["Git and GitHub", "VS Code", "Postman"],
  test: ["Unit tests for core logic", "Manual walkthrough of the main user flow"] };
const P = {
  "Mobile application": { fe: "React Native (Expo)", be: "Firebase", db: "Firestore", host: "Expo EAS or Play Store internal testing", arch: "A mobile client uses a managed backend for auth and data.", tools: ["Expo Go", "Android Studio emulator"], dom: ["Design screen navigation", "Build the core screen and local state", "Sync data with the backend"] },
  "AI and machine learning": { fe: "Streamlit", be: "FastAPI", host: "Hugging Face Spaces or Render", arch: "A trained model is served by an API and shown through a thin UI.", tools: ["Jupyter", "scikit-learn or PyTorch"], dom: ["Collect and clean a starter dataset", "Train and evaluate a baseline model", "Serve the model behind an API", "Show predictions with confidence"], test: ["Evaluate on a held-out test set", "Check edge-case inputs"], feats: ["Prediction endpoint", "Result explanation view", "Input validation"] },
  "Computer vision": { fe: "React", be: "FastAPI", host: "Render (CPU) or a GPU VM", arch: "Images or video flow through a detection pipeline; results are stored and shown in a dashboard.", tools: ["OpenCV", "YOLO or PyTorch", "Sample video clips"], dom: ["Collect and label sample images or clips", "Run a pretrained detector on sample input", "Track and post-process detections", "Display results in a dashboard"], test: ["Measure accuracy on unseen clips", "Test in poor lighting"], feats: ["Detection pipeline", "Results dashboard", "Upload or stream input"] },
  "Developer tools": { fe: "Command line or VS Code extension", be: "Node.js", db: "JSON files", host: "npm registry or VS Code Marketplace", arch: "A CLI or extension wraps a core library that is tested on its own.", tools: ["Node.js", "Commander or VS Code API"], dom: ["Define commands and options", "Implement the core library", "Wire the library to the CLI or extension"], feats: ["Core command", "Config file support", "Helpful error messages"] },
  "Hardware and IoT": { fe: "React dashboard", be: "MQTT broker + Node.js", db: "InfluxDB or SQLite", host: "Raspberry Pi or Render", arch: "Sensors publish readings over MQTT; a backend stores them and a dashboard charts them.", tools: ["ESP32 or Raspberry Pi", "PlatformIO", "Mosquitto MQTT"], dom: ["Wire and read the sensors", "Publish readings over MQTT", "Store and chart the readings"], feats: ["Live readings", "Threshold alerts", "History chart"] },
  "Data science": { fe: "Streamlit", be: "Python", db: "CSV or SQLite", host: "Streamlit Community Cloud", arch: "Notebooks clean and analyse data; a small app presents the findings.", tools: ["Jupyter", "pandas", "Plotly"], dom: ["Collect and clean the dataset", "Explore the data and form hypotheses", "Build the analysis and charts"], feats: ["Cleaned dataset", "Key insight charts", "Shareable report"] },
  "Social impact": { feats: ["Simple sign-up for beneficiaries", "Impact tracking", "Easy sharing"], dom: ["Interview two or three real users", "Build the core help workflow", "Add a way to measure impact"] },
  Productivity: { feats: ["Quick capture", "Reminders", "Progress view"] },
};
const TIERS = {
  short: { n: ["Plan and set up", "Build the MVP", "Test and ship"], r: { plan: 0, found: 1, build: 1, test: 2, ship: 2, polish: 2 } },
  mid: { n: ["Plan and design", "Core build", "Integrate and test", "Deploy and document"], r: { plan: 0, found: 1, build: 1, test: 2, ship: 3, polish: 2 } },
  long: { n: ["Research and design", "Foundation", "Core features", "Testing and polish", "Deploy and document"], r: { plan: 0, found: 1, build: 2, test: 3, ship: 4, polish: 3 } },
};
const item = (group, name, why, level, alts) => ({ id: uid(), group, name, why, level, alts });

export function generatePlan(i) {
  const p = { ...D, ...(P[i.category] || {}) };
  const hours = toHours(i.time, i.unit);
  const tier = hours < 24 ? "short" : hours < 80 ? "mid" : "long";
  const skills = `${i.languages} ${i.skills} ${i.framework}`.toLowerCase();
  const beg = i.level === "beginner", adv = i.level === "advanced";
  let fe = (i.framework || "").trim() || p.fe, be = p.be, db = (P[i.category] && P[i.category].db) || (adv ? "PostgreSQL" : D.db);
  if (be === D.be) { if (/python|django|flask/.test(skills)) be = "FastAPI (Python)"; else if (/java\b|spring/.test(skills)) be = "Spring Boot"; else if (beg) { be = "Firebase (managed backend)"; db = "Firestore"; } }
  const cat = i.category.toLowerCase();
  const stack = [
    item("Frontend", fe, `Suits a ${cat} project${i.framework ? " and is the framework you asked for" : ""}.`, beg ? "Moderate" : "Beginner friendly", "Vue, Svelte"),
    item("Backend", be, beg ? "Fewer moving parts to learn and maintain." : "Gives you full control over the API and business logic.", /Firebase|Streamlit/.test(be) ? "Beginner friendly" : "Moderate", "Supabase, Django"),
    item("Database", db, adv ? "Relational integrity for growth." : "Zero or low setup so you can focus on features.", "Beginner friendly", "MongoDB, PostgreSQL"),
    item("APIs and integrations", "REST (JSON)", "Simple, well documented and easy to test.", "Beginner friendly", "GraphQL"),
    ...p.tools.slice(0, 3).map((t) => item("Development tools", t, "Needed for this kind of project.", "Beginner friendly", "")),
    item("Deployment", p.host, /free|budget|cheap|student/i.test(i.constraints) ? "Has a free tier, which matches your budget limits." : "Fast path to a link people can open.", "Beginner friendly", "Netlify, Railway"),
  ];
  const goals = lines(i.goals);
  const T = [
    ["plan", "Define the problem and success criteria", "Write what 'done' means for the MVP.", 2, "high"],
    ["plan", "Sketch the main screens and user flow", "Paper or Figma wireframes for 3 screens.", 3, "high"],
    ["found", `Set up the repository and ${fe} project`, "Initialise Git, scaffold the app, commit.", 2, "high"],
    ...(beg ? [["found", `Work through a ${fe} starter tutorial`, "Learn just enough to build the MVP.", 4, "medium"]] : []),
    ...(adv ? [["found", "Set up CI and linting", "Run tests on every push.", 2, "medium"]] : []),
    ...p.dom.map((d, n) => ["build", d, "Core MVP work.", 5, n < 3 ? "high" : "medium"]),
    ...p.feats.map((f, n) => ["build", `Build: ${f}`, "Essential feature.", 4, n === 0 ? "high" : "medium"]),
    ...goals.slice(0, 3).map((g) => ["polish", `Verify goal: ${g}`, "Check this goal is demonstrably met.", 1.5, "medium"]),
    ["test", "Write tests for the critical logic", p.test[0], 3, "high"],
    ["test", "Walk through the main flow and fix bugs", p.test[1] || "Manual test.", 3, "high"],
    ["ship", `Deploy to ${p.host}`, "Set env vars and publish.", 2, "high"],
    ["ship", "Write the README and setup steps", "Anyone should be able to run it.", 1.5, "medium"],
    ...(tier !== "short" ? [["polish", "Accessibility and mobile pass", "Keyboard use, contrast, small screens.", 2, "medium"], ["polish", "Get feedback from 3 real users", "Note what confuses them.", 2, "low"], ...p.opt.slice(0, tier === "long" ? 3 : 1).map((o) => ["polish", `Optional: ${o}`, "Only if time remains.", 3, "low"])] : []),
  ].filter((t) => tier !== "short" || t[4] !== "low");
  const sumW = T.reduce((a, t) => a + t[3], 0), target = Math.max(hours * 0.75, T.length * 0.5);
  const tasks = T.map(([role, title, desc, w, priority]) => ({ id: uid(), phase: TIERS[tier].r[role] ?? 1, title, desc, hours: Math.max(0.5, Math.round(((w / sumW) * target) * 2) / 2), priority, status: "todo", custom: false }));
  const total = tasks.reduce((a, t) => a + t.hours, 0);
  const plan = {
    summary: `${i.title} is a ${cat} project for ${i.audience || "its target users"}. ${i.idea}`,
    problem: i.problem || `People who want this have no simple way to do it today: ${i.idea.slice(0, 140)}`,
    audience: i.audience || "Students and early builders",
    objectives: goals.length ? goals : ["Deliver a working MVP", "Make it usable by people who did not build it", "Document how to run it"],
    mvp: tier === "short" ? p.feats.slice(0, 2) : p.feats,
    features: p.feats, optional: p.opt,
    stack, architecture: p.arch,
    phases: TIERS[tier].n.map((name, n) => ({ id: n, name, goal: ["Decide what to build and set up", "Build the core", "Verify it works", "Ship it"][Math.min(n, 3)] })),
    tools: p.tools, testing: [...p.test, beg ? "Ask a friend to try it without help" : "Add automated tests for critical paths"],
    solution: `Build the MVP with ${fe} and ${be}, storing data in ${db}, and deploy to ${p.host}. ${p.arch}`,
    deployment: ["Set environment variables", "Run the production build", `Deploy to ${p.host}`, "Smoke-test the live link", "Update the README with the live URL"],
    future: [...p.opt, "Add analytics", "Collect user feedback and iterate"],
    note: `Planned ${Math.round(total)}h of work for ${Math.round(hours)}h available (${tier === "short" ? "short timeline: MVP-only scope" : tier === "mid" ? "standard scope" : "extended scope with polish"}). Estimates are rules of thumb, not guarantees.`,
  };
  return { plan, tasks };
}

export const pct = (p) => (p.tasks.length ? Math.round((p.tasks.filter((t) => t.status === "done").length / p.tasks.length) * 100) : 0);
export const statusOf = (p) => { const c = pct(p); return c === 100 ? "completed" : c > 0 || p.tasks.some((t) => t.status === "doing") ? "in progress" : "planning"; };
const L = (a) => a.map((x) => `- ${x}`).join("\n");
const box = (p) => p.plan.phases.map((ph) => `### ${ph.name}\n${p.tasks.filter((t) => t.phase === ph.id).map((t) => `- [${t.status === "done" ? "x" : " "}] ${t.title} (${t.hours}h, ${t.priority})`).join("\n")}`).join("\n\n");
const stackMd = (p) => p.plan.stack.map((s) => `- **${s.name}** (${s.group}): ${s.why}${s.alts ? ` Alternatives: ${s.alts}.` : ""}`).join("\n");
export const docs = {
  roadmap: (p) => `# ${p.title}: Development roadmap\n\n${p.plan.note}\n\n${box(p)}\n`,
  checklist: (p) => `# ${p.title}: Task checklist (${pct(p)}% complete)\n\n${box(p)}\n`,
  readme: (p) => `# ${p.title}\n\n${p.idea}\n\n## Problem\n${p.plan.problem}\n\n## Features\n${L(p.plan.features)}\n\n## Technology stack\n${stackMd(p)}\n\n## Setup\n\`\`\`bash\ngit clone <repo-url>\ncd ${p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}\nnpm install\nnpm run dev\n\`\`\`\n\n## Roadmap\n${p.plan.phases.map((ph) => `- ${ph.name}`).join("\n")}\n\n## Testing\n${L(p.plan.testing)}\n\n## Deployment\n${L(p.plan.deployment)}\n\n## Future improvements\n${L(p.plan.future)}\n`,
  full: (p) => `# ${p.title}\n\n**Category:** ${p.category} | **Level:** ${p.level} | **Progress:** ${pct(p)}% | **Status:** ${statusOf(p)}\n\n## Summary\n${p.plan.summary}\n\n## Problem\n${p.plan.problem}\n\n## Audience\n${p.plan.audience}\n\n## Objectives\n${L(p.plan.objectives)}\n\n## MVP scope\n${L(p.plan.mvp)}\n\n## Optional features\n${L(p.plan.optional)}\n\n## Architecture\n${p.plan.architecture}\n\n## Technology stack\n${stackMd(p)}\n\n## Tasks\n${box(p)}\n\n## Tools\n${L(p.plan.tools)}\n\n## Testing\n${L(p.plan.testing)}\n\n## Deployment checklist\n${L(p.plan.deployment)}\n\n## Future improvements\n${L(p.plan.future)}\n\n_${p.plan.note}_\n`,
};
