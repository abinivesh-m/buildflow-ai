import React, { useState } from "react";
import { pct, statusOf, docs, CATEGORIES } from "../engine.js";
import TasksManager from "./TasksManager.jsx";
import DecisionsManager from "./DecisionsManager.jsx";
import TestingChecklist from "./TestingChecklist.jsx";
import DeploymentCenter from "./DeploymentCenter.jsx";
import DemoStudio from "./DemoStudio.jsx";
import PlanBlueprint from "./PlanBlueprint.jsx";
import RequirementsManager from "./RequirementsManager.jsx";
import TraceabilityMatrix from "./TraceabilityMatrix.jsx";
import ArchitectureView from "./ArchitectureView.jsx";
import RiskRegister from "./RiskRegister.jsx";

const TABS = [
  { id: "overview", label: "Control Center", icon: "📊" },
  { id: "requirements", label: "Requirements", icon: "🎯" },
  { id: "traceability", label: "Traceability Matrix", icon: "🔗" },
  { id: "architecture", label: "Architecture & Mermaid", icon: "📐" },
  { id: "tasks", label: "Tasks (Kanban & List)", icon: "📋" },
  { id: "decisions", label: "Decisions (TDR)", icon: "🏛️" },
  { id: "testing", label: "Testing Checklist", icon: "🧪" },
  { id: "risks", label: "Risk Register", icon: "🛡️" },
  { id: "deployment", label: "Release Readiness", icon: "🚀" },
  { id: "demo", label: "Demo Studio", icon: "🎤" },
  { id: "plan", label: "Plan Blueprint", icon: "📄" },
  { id: "settings", label: "Settings & Exports", icon: "⚙️" },
];

export default function WorkspaceView({
  project,
  tab,
  setTab,
  onPatch,
  onAskConfirm,
  onNotify,
  onRegenerate,
}) {
  const completion = pct(project);
  const currentStatus = statusOf(project);

  const downloadFile = (name, text, mime = "text/plain") => {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    onNotify(`Downloaded ${name}`);
  };

  return (
    <div>
      {/* Workspace Header */}
      <div
        className="card"
        style={{
          marginBottom: "20px",
          padding: "24px 28px",
          background: "linear-gradient(180deg, var(--bg-card) 0%, var(--bg-subtle) 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "1.7rem", margin: 0 }}>{project.title}</h1>
              <span
                className={`badge ${
                  completion === 100
                    ? "badge-green"
                    : completion > 0
                    ? "badge-blue"
                    : "badge-slate"
                }`}
              >
                {currentStatus}
              </span>
              <span className="badge badge-purple">{project.category}</span>
              {project.deadline && (
                <span className="badge badge-amber">Due: {project.deadline}</span>
              )}
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                marginTop: "6px",
                maxWidth: "750px",
              }}
            >
              {project.idea}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button className="btn btn-secondary btn-sm" onClick={() => onRegenerate(project)}>
              🔄 Regenerate Plan
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                downloadFile(
                  `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-tasks.csv`,
                  docs.tasksCsv(project),
                  "text/csv"
                )
              }
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Progress meter */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.82rem",
              marginBottom: "6px",
            }}
          >
            <span style={{ fontWeight: 600 }}>Project Execution Completion</span>
            <span style={{ fontWeight: 700, color: "var(--accent-cyan)" }}>
              {completion}% ({(project.tasks || []).filter((t) => t.status === "done").length} of{" "}
              {(project.tasks || []).length} tasks done)
            </span>
          </div>
          <div className="progress-container" style={{ height: "10px" }}>
            <div
              className={`progress-fill ${completion === 100 ? "complete" : ""}`}
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Workspace Tabs Navigation */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          borderBottom: "1px solid var(--border)",
          marginBottom: "24px",
          overflowX: "auto",
          paddingBottom: "2px",
        }}
        role="tablist"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`btn ${tab === t.id ? "btn-primary" : "btn-ghost"}`}
            style={{
              borderRadius: "var(--radius-sm)",
              fontSize: "0.85rem",
              padding: "8px 14px",
              gap: "6px",
              borderBottom: tab === t.id ? "2px solid var(--border-focus)" : "none",
            }}
            onClick={() => setTab(t.id)}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {tab === "overview" && (
        <OverviewSection project={project} onPatch={onPatch} onNotify={onNotify} />
      )}
      {tab === "requirements" && (
        <RequirementsManager
          project={project}
          onPatch={onPatch}
          onAskConfirm={onAskConfirm}
          onNotify={onNotify}
        />
      )}
      {tab === "traceability" && (
        <TraceabilityMatrix
          project={project}
          onPatch={onPatch}
          onNotify={onNotify}
        />
      )}
      {tab === "architecture" && (
        <ArchitectureView
          project={project}
          onPatch={onPatch}
          onNotify={onNotify}
        />
      )}
      {tab === "tasks" && (
        <TasksManager
          project={project}
          onPatch={onPatch}
          onAskConfirm={onAskConfirm}
          onNotify={onNotify}
        />
      )}
      {tab === "decisions" && (
        <DecisionsManager
          project={project}
          onPatch={onPatch}
          onAskConfirm={onAskConfirm}
          onNotify={onNotify}
        />
      )}
      {tab === "testing" && (
        <TestingChecklist project={project} onPatch={onPatch} onNotify={onNotify} />
      )}
      {tab === "risks" && (
        <RiskRegister
          project={project}
          onPatch={onPatch}
          onAskConfirm={onAskConfirm}
          onNotify={onNotify}
        />
      )}
      {tab === "deployment" && (
        <DeploymentCenter project={project} onPatch={onPatch} onNotify={onNotify} />
      )}
      {tab === "demo" && (
        <DemoStudio project={project} onPatch={onPatch} onNotify={onNotify} />
      )}
      {tab === "plan" && (
        <PlanBlueprint project={project} onPatch={onPatch} onNotify={onNotify} />
      )}
      {tab === "settings" && (
        <SettingsSection
          project={project}
          onPatch={onPatch}
          onAskConfirm={onAskConfirm}
          onNotify={onNotify}
          downloadFile={downloadFile}
        />
      )}
    </div>
  );
}

