import { useEffect, useRef, useState } from "react";
import "./App.css";
import { CATEGORIES, LEVELS, uid, generatePlan, pct, statusOf, docs } from "./engine.js";

const KEY = "billflow:v2", LEGACY = "billflow:projects";
const rd = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const EMPTY = { title: "", idea: "", problem: "", audience: "", category: "", level: "beginner", time: "", unit: "days", languages: "", skills: "", framework: "", constraints: "", goals: "", deadline: "" };
const arr = (v) => (Array.isArray(v) ? v : []);

function clean(p) {
  if (!p || typeof p !== "object" || !p.plan || !Array.isArray(p.tasks)) return null;
  return { ...EMPTY, ...p, id: p.id || uid(), title: p.title || "Untitled project", tasks: p.tasks.filter((t) => t && t.title).map((t) => ({ id: t.id || uid(), phase: t.phase ?? 0, desc: "", hours: 1, priority: "medium", status: "todo", ...t })),
    plan: { ...p.plan, stack: arr(p.plan.stack), phases: arr(p.plan.phases), objectives: arr(p.plan.objectives), mvp: arr(p.plan.mvp), features: arr(p.plan.features), optional: arr(p.plan.optional), tools: arr(p.plan.tools), testing: arr(p.plan.testing), deployment: arr(p.plan.deployment), future: arr(p.plan.future) },
    createdAt: p.createdAt || Date.now(), updatedAt: p.updatedAt || Date.now(), openedAt: p.openedAt || 0 };
}
// Old v1 projects (billflow:projects) are converted, never deleted or overwritten.
function fromLegacy(o) {
  if (!o || !o.idea) return null;
  const input = { ...EMPTY, title: String(o.idea).slice(0, 50), idea: o.idea, category: o.category || "Other", time: o.time || "7", unit: o.unit || "days", languages: arr(o.skills).join(", "), skills: arr(o.skills).join(", "), level: "intermediate" };
  const g = generatePlan(input);
  if (o.plan && arr(o.plan.phases).length) {
    g.tasks = []; g.plan.phases = o.plan.phases.map((ph, n) => ({ id: n, name: ph.name || `Phase ${n + 1}`, goal: ph.goal || "" }));
    o.plan.phases.forEach((ph, n) => arr(ph.tasks).forEach((t, k) => g.tasks.push({ id: uid(), phase: n, title: t.title, desc: "", hours: t.hours || 1, priority: "medium", status: o.plan.done?.[`${n}-${k}`] ? "done" : "todo", custom: false })));
    g.plan.summary = o.plan.overview || g.plan.summary;
  }
  return clean({ ...input, id: o.id, ...g, createdAt: Date.parse(o.savedAt) || Date.now(), updatedAt: Date.parse(o.savedAt) || Date.now() });
}
function loadStore() {
  const v2 = rd(KEY);
  if (v2 && Array.isArray(v2.projects)) return { projects: v2.projects.map(clean).filter(Boolean), activity: arr(v2.activity) };
  const old = rd(LEGACY);
  return { projects: arr(old).map(fromLegacy).filter(Boolean), activity: [] };
}
const ago = (t) => { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? "just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`; };
const download = (name, text, type = "text/markdown") => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href); };

