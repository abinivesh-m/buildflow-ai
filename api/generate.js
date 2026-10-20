const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (req.body) return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

const arr = (v) => (Array.isArray(v) ? v : []);
const str = (v) => (typeof v === "string" ? v : "");

function normalize(p) {
  return {
    overview: str(p.overview),
    stack: arr(p.stack).map((s) => ({ name: str(s.name), category: str(s.category), why: str(s.why) })),
    phases: arr(p.phases).map((ph) => ({
      name: str(ph.name),
      goal: str(ph.goal),
      tasks: arr(ph.tasks).map((t) => ({ title: str(t.title), hours: Math.max(0.5, Number(t.hours) || 1) })),
    })),
    tools: arr(p.tools).map((t) => ({ name: str(t.name), purpose: str(t.purpose) })),
    challenges: arr(p.challenges).map((c) => ({ risk: str(c.risk), mitigation: str(c.mitigation) })),
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Use POST." });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return send(res, 500, { error: "The server has no GEMINI_API_KEY set." });

  let body;
  try { body = await readBody(req); } catch { return send(res, 400, { error: "Invalid request." }); }

  const idea = str(body.idea).trim().slice(0, 4000);
  const time = Number(body.time);
  const unit = ["hours", "days", "weeks"].includes(body.unit) ? body.unit : "days";
  const skills = arr(body.skills).map(str).filter(Boolean).slice(0, 20);
  const category = str(body.category).slice(0, 60);
  if (idea.length < 20 || !(time > 0) || !skills.length || !category) {
    return send(res, 400, { error: "Idea, time, skills and category are required." });
  }

  const system =
    "You are a senior engineer helping students and hackathon participants plan buildable projects. " +
    "Reply with ONE valid JSON object and nothing else: no markdown, no code fences. Schema: " +
    '{"overview": string (2-4 sentences), ' +
    '"stack": [{"name": string, "category": string, "why": string}] (4-7 items, choose tools that match the person\'s skills), ' +
    '"phases": [{"name": string, "goal": string, "tasks": [{"title": string, "hours": number}]}] (3-5 phases, 3-6 concrete tasks each, hours realistic and the total should fit the available time), ' +
    '"tools": [{"name": string, "purpose": string}] (4-8 items), ' +
    '"challenges": [{"risk": string, "mitigation": string}] (3-5 items)}.';
  const user =
    `Project idea: ${idea}\nCategory: ${category}\nAvailable development time: ${time} ${unit}\n` +
    `Technical skills: ${skills.join(", ")}\nPlan a realistic MVP that one person can finish in that time.`;

  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: { responseMimeType: "application/json", maxOutputTokens: 8192, temperature: 0.7 },
      }),
    });
    if (!r.ok) return send(res, 502, { error: `The AI service returned an error (${r.status}). Check your Gemini API key and try again.` });
    const data = await r.json();
    const text = arr(data.candidates?.[0]?.content?.parts).map((c) => str(c.text)).join("");
    const s = text.indexOf("{"), e = text.lastIndexOf("}");
    if (s < 0 || e < 0) throw new Error("no json");
    const plan = normalize(JSON.parse(text.slice(s, e + 1)));
    if (!plan.phases.length || !plan.phases.some((p) => p.tasks.length)) throw new Error("empty plan");
    return send(res, 200, { plan });
  } catch {
    return send(res, 502, { error: "The plan came back in an unexpected format. Try generating again." });
  }
}
