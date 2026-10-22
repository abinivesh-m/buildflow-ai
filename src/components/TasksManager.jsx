import React, { useState } from "react";
import { uid, PRIORITIES, STATUSES } from "../engine.js";

export default function TasksManager({ project, onPatch, onAskConfirm, onNotify }) {
  const [viewMode, setViewMode] = useState("kanban"); // "kanban" | "list"
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newPhase, setNewPhase] = useState(0);
  const [newPriority, setNewPriority] = useState("high");
  const [newHours, setNewHours] = useState(2);
  const [newCriteria, setNewCriteria] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);

  const tasks = project.tasks || [];
  const phases = project.plan?.phases || [];

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      onNotify("Please enter a task title.");
      return;
    }

    const newTask = {
      id: uid(),
      phase: Number(newPhase),
      title: newTitle.trim(),
      desc: "",
      hours: Number(newHours) || 1,
      priority: newPriority,
      status: "todo",
      acceptanceCriteria: newCriteria.trim() || "Demonstrate functional completion without regressions.",
      blockers: "",
      notes: "",
      dependencies: [],
      custom: true,
    };

    onPatch(
      project.id,
      (p) => ({ ...p, tasks: [...(p.tasks || []), newTask] }),
      `Added custom task "${newTask.title}"`
    );

    setNewTitle("");
    setNewCriteria("");
    onNotify("Task added.");
  };

  const handleUpdateTask = (taskId, fields, activityMsg) => {
    // Dependency guard: if completing a task, verify all dependencies are done
    if (fields.status === "done") {
      const currentTask = tasks.find((t) => t.id === taskId);
      if (currentTask && Array.isArray(currentTask.dependencies) && currentTask.dependencies.length > 0) {
        const unfinishedDep = tasks.find(
          (t) => currentTask.dependencies.includes(t.id) && t.status !== "done"
        );
        if (unfinishedDep) {
          onNotify(`Cannot mark done: Depends on "${unfinishedDep.title}" which is still ${unfinishedDep.status}.`);
          return;
        }
      }
    }

    onPatch(
      project.id,
      (p) => ({
        ...p,
        tasks: (p.tasks || []).map((t) => (t.id === taskId ? { ...t, ...fields } : t)),
      }),
      activityMsg
    );
  };

  const handleDeleteTask = (task) => {
    onAskConfirm(`Delete task "${task.title}"? This cannot be undone.`, () => {
      onPatch(
        project.id,
        (p) => ({
          ...p,
          tasks: (p.tasks || []).filter((t) => t.id !== task.id),
        }),
        `Deleted task "${task.title}"`
      );
      onNotify("Task deleted.");
    });
  };

  const filteredTasks = tasks.filter((t) => {
    const matchSearch = `${t.title} ${t.desc || ""} ${t.acceptanceCriteria || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = !filterStatus || t.status === filterStatus;
    const matchPriority = !filterPriority || t.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const completedCount = tasks.filter((t) => t.status === "done").length;
  const blockedCount = tasks.filter((t) => t.status === "blocked").length;

  return (
    <div>
      {/* Overview & Stats bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span className="badge badge-blue">{tasks.length} Total Tasks</span>
          <span className="badge badge-green">{completedCount} Done</span>
          {blockedCount > 0 && <span className="badge badge-rose">{blockedCount} Blocked</span>}
        </div>
        <span className="form-hint">
          Changes persist automatically. Real progress calculated directly from completion.
        </span>
      </div>

      {/* Task Creation Form */}
      <form
        className="card"
        onSubmit={handleAddTask}
        style={{ marginBottom: "24px", background: "var(--bg-subtle)" }}
      >
        <h3 style={{ fontSize: "1rem", marginBottom: "12px" }}>+ Add Task</h3>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 80px", gap: "10px", marginBottom: "10px" }}>
          <input
            className="input"
            placeholder="Task title (e.g. Implement input validation and error states)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <select
            className="select"
            value={newPhase}
            onChange={(e) => setNewPhase(Number(e.target.value))}
          >
            {phases.map((ph) => (
              <option key={ph.id} value={ph.id}>
                {ph.name}
              </option>
            ))}
          </select>
          <select
            className="select"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.toUpperCase()}
              </option>
            ))}
          </select>
          <input
            className="input"
            type="number"
            step="0.5"
            min="0.5"
            title="Estimated Hours"
            value={newHours}
            onChange={(e) => setNewHours(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            className="input"
            placeholder="Acceptance criteria (e.g. Unit tests pass with zero warnings)"
            value={newCriteria}
            onChange={(e) => setNewCriteria(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
            Add Task
          </button>
        </div>
      </form>

      {/* Filtering Bar & View Mode Toggle */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", background: "var(--bg-subtle)", padding: "2px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
          <button
            className={`btn btn-sm ${viewMode === "kanban" ? "btn-primary" : "btn-ghost"}`}
            style={{ fontSize: "0.8rem", padding: "4px 10px" }}
            onClick={() => setViewMode("kanban")}
          >
            📌 Kanban Board
          </button>
          <button
            className={`btn btn-sm ${viewMode === "list" ? "btn-primary" : "btn-ghost"}`}
            style={{ fontSize: "0.8rem", padding: "4px 10px" }}
            onClick={() => setViewMode("list")}
          >
            📋 Phase List
          </button>
        </div>

        <input
          className="input"
          style={{ flex: 1, minWidth: "180px" }}
          placeholder="Search tasks or criteria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select"
          style={{ width: "160px" }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((st) => (
            <option key={st} value={st}>
              {st.toUpperCase()}
            </option>
          ))}
        </select>
        <select
          className="select"
          style={{ width: "160px" }}
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map((pr) => (
            <option key={pr} value={pr}>
              {pr.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Kanban Board View */}
      {viewMode === "kanban" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            alignItems: "start",
            marginBottom: "30px",
          }}
        >
          {STATUSES.map((statusKey) => {
            const colTasks = filteredTasks.filter((t) => t.status === statusKey);
            const statusLabels = {
              backlog: "Backlog",
              todo: "To Do",
              doing: "In Progress",
              blocked: "Blocked ⚠️",
              done: "Completed ✓",
            };

            const statusColors = {
              backlog: "var(--text-muted)",
              todo: "var(--accent-blue)",
              doing: "var(--accent-cyan)",
              blocked: "var(--accent-rose)",
              done: "var(--accent-emerald)",
            };

            return (
              <div
                key={statusKey}
                style={{
                  background: "var(--bg-subtle)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  padding: "14px",
                  minHeight: "380px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Column Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                    paddingBottom: "8px",
                    borderBottom: `2px solid ${statusColors[statusKey]}`,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-main)" }}>
                    {statusLabels[statusKey]}
                  </span>
                  <span className="badge badge-slate" style={{ fontSize: "0.72rem" }}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                  {colTasks.length === 0 ? (
                    <div
                      style={{
                        padding: "24px 10px",
                        textAlign: "center",
                        color: "var(--text-muted)",
                        fontSize: "0.8rem",
                        border: "1px dashed var(--border)",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      No tasks
                    </div>
                  ) : (
                    colTasks.map((t) => (
                      <div
                        key={t.id}
                        className="card"
                        style={{
                          padding: "12px",
                          marginBottom: "0",
                          borderLeft: `3px solid ${
                            t.priority === "critical"
                              ? "var(--accent-rose)"
                              : t.priority === "high"
                              ? "var(--accent-amber)"
                              : "var(--accent-purple)"
                          }`,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "6px" }}>
                          <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-main)", lineHeight: "1.3" }}>
                            {t.title}
                          </span>
                        </div>

                        {t.acceptanceCriteria && (
                          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "6px", lineHeight: "1.3" }}>
                            {t.acceptanceCriteria}
                          </p>
                        )}

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
                          <span className="form-hint" style={{ fontSize: "0.7rem" }}>
                            {t.hours}h · P{t.phase + 1}
                          </span>

                          {/* Quick Advance / Revert buttons */}
                          <div style={{ display: "flex", gap: "4px" }}>
                            {statusKey !== "backlog" && (
                              <button
                                className="btn btn-ghost btn-sm"
                                style={{ padding: "2px 6px", fontSize: "0.68rem" }}
                                title="Move backward"
                                onClick={() => {
                                  const idx = STATUSES.indexOf(statusKey);
                                  if (idx > 0) handleUpdateTask(t.id, { status: STATUSES[idx - 1] });
                                }}
                              >
                                ←
                              </button>
                            )}
                            {statusKey !== "done" && (
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ padding: "2px 6px", fontSize: "0.68rem" }}
                                title="Advance forward"
                                onClick={() => {
                                  const idx = STATUSES.indexOf(statusKey);
                                  if (idx < STATUSES.length - 1) handleUpdateTask(t.id, { status: STATUSES[idx + 1] });
                                }}
                              >
                                →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Phase-Grouped Task Lists (List View) */}
      {viewMode === "list" && phases.map((ph) => {
        const phaseTasks = filteredTasks.filter((t) => t.phase === ph.id);
        const totalPhaseTasks = tasks.filter((t) => t.phase === ph.id);
        const phaseDone = totalPhaseTasks.filter((t) => t.status === "done").length;

        if (totalPhaseTasks.length === 0 && !search && !filterStatus && !filterPriority) {
          return null;
        }

        return (
          <div key={ph.id} className="card" style={{ marginBottom: "20px", padding: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "8px",
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.05rem", display: "inline-block", marginRight: "10px" }}>
                  {ph.name}
                </h3>
                <span className="badge badge-slate">
                  {phaseDone} / {totalPhaseTasks.length} Completed
                </span>
              </div>
              <p className="form-hint" style={{ margin: 0 }}>
                {ph.goal}
              </p>
            </div>

            {phaseTasks.length === 0 ? (
              <p className="form-hint" style={{ padding: "12px 0" }}>
                No tasks in this phase match the selected filters.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {phaseTasks.map((t) => {
                  const isDone = t.status === "done";
                  const isBlocked = t.status === "blocked";
                  const isEditing = editingTaskId === t.id;

                  const priorityColors = {
                    critical: "badge-rose",
                    high: "badge-amber",
                    medium: "badge-blue",
                    low: "badge-slate",
                  };

                  return (
                    <div
                      key={t.id}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "var(--radius-md)",
                        background: isDone
                          ? "rgba(16, 185, 129, 0.05)"
                          : isBlocked
                          ? "rgba(244, 63, 94, 0.06)"
                          : "var(--bg-subtle)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {/* Top Row: Checkbox, Title, Badges, Status Select */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                          flexWrap: "wrap",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "220px" }}>
                          <input
                            type="checkbox"
                            style={{
                              width: "18px",
                              height: "18px",
                              accentColor: "var(--accent-emerald)",
                              cursor: "pointer",
                            }}
                            checked={isDone}
                            onChange={() =>
                              handleUpdateTask(
                                t.id,
                                { status: isDone ? "todo" : "done" },
                                isDone ? null : `Completed "${t.title}"`
                              )
                            }
                          />

                          <div style={{ flex: 1 }}>
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: "0.92rem",
                                textDecoration: isDone ? "line-through" : "none",
                                color: isDone ? "var(--text-muted)" : "var(--text-main)",
                              }}
                            >
                              {t.title}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span className={`badge ${priorityColors[t.priority] || "badge-slate"}`}>
                            {t.priority}
                          </span>
                          <span className="badge badge-slate">{t.hours}h</span>

                          <select
                            className="select"
                            style={{ padding: "4px 8px", fontSize: "0.8rem", width: "110px" }}
                            value={t.status}
                            onChange={(e) =>
                              handleUpdateTask(
                                t.id,
                                { status: e.target.value },
                                `Set status of "${t.title}" to ${e.target.value}`
                              )
                            }
                          >
                            {STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>

                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setEditingTaskId(isEditing ? null : t.id)}
                            title="Edit details, acceptance criteria, or blockers"
                          >
                            {isEditing ? "Close" : "Details"}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteTask(t)}
                            title="Delete task"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* Acceptance Criteria display */}
                      {t.acceptanceCriteria && !isEditing && (
                        <div
                          style={{
                            fontSize: "0.78rem",
                            color: "var(--text-secondary)",
                            paddingLeft: "28px",
                          }}
                        >
                          <strong style={{ color: "var(--text-main)" }}>Acceptance Criteria:</strong>{" "}
                          {t.acceptanceCriteria}
                        </div>
                      )}

                      {/* Blocker alert if present */}
                      {t.blockers && !isEditing && (
                        <div
                          style={{
                            fontSize: "0.78rem",
                            color: "var(--accent-rose)",
                            paddingLeft: "28px",
                            fontWeight: 600,
                          }}
                        >
                          ⚠️ Blocker: {t.blockers}
                        </div>
                      )}

                      {/* Inline Detail & Edit Drawer */}
                      {isEditing && (
                        <div
                          style={{
                            marginTop: "8px",
                            padding: "12px",
                            borderRadius: "var(--radius-sm)",
                            background: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                            <div>
                              <label className="form-hint">Title</label>
                              <input
                                className="input"
                                value={t.title}
                                onChange={(e) => handleUpdateTask(t.id, { title: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="form-hint">Hours</label>
                              <input
                                className="input"
                                type="number"
                                step="0.5"
                                value={t.hours}
                                onChange={(e) => handleUpdateTask(t.id, { hours: Number(e.target.value) || 0.5 })}
                              />
                            </div>
                            <div>
                              <label className="form-hint">Priority</label>
                              <select
                                className="select"
                                value={t.priority}
                                onChange={(e) => handleUpdateTask(t.id, { priority: e.target.value })}
                              >
                                {PRIORITIES.map((pr) => (
                                  <option key={pr} value={pr}>
                                    {pr}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="form-hint">Description / Technical Notes</label>
                            <textarea
                              className="textarea"
                              rows={2}
                              value={t.desc || ""}
                              placeholder="Implementation details, endpoints, or notes..."
                              onChange={(e) => handleUpdateTask(t.id, { desc: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="form-hint">Acceptance Criteria</label>
                            <input
                              className="input"
                              value={t.acceptanceCriteria || ""}
                              placeholder="How do we objectively verify this task is done?"
                              onChange={(e) => handleUpdateTask(t.id, { acceptanceCriteria: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="form-hint" style={{ color: "var(--accent-rose)" }}>
                              Blockers / Impediments (Clear once resolved)
                            </label>
                            <input
                              className="input"
                              style={{ borderColor: t.blockers ? "var(--accent-rose)" : "var(--border)" }}
                              value={t.blockers || ""}
                              placeholder="e.g. Waiting on database connection credentials"
                              onChange={(e) =>
                                handleUpdateTask(t.id, {
                                  blockers: e.target.value,
                                  ...(e.target.value ? { status: "blocked" } : {}),
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