export default function App() {
  const [store, setStore] = useState(loadStore);
  const [view, setView] = useState("dashboard");
  const [pid, setPid] = useState(null);
  const [tab, setTab] = useState("overview");
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState("");
  const [storageOk, setStorageOk] = useState(true);
  const dlg = useRef(null);
  const { projects, activity } = store;
  const cur = projects.find((p) => p.id === pid);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(store)); setStorageOk(true); } catch { setStorageOk(false); } }, [store]);
  useEffect(() => { if (confirm) dlg.current?.showModal(); else dlg.current?.close(); }, [confirm]);
  const say = (m) => { setToast(m); setTimeout(() => setToast(""), 3000); };
  const commit = (fn, act) => setStore((s) => ({ projects: fn(s.projects), activity: act ? [{ id: uid(), text: act, at: Date.now() }, ...s.activity].slice(0, 30) : s.activity }));
  const patch = (id, fn, act) => commit((ps) => ps.map((p) => (p.id === id ? { ...fn(p), updatedAt: Date.now() } : p)), act);
  const open = (id, t = "overview") => { setPid(id); setTab(t); setView("workspace"); patch(id, (p) => ({ ...p, openedAt: Date.now() }), null); };
  const ask = (msg, yes) => setConfirm({ msg, yes });

  const create = (input) => {
    const g = generatePlan(input);
    const p = { ...input, id: uid(), ...g, createdAt: Date.now(), updatedAt: Date.now(), openedAt: Date.now() };
    commit((ps) => [p, ...ps], `Created "${p.title}"`);
    setPid(p.id); setTab("overview"); setView("workspace"); say("Plan generated.");
  };
  const regenerate = (p) => ask("Regenerate the plan? Generated tasks and text will be replaced. Your custom tasks and tasks with the same title that are done are kept.", () => {
    const g = generatePlan(p), done = new Set(p.tasks.filter((t) => t.status === "done").map((t) => t.title));
    patch(p.id, (x) => ({ ...x, plan: g.plan, tasks: [...g.tasks.map((t) => (done.has(t.title) ? { ...t, status: "done" } : t)), ...x.tasks.filter((t) => t.custom).map((t) => ({ ...t, phase: Math.min(t.phase, g.plan.phases.length - 1) }))] }), `Regenerated plan for "${p.title}"`);
    say("Plan regenerated.");
  });

  const nav = [["dashboard", "Dashboard"], ["create", "Create project"], ["projects", "My projects"], ["workspace", "Workspace"], ["export", "Export settings"]];
  const go = (v) => { if (v === "workspace" && !cur) { setView("projects"); say("Open a project first."); } else setView(v); };

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand"><span className="brand-mark" aria-hidden="true" />BuildFlow AI</div>
        <nav aria-label="Main">
          {nav.map(([v, l]) => <button key={v} className={"nav-item" + (view === v ? " on" : "")} aria-current={view === v ? "page" : undefined} onClick={() => go(v)}>{l}</button>)}
        </nav>
        <p className="tagline">From idea to execution.</p>
      </aside>
      <main className="main">
        {!storageOk && <p className="alert" role="alert">Browser storage is unavailable, so changes will not be saved after you close this tab.</p>}
        {view === "dashboard" && <Dashboard {...{ projects, activity, open, go }} />}
        {view === "create" && <Wizard onCreate={create} />}
        {view === "projects" && <Library {...{ projects, open, patch, commit, ask, say, setView }} />}
        {view === "workspace" && cur && <Workspace {...{ p: cur, tab, setTab, patch, ask, say, regenerate }} />}
        {view === "export" && <ExportView {...{ projects, say }} />}
      </main>
      <p className="toast" role="status">{toast}</p>
      <dialog ref={dlg} className="dialog" onClose={() => setConfirm(null)}>
        <p>{confirm?.msg}</p>
        <div className="actions"><button className="btn btn-ghost" onClick={() => setConfirm(null)}>Cancel</button><button className="btn btn-primary" onClick={() => { confirm.yes(); setConfirm(null); }}>Confirm</button></div>
      </dialog>
    </div>
  );
}

function Bar({ v }) { return <div className="progress" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}><div className="progress-bar" style={{ width: v + "%" }} /><span className="progress-label">{v}%</span></div>; }

