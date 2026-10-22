import React, { useState } from "react";
import {
  ClipboardList,
  Plus,
  Trash2,
  AlertTriangle,
  FileText,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  Link2,
  TestTube2,
  CheckSquare,
  Sparkles,
} from "lucide-react";
import { uid } from "../engine.js";

const REQ_TYPES = ["functional", "non-functional", "constraint"];
const REQ_PRIORITIES = ["critical", "high", "medium", "low"];
const REQ_STATUSES = ["draft", "proposed", "approved", "implemented", "verified"];

export default function RequirementsManager({ project, onPatch, onAskConfirm, onNotify }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [coverageFilter, setCoverageFilter] = useState("all");
  const [expandedReqs, setExpandedReqs] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  // New requirement draft
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState("functional");
  const [newPriority, setNewPriority] = useState("high");
  const [newCriteriaText, setNewCriteriaText] = useState("");

  const requirements = project.requirements || [];
  const tasks = project.tasks || [];
  const tests = project.testChecklist || [];
  const decisions = project.decisions || [];
  const risks = project.risks || [];

  // Toggle expansion
  const toggleExpand = (id) => {
    setExpandedReqs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Metric computations
  const totalCount = requirements.length;
  const withTasksCount = requirements.filter((r) => (r.linkedTaskIds || []).length > 0).length;
  const withTestsCount = requirements.filter((r) => (r.linkedTestIds || []).length > 0).length;
  const fullyCoveredCount = requirements.filter(
    (r) => (r.linkedTaskIds || []).length > 0 && (r.linkedTestIds || []).length > 0
  ).length;

  const taskCoveragePct = totalCount ? Math.round((withTasksCount / totalCount) * 100) : 0;
  const testCoveragePct = totalCount ? Math.round((withTestsCount / totalCount) * 100) : 0;

  // Add requirement
  const handleAddRequirement = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const criteria = newCriteriaText
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean);

    const newReq = {
      id: uid(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      type: newType,
      priority: newPriority,
      status: "approved",
      acceptanceCriteria: criteria.length > 0 ? criteria : ["Verify baseline execution behavior without errors."],
      linkedTaskIds: [],
      linkedTestIds: [],
      linkedDecisionIds: [],
      linkedRiskIds: [],
      source: "user",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    onPatch(
      project.id,
      (p) => ({
        ...p,
        requirements: [newReq, ...(p.requirements || [])],
      }),
      `Added requirement: "${newReq.title}"`
    );

    setNewTitle("");
    setNewDesc("");
    setNewCriteriaText("");
    setIsAdding(false);
    onNotify("Requirement created.");
  };

  // Import from Plan blueprint
  const handleImportFromPlan = () => {
    const fnReqs = project.plan?.functionalRequirements || [];
    const nonFnReqs = project.plan?.nonFunctionalRequirements || [];

    if (!fnReqs.length && !nonFnReqs.length) {
      onNotify("No blueprint requirements found to import.");
      return;
    }

    const imported = [
      ...fnReqs.map((text) => ({
        id: uid(),
        title: text.length > 60 ? text.slice(0, 57) + "..." : text,
        description: text,
        type: "functional",
        priority: "high",
        status: "approved",
        acceptanceCriteria: ["Meets stated user expectation reliably."],
        linkedTaskIds: [],
        linkedTestIds: [],
        linkedDecisionIds: [],
        linkedRiskIds: [],
        source: "blueprint-import",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })),
      ...nonFnReqs.map((text) => ({
        id: uid(),
        title: text.length > 60 ? text.slice(0, 57) + "..." : text,
        description: text,
        type: "non-functional",
        priority: "medium",
        status: "approved",
        acceptanceCriteria: ["Passes benchmark verification."],
        linkedTaskIds: [],
        linkedTestIds: [],
        linkedDecisionIds: [],
        linkedRiskIds: [],
        source: "blueprint-import",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })),
    ];

    onPatch(
      project.id,
      (p) => ({
        ...p,
        requirements: [...(p.requirements || []), ...imported],
      }),
      `Imported ${imported.length} requirements from plan blueprint`
    );

    onNotify(`Imported ${imported.length} requirements from blueprint.`);
  };

  // Delete requirement
  const handleDelete = (req) => {
    onAskConfirm(`Delete requirement "${req.title}"?`, () => {
      onPatch(
        project.id,
        (p) => ({
          ...p,
          requirements: (p.requirements || []).filter((r) => r.id !== req.id),
        }),
        `Deleted requirement "${req.title}"`
      );
      onNotify("Requirement deleted.");
    });
  };

  // Update status
  const handleStatusChange = (reqId, newStatus) => {
    onPatch(
      project.id,
      (p) => ({
        ...p,
        requirements: (p.requirements || []).map((r) =>
          r.id === reqId ? { ...r, status: newStatus, updatedAt: Date.now() } : r
        ),
      }),
      `Updated requirement status to ${newStatus}`
    );
  };

  // Toggle link item (task or test)
  const handleToggleLink = (reqId, field, itemId) => {
    onPatch(
      project.id,
      (p) => ({
        ...p,
        requirements: (p.requirements || []).map((r) => {
          if (r.id !== reqId) return r;
          const current = r[field] || [];
          const exists = current.includes(itemId);
          const next = exists ? current.filter((x) => x !== itemId) : [...current, itemId];
          return { ...r, [field]: next, updatedAt: Date.now() };
        }),
      }),
      `Updated requirement links`
    );
  };

  // Filtered requirements
  const filtered = requirements.filter((r) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = (r.description || "").toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    if (typeFilter !== "all" && r.type !== typeFilter) return false;
    if (coverageFilter === "missing-tasks" && (r.linkedTaskIds || []).length > 0) return false;
    if (coverageFilter === "missing-tests" && (r.linkedTestIds || []).length > 0) return false;
    if (coverageFilter === "fully-covered") {
      if ((r.linkedTaskIds || []).length === 0 || (r.linkedTestIds || []).length === 0) return false;
    }
    return true;
  });

  return (
    <div>
      {/* Header / Stats Summary Bar */}
      <div
        className="card"
        style={{
          marginBottom: "20px",
          background: "linear-gradient(180deg, var(--bg-card) 0%, var(--bg-subtle) 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ClipboardList size={22} style={{ color: "var(--accent-purple)" }} />
              <h2 style={{ fontSize: "1.3rem", margin: 0 }}>Requirements & Acceptance Criteria</h2>
            </div>
            <p className="form-hint" style={{ marginTop: "4px" }}>
              Explicit traceability hub: Connect specifications directly to implementation tasks, test verifications, and technical decisions.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button className="btn btn-secondary btn-sm" onClick={handleImportFromPlan}>
              <Sparkles size={14} /> Import from Blueprint
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsAdding(!isAdding)}
            >
              <Plus size={14} /> {isAdding ? "Cancel" : "Add Requirement"}
            </button>
          </div>
        </div>

        {/* Coverage Metrics Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
            paddingTop: "12px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ background: "var(--bg-card)", padding: "12px 14px", borderRadius: "var(--radius-sm)" }}>
            <div className="form-hint">Total Defined</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-main)" }}>
              {totalCount}
            </div>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "12px 14px", borderRadius: "var(--radius-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="form-hint">Task Coverage</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: taskCoveragePct === 100 ? "var(--accent-emerald)" : "var(--accent-cyan)" }}>
                {taskCoveragePct}%
              </span>
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)", margin: "2px 0 6px" }}>
              {withTasksCount}/{totalCount} <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>linked</span>
            </div>
            <div className="progress-container" style={{ height: "6px" }}>
              <div className="progress-fill" style={{ width: `${taskCoveragePct}%` }} />
            </div>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "12px 14px", borderRadius: "var(--radius-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="form-hint">Test Coverage</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: testCoveragePct === 100 ? "var(--accent-emerald)" : "var(--accent-amber)" }}>
                {testCoveragePct}%
              </span>
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)", margin: "2px 0 6px" }}>
              {withTestsCount}/{totalCount} <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>verified</span>
            </div>
            <div className="progress-container" style={{ height: "6px" }}>
              <div
                className="progress-fill"
                style={{
                  width: `${testCoveragePct}%`,
                  background: "linear-gradient(90deg, var(--accent-amber), var(--accent-emerald))",
                }}
              />
            </div>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "12px 14px", borderRadius: "var(--radius-sm)" }}>
            <div className="form-hint">Fully Verified End-to-End</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--accent-emerald)" }}>
              {fullyCoveredCount}
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500, marginLeft: "6px" }}>
                ({totalCount ? Math.round((fullyCoveredCount / totalCount) * 100) : 0}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Requirement Form */}
      {isAdding && (
        <form
          className="card"
          onSubmit={handleAddRequirement}
          style={{ marginBottom: "20px", border: "1px solid var(--accent-purple)" }}
        >
          <h3 style={{ fontSize: "1.1rem", marginBottom: "12px" }}>Create New Requirement</h3>

          <div className="form-group">
            <label className="form-label">Requirement Title</label>
            <input
              className="input"
              placeholder="e.g., Automatic Clinical Alert Notification Engine"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description & Business Rationale</label>
            <textarea
              className="textarea"
              rows={2}
              placeholder="Explain the functional need and user impact..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Requirement Type</label>
              <select className="select" value={newType} onChange={(e) => setNewType(e.target.value)}>
                {REQ_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="select" value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
                {REQ_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Acceptance Criteria (one per line)</label>
            <textarea
              className="textarea"
              rows={3}
              placeholder="AC 1: Must trigger within 500ms of threshold breach&#10;AC 2: Sounds audible buzzer on mobile device&#10;AC 3: Logs incident with UTC timestamp"
              value={newCriteriaText}
              onChange={(e) => setNewCriteriaText(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Save Requirement
            </button>
          </div>
        </form>
      )}

      {/* Search & Filters */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            className="input"
            style={{ paddingLeft: "34px", fontSize: "0.85rem" }}
            placeholder="Search requirements or criteria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Filter size={14} style={{ color: "var(--text-muted)" }} />
          <select
            className="select"
            style={{ fontSize: "0.85rem", padding: "6px 10px" }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="functional">Functional</option>
            <option value="non-functional">Non-Functional</option>
            <option value="constraint">Constraint</option>
          </select>

          <select
            className="select"
            style={{ fontSize: "0.85rem", padding: "6px 10px" }}
            value={coverageFilter}
            onChange={(e) => setCoverageFilter(e.target.value)}
          >
            <option value="all">All Coverage</option>
            <option value="missing-tasks">⚠️ Missing Tasks</option>
            <option value="missing-tests">🧪 Missing Tests</option>
            <option value="fully-covered">✅ Fully Covered</option>
          </select>
        </div>
      </div>

      {/* Requirements List */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <FileText size={32} style={{ color: "var(--text-muted)", margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>No Requirements Found</h3>
          <p className="form-hint" style={{ maxWidth: "480px", margin: "0 auto 16px" }}>
            {searchTerm || typeFilter !== "all" || coverageFilter !== "all"
              ? "No requirements match your current filters. Try resetting search parameters."
              : "Requirements connect your initial idea to actionable tasks and test cases."}
          </p>
          <button className="btn btn-primary btn-sm" onClick={() => setIsAdding(true)}>
            <Plus size={14} /> Add First Requirement
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((req) => {
            const isExpanded = !!expandedReqs[req.id];
            const linkedTasks = tasks.filter((t) => (req.linkedTaskIds || []).includes(t.id));
            const linkedTests = tests.filter((tc) => (req.linkedTestIds || []).includes(tc.id));
            const linkedDecisions = decisions.filter((d) => (req.linkedDecisionIds || []).includes(d.id));
            const linkedRisks = risks.filter((rk) => (req.linkedRiskIds || []).includes(rk.id));

            const hasTaskGap = linkedTasks.length === 0;
            const hasTestGap = linkedTests.length === 0;

            return (
              <div
                key={req.id}
                className="card"
                style={{
                  padding: "16px 20px",
                  borderLeft: `4px solid ${
                    req.priority === "critical"
                      ? "var(--accent-rose)"
                      : req.priority === "high"
                      ? "var(--accent-amber)"
                      : "var(--accent-purple)"
                  }`,
                }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "12px",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleExpand(req.id)}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", flex: 1 }}>
                    <div style={{ marginTop: "3px", color: "var(--text-muted)" }}>
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.98rem", color: "var(--text-main)" }}>
                          {req.title}
                        </span>
                        <span
                          className={`badge ${
                            req.type === "functional"
                              ? "badge-purple"
                              : req.type === "non-functional"
                              ? "badge-blue"
                              : "badge-slate"
                          }`}
                        >
                          {req.type}
                        </span>
                        <span
                          className={`badge ${
                            req.priority === "critical"
                              ? "badge-rose"
                              : req.priority === "high"
                              ? "badge-amber"
                              : "badge-slate"
                          }`}
                        >
                          {req.priority}
                        </span>
                        <span
                          className={`badge ${
                            req.status === "verified"
                              ? "badge-green"
                              : req.status === "implemented"
                              ? "badge-blue"
                              : "badge-slate"
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      {req.description && (
                        <p
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--text-secondary)",
                            marginTop: "6px",
                            lineHeight: "1.4",
                          }}
                        >
                          {req.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Badges / Gaps */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexShrink: 0,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {hasTaskGap && (
                      <span
                        className="badge badge-rose"
                        title="No tasks implement this requirement"
                        style={{ display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <AlertTriangle size={11} /> No Tasks
                      </span>
                    )}
                    {hasTestGap && (
                      <span
                        className="badge badge-amber"
                        title="No tests verify this requirement"
                        style={{ display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <TestTube2 size={11} /> No Tests
                      </span>
                    )}
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: "4px 8px" }}
                      onClick={() => handleDelete(req)}
                      title="Delete requirement"
                    >
                      <Trash2 size={14} style={{ color: "var(--accent-rose)" }} />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: "16px",
                      paddingTop: "16px",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    {/* Acceptance Criteria */}
                    <div style={{ marginBottom: "16px" }}>
                      <div className="form-hint" style={{ fontWeight: 600, marginBottom: "8px" }}>
                        Acceptance Criteria:
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {(req.acceptanceCriteria || []).map((crit, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "8px",
                              fontSize: "0.85rem",
                              color: "var(--text-main)",
                            }}
                          >
                            <CheckSquare size={14} style={{ color: "var(--accent-emerald)", marginTop: "2px", flexShrink: 0 }} />
                            <span>{crit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Select */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
                      <span className="form-hint">Lifecycle Status:</span>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {REQ_STATUSES.map((st) => (
                          <button
                            key={st}
                            className={`btn btn-sm ${req.status === st ? "btn-primary" : "btn-secondary"}`}
                            style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                            onClick={() => handleStatusChange(req.id, st)}
                          >
                            {st.charAt(0).toUpperCase() + st.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Traceability Connections Matrix */}
                    <div
                      style={{
                        background: "var(--bg-subtle)",
                        padding: "14px 16px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          color: "var(--text-main)",
                          marginBottom: "10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Link2 size={14} style={{ color: "var(--accent-cyan)" }} />
                        Traceability Connections
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        {/* Tasks Section */}
                        <div>
                          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px" }}>
                            Implementing Tasks ({linkedTasks.length}):
                          </div>
                          {linkedTasks.length === 0 ? (
                            <div className="form-hint" style={{ color: "var(--accent-rose)", fontSize: "0.78rem" }}>
                              ⚠️ Unassigned: No task implements this requirement.
                            </div>
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              {linkedTasks.map((t) => (
                                <div
                                  key={t.id}
                                  style={{
                                    fontSize: "0.8rem",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    background: "var(--bg-card)",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <span>{t.title}</span>
                                  <span className={`badge ${t.status === "done" ? "badge-green" : "badge-slate"}`} style={{ fontSize: "0.68rem" }}>
                                    {t.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Quick link existing task dropdown */}
                          <div style={{ marginTop: "6px" }}>
                            <select
                              className="select"
                              style={{ fontSize: "0.75rem", padding: "4px 8px", width: "100%" }}
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleToggleLink(req.id, "linkedTaskIds", e.target.value);
                                  e.target.value = "";
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="" disabled>+ Link or Unlink Task...</option>
                              {tasks.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {(req.linkedTaskIds || []).includes(t.id) ? "✓ (Linked) " : "+ "}
                                  {t.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Tests Section */}
                        <div>
                          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px" }}>
                            Verifying Tests ({linkedTests.length}):
                          </div>
                          {linkedTests.length === 0 ? (
                            <div className="form-hint" style={{ color: "var(--accent-amber)", fontSize: "0.78rem" }}>
                              ⚠️ Unverified: No test checks this requirement.
                            </div>
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              {linkedTests.map((tc) => (
                                <div
                                  key={tc.id}
                                  style={{
                                    fontSize: "0.8rem",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    background: "var(--bg-card)",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <span>{tc.title}</span>
                                  <span className={`badge ${tc.status === "passed" ? "badge-green" : "badge-amber"}`} style={{ fontSize: "0.68rem" }}>
                                    {tc.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Quick link existing test dropdown */}
                          <div style={{ marginTop: "6px" }}>
                            <select
                              className="select"
                              style={{ fontSize: "0.75rem", padding: "4px 8px", width: "100%" }}
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleToggleLink(req.id, "linkedTestIds", e.target.value);
                                  e.target.value = "";
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="" disabled>+ Link or Unlink Test...</option>
                              {tests.map((tc) => (
                                <option key={tc.id} value={tc.id}>
                                  {(req.linkedTestIds || []).includes(tc.id) ? "✓ (Linked) " : "+ "}
                                  {tc.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Decisions & Risks Related Row */}
                      {(linkedDecisions.length > 0 || linkedRisks.length > 0) && (
                        <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px dashed var(--border)", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                          {linkedDecisions.length > 0 && (
                            <div style={{ fontSize: "0.78rem" }}>
                              <span className="form-hint">Related Decisions: </span>
                              {linkedDecisions.map((d) => (
                                <span key={d.id} className="badge badge-purple" style={{ marginRight: "4px", fontSize: "0.7rem" }}>
                                  🏛️ {d.title}
                                </span>
                              ))}
                            </div>
                          )}
                          {linkedRisks.length > 0 && (
                            <div style={{ fontSize: "0.78rem" }}>
                              <span className="form-hint">Mitigated Risks: </span>
                              {linkedRisks.map((rk) => (
                                <span key={rk.id} className="badge badge-amber" style={{ marginRight: "4px", fontSize: "0.7rem" }}>
                                  🛡️ {rk.title} (Sev: {rk.severity})
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
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
}
