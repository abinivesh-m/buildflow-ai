import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  Search,
  GitBranch,
} from "lucide-react";

export default function TraceabilityMatrix({ project, onPatch, onNotify }) {
  const [filterMode, setFilterMode] = useState("all"); // all, gaps, unverified, complete
  const [search, setSearch] = useState("");

  const requirements = project.requirements || [];
  const tasks = project.tasks || [];
  const tests = project.testChecklist || [];
  const decisions = project.decisions || [];
  const risks = project.risks || [];

  // Coverage statistics
  const totalReqs = requirements.length;
  const withTasks = requirements.filter((r) => (r.linkedTaskIds || []).length > 0).length;
  const withTests = requirements.filter((r) => (r.linkedTestIds || []).length > 0).length;
  const withDecisions = requirements.filter((r) => (r.linkedDecisionIds || []).length > 0).length;
  const fullyTraceable = requirements.filter(
    (r) => (r.linkedTaskIds || []).length > 0 && (r.linkedTestIds || []).length > 0
  ).length;

  const taskPct = totalReqs ? Math.round((withTasks / totalReqs) * 100) : 0;
  const testPct = totalReqs ? Math.round((withTests / totalReqs) * 100) : 0;
  const overallHealthPct = totalReqs ? Math.round((fullyTraceable / totalReqs) * 100) : 0;

  // Orphan identification
  const allLinkedTaskIds = new Set(requirements.flatMap((r) => r.linkedTaskIds || []));
  const orphanTasks = tasks.filter((t) => !allLinkedTaskIds.has(t.id));

  const allLinkedTestIds = new Set(requirements.flatMap((r) => r.linkedTestIds || []));
  const orphanTests = tests.filter((tc) => !allLinkedTestIds.has(tc.id));

  // Smart Auto-Linking Heuristic
  const handleSmartAutoLink = () => {
    let linkedCount = 0;
    const updated = requirements.map((req) => {
      const reqWords = new Set(
        `${req.title} ${req.description || ""}`
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, " ")
          .split(" ")
          .filter((w) => w.length > 3)
      );

      // Find matching tasks by keyword
      const matchedTasks = tasks
        .filter((t) => {
          if ((req.linkedTaskIds || []).includes(t.id)) return false;
          const taskWords = `${t.title} ${t.desc || ""}`.toLowerCase();
          return Array.from(reqWords).some((w) => taskWords.includes(w));
        })
        .map((t) => t.id);

      // Find matching tests by keyword
      const matchedTests = tests
        .filter((tc) => {
          if ((req.linkedTestIds || []).includes(tc.id)) return false;
          const testWords = `${tc.title} ${tc.description || ""}`.toLowerCase();
          return Array.from(reqWords).some((w) => testWords.includes(w));
        })
        .map((tc) => tc.id);

      if (matchedTasks.length > 0 || matchedTests.length > 0) {
        linkedCount += matchedTasks.length + matchedTests.length;
        return {
          ...req,
          linkedTaskIds: [...(req.linkedTaskIds || []), ...matchedTasks],
          linkedTestIds: [...(req.linkedTestIds || []), ...matchedTests],
          updatedAt: Date.now(),
        };
      }
      return req;
    });

    if (linkedCount > 0) {
      onPatch(
        project.id,
        (p) => ({ ...p, requirements: updated }),
        `Auto-linked ${linkedCount} relations via smart semantic heuristic`
      );
      onNotify(`Smart Linker established ${linkedCount} traceability links!`);
    } else {
      onNotify("No additional semantic keyword matches discovered.");
    }
  };

  // Filter rows
  const filtered = requirements.filter((r) => {
    if (search) {
      const q = search.toLowerCase();
      const match = r.title.toLowerCase().includes(q) || (r.description || "").toLowerCase().includes(q);
      if (!match) return false;
    }
    const hasTasks = (r.linkedTaskIds || []).length > 0;
    const hasTests = (r.linkedTestIds || []).length > 0;

    if (filterMode === "gaps") return !hasTasks || !hasTests;
    if (filterMode === "unverified") return hasTasks && !hasTests;
    if (filterMode === "complete") return hasTasks && hasTests;
    return true;
  });

  return (
    <div>
      {/* Header Banner */}
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
              <GitBranch size={22} style={{ color: "var(--accent-cyan)" }} />
              <h2 style={{ fontSize: "1.3rem", margin: 0 }}>End-to-End Traceability Matrix</h2>
            </div>
            <p className="form-hint" style={{ marginTop: "4px" }}>
              Verifiable proof of execution: Every user requirement mapped to its engineering tasks, verification tests, and technical decisions.
            </p>
          </div>

          <button className="btn btn-primary btn-sm" onClick={handleSmartAutoLink}>
            <Sparkles size={14} /> Smart Auto-Linker
          </button>
        </div>

        {/* Coverage Metrics Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
            paddingTop: "14px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ background: "var(--bg-card)", padding: "12px 14px", borderRadius: "var(--radius-sm)" }}>
            <div className="form-hint">Overall Traceability Health</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: overallHealthPct > 75 ? "var(--accent-emerald)" : "var(--accent-cyan)" }}>
              {overallHealthPct}%
            </div>
            <div className="progress-container" style={{ height: "6px", marginTop: "6px" }}>
              <div className="progress-fill" style={{ width: `${overallHealthPct}%` }} />
            </div>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "12px 14px", borderRadius: "var(--radius-sm)" }}>
            <div className="form-hint">Requirement → Task Linkage</div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)" }}>
              {withTasks} of {totalReqs} ({taskPct}%)
            </div>
            <div className="progress-container" style={{ height: "6px", marginTop: "6px" }}>
              <div className="progress-fill" style={{ width: `${taskPct}%` }} />
            </div>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "12px 14px", borderRadius: "var(--radius-sm)" }}>
            <div className="form-hint">Requirement → Test Verification</div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)" }}>
              {withTests} of {totalReqs} ({testPct}%)
            </div>
            <div className="progress-container" style={{ height: "6px", marginTop: "6px" }}>
              <div
                className="progress-fill"
                style={{
                  width: `${testPct}%`,
                  background: "linear-gradient(90deg, var(--accent-amber), var(--accent-emerald))",
                }}
              />
            </div>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "12px 14px", borderRadius: "var(--radius-sm)" }}>
            <div className="form-hint">Architecture Decisions Linked</div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)" }}>
              {withDecisions} of {totalReqs} ({totalReqs ? Math.round((withDecisions / totalReqs) * 100) : 0}%)
            </div>
            <div className="form-hint" style={{ fontSize: "0.72rem", marginTop: "6px" }}>
              {decisions.length} total TDR records active
            </div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
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
            placeholder="Search matrix by requirement name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          <button
            className={`btn btn-sm ${filterMode === "all" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilterMode("all")}
          >
            All Requirements ({totalReqs})
          </button>
          <button
            className={`btn btn-sm ${filterMode === "gaps" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilterMode("gaps")}
          >
            ⚠️ Traceability Gaps ({requirements.filter((r) => !(r.linkedTaskIds || []).length || !(r.linkedTestIds || []).length).length})
          </button>
          <button
            className={`btn btn-sm ${filterMode === "unverified" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilterMode("unverified")}
          >
            🧪 Needs Tests ({requirements.filter((r) => (r.linkedTaskIds || []).length > 0 && !(r.linkedTestIds || []).length).length})
          </button>
          <button
            className={`btn btn-sm ${filterMode === "complete" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilterMode("complete")}
          >
            ✓ Fully Covered ({fullyTraceable})
          </button>
        </div>
      </div>

      {/* Interactive Matrix Table */}
      <div className="card" style={{ padding: "0", overflowX: "auto", marginBottom: "24px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", width: "26%" }}>Requirement</th>
              <th style={{ padding: "12px 16px", textAlign: "left", width: "24%" }}>Implementing Tasks</th>
              <th style={{ padding: "12px 16px", textAlign: "left", width: "22%" }}>Verification Tests</th>
              <th style={{ padding: "12px 16px", textAlign: "left", width: "16%" }}>Architecture Decisions</th>
              <th style={{ padding: "12px 16px", textAlign: "center", width: "12%" }}>Readiness</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
                  No requirements match the active filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((req) => {
                const linkedTasks = tasks.filter((t) => (req.linkedTaskIds || []).includes(t.id));
                const linkedTests = tests.filter((tc) => (req.linkedTestIds || []).includes(tc.id));
                const linkedDecisions = decisions.filter((d) => (req.linkedDecisionIds || []).includes(d.id));

                const tasksDone = linkedTasks.length > 0 && linkedTasks.every((t) => t.status === "done");
                const testsPassed = linkedTests.length > 0 && linkedTests.every((tc) => tc.status === "passed");
                const isComplete = tasksDone && testsPassed;
                const hasGap = linkedTasks.length === 0 || linkedTests.length === 0;

                return (
                  <tr
                    key={req.id}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      transition: "background 0.15s ease",
                    }}
                  >
                    {/* Requirement Column */}
                    <td style={{ padding: "12px 16px", verticalAlign: "top" }}>
                      <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>
                        {req.title}
                      </div>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <span className="badge badge-purple" style={{ fontSize: "0.68rem" }}>
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
                          style={{ fontSize: "0.68rem" }}
                        >
                          {req.priority}
                        </span>
                      </div>
                      {/* Linked Risks indicator */}
                      {(req.linkedRiskIds || []).length > 0 && (
                        <div style={{ marginTop: "6px" }}>
                          {risks
                            .filter((rk) => (req.linkedRiskIds || []).includes(rk.id))
                            .map((rk) => (
                              <span
                                key={rk.id}
                                className={`badge ${rk.severity >= 15 ? "badge-rose" : "badge-amber"}`}
                                style={{ fontSize: "0.65rem", marginRight: "4px" }}
                                title={`Mitigation: ${rk.mitigation}`}
                              >
                                🛡️ {rk.title} (Sev: {rk.severity})
                              </span>
                            ))}
                        </div>
                      )}
                    </td>

                    {/* Implementing Tasks Column */}
                    <td style={{ padding: "12px 16px", verticalAlign: "top" }}>
                      {linkedTasks.length === 0 ? (
                        <span className="badge badge-rose" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <AlertTriangle size={11} /> Implementation Gap
                        </span>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {linkedTasks.map((t) => (
                            <div
                              key={t.id}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "6px",
                                background: "var(--bg-subtle)",
                                padding: "3px 6px",
                                borderRadius: "4px",
                                fontSize: "0.78rem",
                              }}
                            >
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {t.title}
                              </span>
                              <span
                                className={`badge ${
                                  t.status === "done" ? "badge-green" : t.status === "blocked" ? "badge-rose" : "badge-slate"
                                }`}
                                style={{ fontSize: "0.65rem", padding: "1px 5px" }}
                              >
                                {t.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Verification Tests Column */}
                    <td style={{ padding: "12px 16px", verticalAlign: "top" }}>
                      {linkedTests.length === 0 ? (
                        <span className="badge badge-amber" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <AlertTriangle size={11} /> Verification Gap
                        </span>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {linkedTests.map((tc) => (
                            <div
                              key={tc.id}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "6px",
                                background: "var(--bg-subtle)",
                                padding: "3px 6px",
                                borderRadius: "4px",
                                fontSize: "0.78rem",
                              }}
                            >
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {tc.title}
                              </span>
                              <span
                                className={`badge ${tc.status === "passed" ? "badge-green" : "badge-amber"}`}
                                style={{ fontSize: "0.65rem", padding: "1px 5px" }}
                              >
                                {tc.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Architecture Decisions Column */}
                    <td style={{ padding: "12px 16px", verticalAlign: "top" }}>
                      {linkedDecisions.length === 0 ? (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                          Standard Pattern
                        </span>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {linkedDecisions.map((d) => (
                            <div
                              key={d.id}
                              style={{
                                fontSize: "0.78rem",
                                background: "var(--bg-subtle)",
                                padding: "3px 6px",
                                borderRadius: "4px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              🏛️ {d.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Status Column */}
                    <td style={{ padding: "12px 16px", textAlign: "center", verticalAlign: "top" }}>
                      {isComplete ? (
                        <span className="badge badge-green" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <CheckCircle2 size={12} /> Verified
                        </span>
                      ) : hasGap ? (
                        <span className="badge badge-rose" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <AlertOctagon size={12} /> Untracked
                        </span>
                      ) : (
                        <span className="badge badge-blue" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          In Execution
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Gap Analysis & Orphan Detection Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Orphan Tasks */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h3 style={{ fontSize: "0.95rem", margin: 0, color: orphanTasks.length ? "var(--accent-amber)" : "var(--accent-emerald)" }}>
              {orphanTasks.length ? `⚠️ Orphan Tasks (${orphanTasks.length})` : "✓ Zero Orphan Tasks"}
            </h3>
            <span className="form-hint">Tasks without linked requirement</span>
          </div>
          {orphanTasks.length === 0 ? (
            <p className="form-hint" style={{ fontSize: "0.82rem" }}>
              All {tasks.length} tasks are strictly accounted for by approved project requirements.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "160px", overflowY: "auto" }}>
              {orphanTasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    fontSize: "0.8rem",
                    padding: "6px 8px",
                    background: "var(--bg-subtle)",
                    borderRadius: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{t.title}</span>
                  <span className="form-hint" style={{ fontSize: "0.72rem" }}>{t.hours}h</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orphan Tests */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h3 style={{ fontSize: "0.95rem", margin: 0, color: orphanTests.length ? "var(--accent-amber)" : "var(--accent-emerald)" }}>
              {orphanTests.length ? `🧪 Orphan Tests (${orphanTests.length})` : "✓ Zero Orphan Tests"}
            </h3>
            <span className="form-hint">Tests without linked requirement</span>
          </div>
          {orphanTests.length === 0 ? (
            <p className="form-hint" style={{ fontSize: "0.82rem" }}>
              All {tests.length} tests verify explicitly documented user requirements.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "160px", overflowY: "auto" }}>
              {orphanTests.map((tc) => (
                <div
                  key={tc.id}
                  style={{
                    fontSize: "0.8rem",
                    padding: "6px 8px",
                    background: "var(--bg-subtle)",
                    borderRadius: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{tc.title}</span>
                  <span className="badge badge-slate" style={{ fontSize: "0.68rem" }}>{tc.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