function Dashboard({ projects, activity, open, go }) {
  const h = new Date().getHours(), hi = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  if (!projects.length) return <section><h1>{hi}. Welcome to BuildFlow AI.</h1><div className="card empty-card"><h2>Start your first project</h2><p>Describe an idea, your skills and your time. You get a realistic plan with tasks you can track.</p><button className="btn btn-primary" onClick={() => go("create")}>Create new project</button></div></section>;
  const tasks = projects.flatMap((p) => p.tasks), done = tasks.filter((t) => t.status === "done").length;
  const overall = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const recent = [...projects].sort((a, b) => b.openedAt - a.openedAt)[0];
  const unfinished = projects.filter((p) => pct(p) < 100).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4);
  const stats = [["Saved projects", projects.length], ["In progress", projects.filter((p) => statusOf(p) === "in progress").length], ["Completed", projects.filter((p) => statusOf(p) === "completed").length], ["Task completion", overall + "%"]];
  return (
    <section>
      <div className="head"><h1>{hi}. Here is where your projects stand.</h1><button className="btn btn-primary" onClick={() => go("create")}>Create new project</button></div>
      <div className="stats">{stats.map(([l, v]) => <div className="card stat" key={l}><p className="stat-v">{v}</p><p className="hint">{l}</p></div>)}</div>
      <div className="two">
        <div className="card block"><h2>Continue working</h2>
          {recent && <p className="hint">Recently opened: <button className="link" onClick={() => open(recent.id)}>{recent.title}</button></p>}
          {unfinished.length ? unfinished.map((p) => <button className="row-btn" key={p.id} onClick={() => open(p.id, "tasks")}><span>{p.title}</span><Bar v={pct(p)} /></button>) : <p className="empty">Every project is complete.</p>}
        </div>
        <div className="card block"><h2>Recent activity</h2>
          {activity.length ? <ul className="plain">{activity.slice(0, 6).map((a) => <li key={a.id}>{a.text} <span className="hint">{ago(a.at)}</span></li>)}</ul> : <p className="empty">Activity appears here as you work.</p>}
        </div>
      </div>
    </section>
  );
}

