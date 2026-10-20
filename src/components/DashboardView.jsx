import React, { useState } from "react";
import { pct, statusOf } from "../engine.js";

export default function DashboardView({ projects, activity, onOpenProject, onNewProject, onDuplicate, onDelete }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const filteredProjects = projects.filter((p) => {
    const matchQ = `${p.title} ${p.idea || ""}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = !filterCategory || p.category === filterCategory;
    return matchQ && matchCat;
  });

  const categories = [...new Set(projects.map((p) => p.category).filter(Boolean))];

  const totalTasks = projects.flatMap((p) => p.tasks || []);
  const completedTasks = totalTasks.filter((t) => t.status === "done").length;
  const overallPct = totalTasks.length ? Math.round((completedTasks / totalTasks.length) * 100) : 0;

  return (
    <div>
      {/* Top Welcome Header */}
      <div className="section-head">
        <div>
          <h1 className="page-title">Project Control Center</h1>
          <p className="page-subtitle">
            Track execution velocity, active phase deliverables, and next actionable steps.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onNewProject}>
          + New Project
        </button>
      </div>

      {/* Primary Execution Metrics (Strictly Real Persisted Data) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div className="card" style={{ padding: "20px" }}>
          <span className="form-hint" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Active Projects
          </span>
          <div style={{ fontSize: "1.85rem", fontWeight: 800, marginTop: "4px" }}>
            {projects.length}
          </div>
          <p className="form-hint" style={{ marginTop: "4px" }}>
            {projects.filter((p) => statusOf(p) === "in progress").length} in progress
          </p>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <span className="form-hint" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Tasks Completed
          </span>
          <div style={{ fontSize: "1.85rem", fontWeight: 800, marginTop: "4px", color: "var(--accent-emerald)" }}>
            {completedTasks} / {totalTasks.length}
          </div>
          <p className="form-hint" style={{ marginTop: "4px" }}>
            {totalTasks.length - completedTasks} remaining
          </p>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <span className="form-hint" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Execution Progress
          </span>
          <div style={{ fontSize: "1.85rem", fontWeight: 800, marginTop: "4px", color: "var(--accent-cyan)" }}>
            {overallPct}%
          </div>
          <div className="progress-container" style={{ marginTop: "10px" }}>
            <div className="progress-fill" style={{ width: `${overallPct}%` }} />
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <span className="form-hint" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Finished Projects
          </span>
          <div style={{ fontSize: "1.85rem", fontWeight: 800, marginTop: "4px" }}>
            {projects.filter((p) => statusOf(p) === "completed").length}
          </div>
          <p className="form-hint" style={{ marginTop: "4px" }}>Verified and ready</p>
        </div>
      </div>

      {/* Projects List & Recent Feed */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        {/* Left Column: Projects */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <h2 style={{ fontSize: "1.25rem" }}>Projects ({projects.length})</h2>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                className="input"
                style={{ padding: "6px 12px", fontSize: "0.85rem", width: "180px" }}
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {categories.length > 0 && (
                <select
                  className="select"
                  style={{ padding: "6px 12px", fontSize: "0.85rem", width: "140px" }}
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>💡</div>
              <h3 style={{ marginBottom: "6px" }}>No projects created yet</h3>
              <p className="form-hint" style={{ maxWidth: "400px", margin: "0 auto 20px" }}>
                Start by describing what you want to build. BuildFlow will convert your idea into an actionable engineering workspace.
              </p>
              <button className="btn btn-primary" onClick={onNewProject}>
                Create Your First Project
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "32px" }}>
              <p className="form-hint">No projects match the current search filters.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredProjects.map((p) => {
                const completion = pct(p);
                const nextTask = (p.tasks || []).find((t) => t.status !== "done");

                return (
                  <div key={p.id} className="card" style={{ padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <h3
                            style={{
                              fontSize: "1.1rem",
                              cursor: "pointer",
                              color: "var(--text-main)",
                            }}
                            onClick={() => onOpenProject(p.id)}
                          >
                            {p.title}
                          </h3>
                          <span
                            className={`badge ${
                              completion === 100
                                ? "badge-green"
                                : completion > 0
                                ? "badge-blue"
                                : "badge-slate"
                            }`}
                          >
                            {statusOf(p)}
                          </span>
                          <span className="badge badge-purple">{p.category || "General"}</span>
                        </div>
                        <p
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--text-secondary)",
                            marginTop: "6px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {p.idea}
                        </p>
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onOpenProject(p.id)}
                        >
                          Open Workspace →
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          title="Duplicate project"
                          onClick={() => onDuplicate(p)}
                        >
                          Copy
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          title="Delete project"
                          onClick={() => onDelete(p)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar & Next Step */}
                    <div style={{ marginTop: "16px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.78rem",
                          color: "var(--text-muted)",
                          marginBottom: "6px",
                        }}
                      >
                        <span>Completion: {completion}%</span>
                        <span>
                          {(p.tasks || []).filter((t) => t.status === "done").length} of {(p.tasks || []).length} tasks done
                        </span>
                      </div>
                      <div className="progress-container">
                        <div
                          className={`progress-fill ${completion === 100 ? "complete" : ""}`}
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                      {nextTask && (
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-secondary)",
                            marginTop: "10px",
                          }}
                        >
                          <strong style={{ color: "var(--text-main)" }}>Next up:</strong> {nextTask.title} (
                          {nextTask.hours}h)
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Activity Stream & Quick Help */}
        <div>
          <div className="card" style={{ marginBottom: "20px" }}>
            <h3 className="card-title">Recent Activity</h3>
            {activity.length === 0 ? (
              <p className="form-hint">No activity recorded yet. Actions you take will appear here.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {activity.slice(0, 8).map((act) => (
                  <div
                    key={act.id}
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      paddingBottom: "8px",
                      fontSize: "0.82rem",
                    }}
                  >
                    <div style={{ color: "var(--text-main)", fontWeight: 500 }}>{act.text}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.74rem", marginTop: "2px" }}>
                      {new Date(act.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="card"
            style={{
              background: "rgba(37, 99, 235, 0.05)",
              border: "1px solid rgba(37, 99, 235, 0.2)",
            }}
          >
            <h3 style={{ fontSize: "0.95rem", marginBottom: "8px", color: "#60a5fa" }}>
              💡 Honest Engineering Guarantee
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
              BuildFlow will never show fabricated stats, imaginary GitHub syncs, or fake AI completions.
              Your data remains in your control, fully exportable in Markdown, CSV, and JSON.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