function OverviewSection({ project, onPatch, onNotify }) {
  const tasks = project.tasks || [];
  const nextTask = tasks.find((t) => t.status !== "done");
  const blockedTasks = tasks.filter((t) => t.status === "blocked");
  const phases = project.plan?.phases || [];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
      <div>
        {/* Next Actionable Task Hero */}
        <div
          className="card"
          style={{
            marginBottom: "20px",
            borderLeft: "4px solid var(--primary)",
            background: "var(--bg-subtle)",
          }}
        >
          <div className="form-hint" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Recommended Next Step
          </div>
          {nextTask ? (
            <div style={{ marginTop: "8px" }}>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "4px" }}>{nextTask.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                {nextTask.desc || nextTask.acceptanceCriteria || "Core milestone deliverable"}
              </p>
              <div style={{ display: "flex", gap: "8px", marginTop: "12px", alignItems: "center" }}>
                <span className="badge badge-amber">{nextTask.priority} priority</span>
                <span className="badge badge-slate">{nextTask.hours} hours estimated</span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    onPatch(
                      project.id,
                      (p) => ({
                        ...p,
                        tasks: (p.tasks || []).map((t) =>
                          t.id === nextTask.id ? { ...t, status: "done" } : t
                        ),
                      }),
                      `Completed "${nextTask.title}"`
                    );
                    onNotify(`Marked "${nextTask.title}" done.`);
                  }}
                >
                  ✓ Mark Completed
                </button>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: "8px" }}>
              <h3 style={{ color: "var(--accent-emerald)" }}>🎉 All Tasks Complete!</h3>
              <p className="form-hint" style={{ marginTop: "4px" }}>
                Your project is fully executed. Proceed to the Testing and Deployment Readiness centers.
              </p>
            </div>
          )}
        </div>

        {/* Phase Breakdown */}
        <div className="card" style={{ marginBottom: "20px" }}>
          <h3 className="card-title">Phase Execution Breakdown</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px" }}>
            {phases.map((ph) => {
              const phTasks = tasks.filter((t) => t.phase === ph.id);
              const phDone = phTasks.filter((t) => t.status === "done").length;
              const phPct = phTasks.length ? Math.round((phDone / phTasks.length) * 100) : 0;

              return (
                <div key={ph.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600 }}>{ph.name}</span>
                    <span className="form-hint">
                      {phDone}/{phTasks.length} Done ({phPct}%)
                    </span>
                  </div>
                  <div className="progress-container">
                    <div className="progress-fill" style={{ width: `${phPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Blockers alert if any */}
        {blockedTasks.length > 0 && (
          <div
            className="card"
            style={{
              background: "rgba(244, 63, 94, 0.08)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ color: "var(--accent-rose)", fontSize: "1rem", marginBottom: "8px" }}>
              ⚠️ Active Blockers ({blockedTasks.length})
            </h3>
            <ul style={{ paddingLeft: "20px", fontSize: "0.85rem" }}>
              {blockedTasks.map((b) => (
                <li key={b.id} style={{ marginBottom: "4px" }}>
                  <strong>{b.title}:</strong> {b.blockers}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Right Column: Project Metadata */}
      <div>
        <div className="card" style={{ marginBottom: "20px" }}>
          <h3 className="card-title">Project Profile</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.85rem", marginTop: "12px" }}>
            <div>
              <span className="form-hint">Target Audience</span>
              <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                {project.audience || project.plan?.audience || "Developers & Builders"}
              </div>
            </div>
            <div>
              <span className="form-hint">Technology Stack</span>
              <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                {project.languages || project.skills || "Web Technologies"}
              </div>
            </div>
            <div>
              <span className="form-hint">Allocated Timeline</span>
              <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                {project.time} {project.unit}
              </div>
            </div>
            <div>
              <span className="form-hint">Resource Constraints</span>
              <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                {project.constraints || "None specified"}
              </div>
            </div>
            <div>
              <span className="form-hint">Requirements Coverage</span>
              <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
                {(project.requirements || []).length > 0
                  ? `${(project.requirements || []).filter((r) => r.linkedTaskIds?.length > 0).length} / ${(project.requirements || []).length} linked`
                  : "—"}
              </div>
            </div>
            <div>
              <span className="form-hint">Open Risks</span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                {(() => {
                  const openCount = (project.risks || []).filter((r) => r.status === "open").length;
                  return openCount > 0 ? (
                    <span className="badge badge-rose">{openCount} active risk{openCount > 1 ? "s" : ""}</span>
                  ) : (
                    <span className="badge badge-green">0 open risks</span>
                  );
                })()}
              </div>
            </div>
            <div>
              <span className="form-hint">Traceability Health</span>
              <div style={{ marginTop: "2px" }}>
                {(project.requirements || []).length > 0 ? (
                  <span className="badge badge-green">✓ Matrix Active</span>
                ) : (
                  <span className="badge badge-amber">Set up Requirements</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Quick Action Seam</h3>
          <p className="form-hint" style={{ marginBottom: "12px" }}>
            Every component syncs to the local store and exports real data.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                const text = docs.readme(project);
                navigator.clipboard.writeText(text);
                onNotify("README markdown copied to clipboard.");
              }}
            >
              📋 Copy README.md
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                const text = docs.tasksCsv(project);
                navigator.clipboard.writeText(text);
                onNotify("Tasks CSV copied to clipboard.");
              }}
            >
              📋 Copy Tasks CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ project, onPatch, onNotify, downloadFile }) {
  const [title, setTitle] = useState(project.title);
  const [idea, setIdea] = useState(project.idea);
  const [category, setCategory] = useState(project.category);
  const [deadline, setDeadline] = useState(project.deadline || "");

  const handleSave = (e) => {
    e.preventDefault();
    onPatch(
      project.id,
      (p) => ({
        ...p,
        title: title.trim(),
        idea: idea.trim(),
        category,
        deadline,
      }),
      `Updated settings for "${title.trim()}"`
    );
    onNotify("Project settings saved.");
  };

  return (
    <div style={{ maxWidth: "700px" }}>
      <form className="card" onSubmit={handleSave} style={{ marginBottom: "24px" }}>
        <h3 className="card-title">Project Settings</h3>
        <div className="form-group">
          <label className="form-label">Project Name</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Original Idea / Pitch (Preserved)</label>
          <textarea className="textarea" rows={3} value={idea} onChange={(e) => setIdea(e.target.value)} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input className="input" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>

      <div className="card">
        <h3 className="card-title">Data Exports & Portability</h3>
        <p className="form-hint" style={{ marginBottom: "16px" }}>
          All exports contain your actual saved data, formatted for immediate use.
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() =>
              downloadFile(
                `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-blueprint.md`,
                docs.full(project)
              )
            }
          >
            Full Blueprint (.md)
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => downloadFile("README.md", docs.readme(project))}
          >
            README.md
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() =>
              downloadFile(
                `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-tasks.csv`,
                docs.tasksCsv(project),
                "text/csv"
              )
            }
          >
            Tasks (.csv)
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() =>
              downloadFile(
                `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-tdr.md`,
                docs.decisions(project)
              )
            }
          >
            Technical Decisions (.md)
          </button>
        </div>
      </div>
    </div>
  );
}