const STEPS = ["Basics", "Constraints", "Goals and review"];
function Wizard({ onCreate }) {
  const [f, setF] = useState(EMPTY), [step, setStep] = useState(0), [err, setErr] = useState({}), [busy, setBusy] = useState(false);
  const set = (k, v) => { setF((x) => ({ ...x, [k]: v })); setErr((e) => ({ ...e, [k]: undefined })); };
  const check = (s) => {
    const e = {};
    if (s >= 0) { if (!f.title.trim()) e.title = "Enter a project title."; if (f.idea.trim().length < 20) e.idea = "Describe the idea in at least 20 characters."; if (!f.category) e.category = "Choose a category."; }
    if (s >= 1) { if (!(Number(f.time) > 0)) e.time = "Enter a duration greater than zero."; if (!f.languages.trim() && !f.skills.trim()) e.skills = "List a language or skill."; }
    return e;
  };
  const next = () => { const e = check(step); setErr(e); if (!Object.keys(e).length) setStep(step + 1); };
  const submit = (e) => { e.preventDefault(); if (busy) return; const er = check(2); setErr(er); const bad = Object.keys(er); if (bad.length) { setStep(bad.some((k) => ["title", "idea", "category"].includes(k)) ? 0 : 1); return; } setBusy(true); try { onCreate({ ...f, title: f.title.trim(), idea: f.idea.trim() }); } catch { setErr({ idea: "Something went wrong generating the plan. Check your inputs and try again." }); setBusy(false); } };
  const T = (k, label, o = {}) => <div className="field"><label htmlFor={k}>{label}{o.req ? " *" : ""}</label>{o.area ? <textarea id={k} rows={3} value={f[k]} onChange={(e) => set(k, e.target.value)} placeholder={o.ph} aria-invalid={!!err[k]} /> : <input id={k} type={o.type || "text"} value={f[k]} onChange={(e) => set(k, e.target.value)} placeholder={o.ph} aria-invalid={!!err[k]} />}{err[k] && <p className="error">{err[k]}</p>}</div>;
  const S = (k, label, opts, o = {}) => <div className="field"><label htmlFor={k}>{label}{o.req ? " *" : ""}</label><select id={k} value={f[k]} onChange={(e) => set(k, e.target.value)} aria-invalid={!!err[k]}>{o.req && <option value="">Select</option>}{opts.map((x) => <option key={x}>{x}</option>)}</select>{err[k] && <p className="error">{err[k]}</p>}</div>;
  return (
    <section><h1>Create project</h1>
      <ol className="steps" aria-label="Progress">{STEPS.map((s, n) => <li key={s} className={n === step ? "on" : n < step ? "past" : ""} aria-current={n === step ? "step" : undefined}>{s}</li>)}</ol>
      <form className="card form" onSubmit={submit} noValidate>
        {step === 0 && <>{T("title", "Project title", { req: 1 })}{T("idea", "Rough project idea", { req: 1, area: 1, ph: "What do you want to build?" })}{T("problem", "Problem being solved", { area: 1 })}{T("audience", "Target audience")}{S("category", "Project category", CATEGORIES, { req: 1 })}</>}
        {step === 1 && <>{S("level", "Experience level", LEVELS)}
          <div className="field"><label htmlFor="time">Available development time *</label><div className="inline"><input id="time" type="number" min="1" value={f.time} onChange={(e) => set("time", e.target.value)} aria-invalid={!!err.time} /><select aria-label="Time unit" value={f.unit} onChange={(e) => set("unit", e.target.value)}><option>hours</option><option>days</option><option>weeks</option></select></div>{err.time && <p className="error">{err.time}</p>}</div>
          {T("languages", "Preferred programming languages", { ph: "Python, JavaScript" })}{T("skills", "Existing technical skills", { ph: "React, SQL" })}{err.skills && <p className="error">{err.skills}</p>}{T("framework", "Preferred framework or tools")}{T("constraints", "Budget or resource constraints", { ph: "Free tools only" })}{T("deadline", "Deadline (optional)", { type: "date" })}</>}
        {step === 2 && <>{T("goals", "Important project goals (one per line)", { area: 1 })}
          <dl className="review">{[["Title", f.title], ["Category", f.category], ["Level", f.level], ["Time", `${f.time} ${f.unit}`], ["Languages", f.languages || f.skills]].map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl></>}
        <div className="actions">
          {step > 0 && <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>Back</button>}
          {step < 2 ? <button type="button" className="btn btn-primary" onClick={next}>Continue</button> : <button className="btn btn-primary" disabled={busy}>Generate plan</button>}
        </div>
        <p className="hint">The plan comes from a built-in rule-based generator that uses your category, level, skills and time. It is not an AI model.</p>
      </form>
    </section>
  );
}

function Library({ projects, open, patch, commit, ask, say, setView }) {
  const [q, setQ] = useState(""), [cat, setCat] = useState(""), [st, setSt] = useState(""), [sort, setSort] = useState("recent");
  let list = projects.filter((p) => (`${p.title} ${p.idea}`.toLowerCase().includes(q.toLowerCase())) && (!cat || p.category === cat) && (!st || statusOf(p) === st));
  list = [...list].sort((a, b) => (sort === "az" ? a.title.localeCompare(b.title) : b.updatedAt - a.updatedAt));
  const dup = (p) => { commit((ps) => [{ ...p, id: uid(), title: p.title + " (copy)", createdAt: Date.now(), updatedAt: Date.now(), openedAt: 0, tasks: p.tasks.map((t) => ({ ...t, id: uid() })) }, ...ps], `Duplicated "${p.title}"`); say("Project duplicated."); };
  return (
    <section><div className="head"><h1>My projects</h1><button className="btn btn-primary" onClick={() => setView("create")}>Create new project</button></div>
      <div className="filters">
        <input aria-label="Search projects" placeholder="Search title or description" value={q} onChange={(e) => setQ(e.target.value)} />
        <select aria-label="Filter by category" value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        <select aria-label="Filter by status" value={st} onChange={(e) => setSt(e.target.value)}><option value="">All statuses</option><option>planning</option><option>in progress</option><option>completed</option></select>
        <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}><option value="recent">Recently updated</option><option value="az">A to Z</option></select>
      </div>
      {!projects.length ? <p className="empty">No projects yet. Create one to get started.</p> : !list.length ? <p className="empty">No projects match these filters.</p> :
        <ul className="plain">{list.map((p) => <li className="project" key={p.id}>
          <div><p className="project-idea">{p.title}</p><p className="project-meta">{p.category}, {p.level}, {statusOf(p)}, updated {ago(p.updatedAt)}</p><Bar v={pct(p)} /></div>
          <div className="project-actions">
            <button className="btn btn-ghost" onClick={() => open(p.id, pct(p) < 100 ? "tasks" : "overview")}>{pct(p) < 100 ? "Continue" : "Open"}</button>
            <button className="btn btn-ghost" onClick={() => open(p.id, "overview")}>Edit</button>
            <button className="btn btn-ghost" onClick={() => dup(p)}>Duplicate</button>
            <button className="btn btn-ghost danger" onClick={() => ask(`Delete "${p.title}"? This cannot be undone.`, () => { commit((ps) => ps.filter((x) => x.id !== p.id), `Deleted "${p.title}"`); say("Project deleted."); })}>Delete</button>
          </div></li>)}</ul>}
    </section>
  );
}

const SECTIONS = [["summary", "Project summary", 0], ["problem", "Problem statement", 0], ["audience", "Target audience", 0], ["objectives", "Objectives", 1], ["mvp", "MVP scope", 1], ["features", "Essential features", 1], ["optional", "Optional features", 1], ["architecture", "Architecture overview", 0], ["solution", "Proposed solution", 0], ["tools", "Required tools", 1], ["testing", "Testing strategy", 1], ["deployment", "Deployment checklist", 1], ["future", "Future improvements", 1]];
function Workspace({ p, tab, setTab, patch, ask, say, regenerate }) {
  const tabs = [["overview", "Overview"], ["roadmap", "Roadmap"], ["tasks", "Tasks"], ["stack", "Technology stack"], ["docs", "Documentation"]];
  const setPlan = (k, v) => patch(p.id, (x) => ({ ...x, plan: { ...x.plan, [k]: v } }), null);
  return (
    <section>
      <div className="head"><div><h1>{p.title}</h1><p className="hint">{statusOf(p)}{p.deadline ? `, due ${p.deadline}` : ""}</p></div><button className="btn btn-ghost" onClick={() => regenerate(p)}>Regenerate plan</button></div>
      <Bar v={pct(p)} />
      <div className="tabs" role="tablist">{tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={"tab" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>{l}</button>)}</div>
      {tab === "overview" && <div className="card form">
        {[["title", "Title"], ["deadline", "Deadline"]].map(([k, l]) => <div className="field" key={k}><label htmlFor={"w" + k}>{l}</label><input id={"w" + k} type={k === "deadline" ? "date" : "text"} value={p[k]} onChange={(e) => patch(p.id, (x) => ({ ...x, [k]: e.target.value }), null)} /></div>)}
        <div className="field"><label htmlFor="widea">Description</label><textarea id="widea" rows={3} value={p.idea} onChange={(e) => patch(p.id, (x) => ({ ...x, idea: e.target.value }), null)} /></div>
        <div className="field"><label htmlFor="wcat">Category</label><select id="wcat" value={p.category} onChange={(e) => patch(p.id, (x) => ({ ...x, category: e.target.value }), null)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
        {SECTIONS.map(([k, l, list]) => <div className="field" key={k}><label htmlFor={"s" + k}>{l}{list ? " (one per line)" : ""}</label><textarea id={"s" + k} rows={list ? 4 : 3} value={list ? arr(p.plan[k]).join("\n") : p.plan[k] || ""} onChange={(e) => setPlan(k, list ? e.target.value.split("\n") : e.target.value)} onBlur={(e) => list && setPlan(k, e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} /></div>)}
        <p className="hint">{p.plan.note} Edits save automatically.</p></div>}
      {tab === "roadmap" && <div>{p.plan.phases.map((ph) => { const ts = p.tasks.filter((t) => t.phase === ph.id), d = ts.filter((t) => t.status === "done").length; return <div className="card block" key={ph.id}><h2>{ph.name}</h2><p className="hint">{ph.goal}. {d} of {ts.length} tasks done, {ts.reduce((a, t) => a + Number(t.hours), 0)}h planned.</p><Bar v={ts.length ? Math.round((d / ts.length) * 100) : 0} /></div>; })}</div>}
      {tab === "tasks" && <Tasks {...{ p, patch, ask, say }} />}
      {tab === "stack" && <Stack {...{ p, patch }} />}
      {tab === "docs" && <div className="card block"><h2>Download Markdown</h2><div className="actions">{[["full", "Complete project", "project.md"], ["readme", "README.md", "README.md"], ["roadmap", "Roadmap", "roadmap.md"], ["checklist", "Task checklist", "checklist.md"]].map(([k, l, f]) => <button key={k} className="btn btn-ghost" onClick={() => { try { download(f, docs[k](p)); say(`Downloaded ${f}.`); } catch { say("Export failed. Try again."); } }}>{l}</button>)}</div><pre className="preview" tabIndex={0}>{docs.readme(p)}</pre></div>}
    </section>
  );
}

function Tasks({ p, patch, ask, say }) {
  const [q, setQ] = useState(""), [fs, setFs] = useState(""), [fp, setFp] = useState(""), [nt, setNt] = useState(""), [np, setNp] = useState(0);
  const today = new Date().toISOString().slice(0, 10);
  const upd = (id, c, act) => patch(p.id, (x) => ({ ...x, tasks: x.tasks.map((t) => (t.id === id ? { ...t, ...c } : t)) }), act);
  const add = (e) => { e.preventDefault(); if (!nt.trim()) return say("Enter a task title."); patch(p.id, (x) => ({ ...x, tasks: [...x.tasks, { id: uid(), phase: Number(np), title: nt.trim(), desc: "", hours: 1, priority: "medium", status: "todo", custom: true }] }), `Added task "${nt.trim()}"`); setNt(""); };
  const vis = p.tasks.filter((t) => `${t.title} ${t.desc}`.toLowerCase().includes(q.toLowerCase()) && (!fs || t.status === fs) && (!fp || t.priority === fp));
  const done = p.tasks.filter((t) => t.status === "done").length;
  return (
    <div>
      <p className="hint">{done} completed, {p.tasks.length - done} remaining.</p>
      <form className="filters" onSubmit={add}><input aria-label="New task title" placeholder="Add a custom task" value={nt} onChange={(e) => setNt(e.target.value)} /><select aria-label="Phase" value={np} onChange={(e) => setNp(e.target.value)}>{p.plan.phases.map((ph) => <option key={ph.id} value={ph.id}>{ph.name}</option>)}</select><button className="btn btn-primary">Add task</button></form>
      <div className="filters"><input aria-label="Search tasks" placeholder="Search tasks" value={q} onChange={(e) => setQ(e.target.value)} />
        <select aria-label="Filter by status" value={fs} onChange={(e) => setFs(e.target.value)}><option value="">All statuses</option><option value="todo">To do</option><option value="doing">In progress</option><option value="done">Done</option></select>
        <select aria-label="Filter by priority" value={fp} onChange={(e) => setFp(e.target.value)}><option value="">All priorities</option><option>high</option><option>medium</option><option>low</option></select></div>
      {!p.tasks.length ? <p className="empty">This project has no tasks. Add one above.</p> : !vis.length ? <p className="empty">No tasks match these filters.</p> :
        p.plan.phases.map((ph) => { const all = p.tasks.filter((t) => t.phase === ph.id), ts = vis.filter((t) => t.phase === ph.id); return ts.length ? <div className="card block" key={ph.id}><h2>{ph.name} <span className="tag">{all.filter((t) => t.status === "done").length}/{all.length}</span></h2>
          {ts.map((t) => <div className={"trow" + (t.status === "done" ? " done" : "")} key={t.id}>
            <input type="checkbox" aria-label={`Mark "${t.title}" complete`} checked={t.status === "done"} onChange={() => upd(t.id, { status: t.status === "done" ? "todo" : "done" }, t.status === "done" ? null : `Completed "${t.title}"`)} />
            <div className="tmain"><input aria-label="Task title" value={t.title} onChange={(e) => upd(t.id, { title: e.target.value })} /><input aria-label="Task description" className="tdesc" placeholder="Description" value={t.desc} onChange={(e) => upd(t.id, { desc: e.target.value })} />
              {p.deadline && p.deadline < today && t.status !== "done" && <span className="tag late">Overdue</span>}</div>
            <select aria-label="Priority" value={t.priority} onChange={(e) => upd(t.id, { priority: e.target.value })}><option>low</option><option>medium</option><option>high</option></select>
            <select aria-label="Status" value={t.status} onChange={(e) => upd(t.id, { status: e.target.value })}><option value="todo">To do</option><option value="doing">In progress</option><option value="done">Done</option></select>
            <input aria-label="Hours" className="hrs" type="number" min="0.5" step="0.5" value={t.hours} onChange={(e) => upd(t.id, { hours: Number(e.target.value) || 0.5 })} />
            <button className="btn btn-ghost danger" onClick={() => ask(`Delete task "${t.title}"?`, () => patch(p.id, (x) => ({ ...x, tasks: x.tasks.filter((y) => y.id !== t.id) }), null))}>Delete</button></div>)}</div> : null; })}
    </div>
  );
}

const GROUPS = ["Frontend", "Backend", "Database", "APIs and integrations", "Development tools", "Deployment"];
function Stack({ p, patch }) {
  const upd = (id, c) => patch(p.id, (x) => ({ ...x, plan: { ...x.plan, stack: x.plan.stack.map((s) => (s.id === id ? { ...s, ...c } : s)) } }), null);
  return <div>{GROUPS.map((g) => <div className="card block" key={g}><h2>{g}</h2>
    {p.plan.stack.filter((s) => s.group === g).map((s) => <div className="stack-row" key={s.id}>
      <input aria-label="Technology" value={s.name} onChange={(e) => upd(s.id, { name: e.target.value })} /><input aria-label="Why it fits" value={s.why} onChange={(e) => upd(s.id, { why: e.target.value })} />
      <p className="hint">{s.level}{s.alts ? `. Alternatives: ${s.alts}` : ""}</p>
      <button className="btn btn-ghost danger" onClick={() => patch(p.id, (x) => ({ ...x, plan: { ...x.plan, stack: x.plan.stack.filter((y) => y.id !== s.id) } }), null)}>Remove</button></div>)}
    <button className="btn btn-ghost" onClick={() => patch(p.id, (x) => ({ ...x, plan: { ...x.plan, stack: [...x.plan.stack, { id: uid(), group: g, name: "New technology", why: "Why it fits this project", level: "Moderate", alts: "" }] } }), null)}>Add to {g.toLowerCase()}</button></div>)}</div>;
}

function ExportView({ projects, say }) {
  return <section><h1>Export settings</h1>
    <div className="card block"><h2>Backup all projects</h2><p>Download every project, task and plan as one JSON file.</p><button className="btn btn-primary" disabled={!projects.length} onClick={() => { download("billflow-backup.json", JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), projects }, null, 2), "application/json"); say("Backup downloaded."); }}>Download JSON backup</button>{!projects.length && <p className="empty">Nothing to back up yet.</p>}</div>
    <div className="card block"><h2>Where your data lives</h2><p>Projects are stored only in this browser's local storage. Nothing is synced or sent anywhere, and clearing site data deletes them. Download a backup to keep a copy. Per-project Markdown exports are in each project's Documentation tab.</p></div></section>;
}
