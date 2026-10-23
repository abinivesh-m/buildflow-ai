import React, { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Plus,
  Trash2,
  Search,
  Sparkles,
} from "lucide-react";
import { uid } from "../engine.js";
import VoiceDictateButton from "./VoiceDictateButton.jsx";

const CATEGORIES = ["technical", "schedule", "resource", "scope", "external"];
const STATUSES = ["open", "mitigating", "mitigated", "accepted"];

export default function RiskRegister({ project, onPatch, onAskConfirm, onNotify }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCell, setSelectedCell] = useState(null); // { l, i }
  const [isAdding, setIsAdding] = useState(false);

  // New risk draft
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("technical");
  const [newLikelihood, setNewLikelihood] = useState(3);
  const [newImpact, setNewImpact] = useState(3);
  const [newMitigation, setNewMitigation] = useState("");
  const [newOwner, setNewOwner] = useState("");

  const risks = project.risks || [];

  // Severity calculations
  const totalRisks = risks.length;
  const criticalCount = risks.filter((r) => r.severity >= 15).length;
  const highCount = risks.filter((r) => r.severity >= 10 && r.severity < 15).length;
  const mediumCount = risks.filter((r) => r.severity >= 5 && r.severity < 10).length;
  const lowCount = risks.filter((r) => r.severity < 5).length;
  const mitigatedCount = risks.filter((r) => r.status === "mitigated" || r.status === "accepted").length;

  const handleAddRisk = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const l = Number(newLikelihood) || 3;
    const imp = Number(newImpact) || 3;
    const newRisk = {
      id: uid(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      likelihood: l,
      impact: imp,
      severity: l * imp,
      status: "open",
      mitigation: newMitigation.trim() || "Isolate impact and establish fallback protocol.",
      owner: newOwner.trim() || "Project Lead",
      linkedRequirementIds: [],
      linkedTaskIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    onPatch(
      project.id,
      (p) => ({ ...p, risks: [newRisk, ...(p.risks || [])] }),
      `Added risk: "${newRisk.title}"`
    );

    setNewTitle("");
    setNewDesc("");
    setNewMitigation("");
    setNewOwner("");
    setIsAdding(false);
    onNotify("Risk registered.");
  };

  const handleImportFromPlan = () => {
    const raw = project.plan?.potentialRisks || [];
    if (!raw.length) {
      onNotify("No blueprint risks found.");
      return;
    }

    const imported = raw.map((r) => ({
      id: uid(),
      title: r.risk.length > 60 ? r.risk.slice(0, 57) + "..." : r.risk,
      description: r.risk,
      category: "technical",
      likelihood: 3,
      impact: 4,
      severity: 12,
      status: "mitigating",
      mitigation: r.mitigation,
      owner: "System Architect",
      linkedRequirementIds: [],
      linkedTaskIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));

    onPatch(
      project.id,
      (p) => ({ ...p, risks: [...(p.risks || []), ...imported] }),
      `Imported ${imported.length} risks from blueprint`
    );
    onNotify(`Imported ${imported.length} risks.`);
  };

  const handleDelete = (risk) => {
    onAskConfirm(`Delete risk "${risk.title}"?`, () => {
      onPatch(
        project.id,
        (p) => ({ ...p, risks: (p.risks || []).filter((r) => r.id !== risk.id) }),
        `Deleted risk "${risk.title}"`
      );
      onNotify("Risk removed from register.");
    });
  };

  const handleStatusChange = (id, newStatus) => {
    onPatch(
      project.id,
      (p) => ({
        ...p,
        risks: (p.risks || []).map((r) => (r.id === id ? { ...r, status: newStatus, updatedAt: Date.now() } : r)),
      }),
      `Updated risk status to ${newStatus}`
    );
  };

  // Filtered risks
  const filtered = risks.filter((r) => {
    if (selectedCell) {
      if (r.likelihood !== selectedCell.l || r.impact !== selectedCell.i) return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = r.title.toLowerCase().includes(q) || (r.description || "").toLowerCase().includes(q) || (r.mitigation || "").toLowerCase().includes(q);
      if (!match) return false;
    }
    if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    return true;
  });

  // Cell color helper for heatmap
  const getCellColor = (l, i) => {
    const sev = l * i;
    if (sev >= 15) return "rgba(244, 63, 94, 0.25)"; // Critical red
    if (sev >= 10) return "rgba(245, 158, 11, 0.25)"; // High amber
    if (sev >= 5) return "rgba(234, 179, 8, 0.2)"; // Medium yellow
    return "rgba(16, 185, 129, 0.15)"; // Low green
  };

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
              <ShieldAlert size={22} style={{ color: "var(--accent-rose)" }} />
              <h2 style={{ fontSize: "1.3rem", margin: 0 }}>Project Risk & Blocker Register</h2>
            </div>
            <p className="form-hint" style={{ marginTop: "4px" }}>
              Proactive vulnerability matrix: Evaluate likelihood × impact, establish concrete mitigations, and prevent release bottlenecks.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button className="btn btn-secondary btn-sm" onClick={handleImportFromPlan}>
              <Sparkles size={14} /> Import from Blueprint
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setIsAdding(!isAdding)}>
              <Plus size={14} /> {isAdding ? "Cancel" : "Add Risk Item"}
            </button>
          </div>
        </div>

        {/* Severity Statistics Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
            paddingTop: "14px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ background: "var(--bg-card)", padding: "12px 14px", borderRadius: "var(--radius-sm)" }}>
            <div className="form-hint">Total Identified</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-main)" }}>
              {totalRisks}
            </div>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "12px 14px", borderRadius: "var(--radius-sm)" }}>
            <div className="form-hint">Critical Severity (≥15)</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--accent-rose)" }}>
              {criticalCount}
            </div>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "12px 14px", borderRadius: "var(--radius-sm)" }}>
            <div className="form-hint">High Severity (10–14)</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--accent-amber)" }}>
              {highCount}
            </div>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "12px 14px", borderRadius: "var(--radius-sm)" }}>
            <div className="form-hint">Medium & Low (&lt;10)</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--accent-cyan)" }}>
              {mediumCount + lowCount}
            </div>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "12px 14px", borderRadius: "var(--radius-sm)" }}>
            <div className="form-hint">Mitigated / Closed</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--accent-emerald)" }}>
              {mitigatedCount}
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500, marginLeft: "6px" }}>
                ({totalRisks ? Math.round((mitigatedCount / totalRisks) * 100) : 0}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5x5 Likelihood x Impact Heatmap & Add Form */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "20px", marginBottom: "24px" }}>
        {/* Heatmap Card */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 className="card-title" style={{ margin: 0 }}>Likelihood × Impact Matrix</h3>
            {selectedCell && (
              <button
                className="btn btn-ghost btn-sm"
                style={{ fontSize: "0.72rem" }}
                onClick={() => setSelectedCell(null)}
              >
                Clear Heatmap Filter
              </button>
            )}
          </div>
          <p className="form-hint" style={{ fontSize: "0.78rem", marginBottom: "12px" }}>
            Click any cell to filter risks by coordinate (Y = Likelihood 1-5, X = Impact 1-5).
          </p>

          {/* 5x5 Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {[5, 4, 3, 2, 1].map((l) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "22px", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textAlign: "right" }}>
                  L{l}
                </span>
                <div style={{ display: "flex", gap: "4px", flex: 1 }}>
                  {[1, 2, 3, 4, 5].map((imp) => {
                    const count = risks.filter((r) => r.likelihood === l && r.impact === imp).length;
                    const isSelected = selectedCell && selectedCell.l === l && selectedCell.i === imp;

                    return (
                      <div
                        key={imp}
                        onClick={() => setSelectedCell(isSelected ? null : { l, i: imp })}
                        style={{
                          flex: 1,
                          height: "36px",
                          borderRadius: "4px",
                          background: getCellColor(l, imp),
                          border: isSelected ? "2px solid #fff" : "1px solid var(--border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontWeight: count > 0 ? 800 : 400,
                          fontSize: "0.85rem",
                          color: count > 0 ? "var(--text-main)" : "var(--text-muted)",
                          transition: "all 0.15s ease",
                        }}
                        title={`Likelihood: ${l}, Impact: ${imp} (Severity: ${l * imp}) - ${count} risks`}
                      >
                        {count > 0 ? count : ""}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* X-axis labels */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
              <span style={{ width: "22px" }} />
              <div style={{ display: "flex", gap: "4px", flex: 1 }}>
                {[1, 2, 3, 4, 5].map((imp) => (
                  <div key={imp} style={{ flex: 1, textAlign: "center", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>
                    I{imp}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add Risk Form */}
        {isAdding ? (
          <form className="card" onSubmit={handleAddRisk}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "12px" }}>Register Project Risk</h3>

            <div className="form-group" style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <label className="form-label" style={{ fontSize: "0.78rem", margin: 0 }}>Risk Title</label>
                <VoiceDictateButton
                  currentValue={newTitle}
                  onReplace={(t) => setNewTitle(t)}
                  label="Dictate Risk"
                  sampleFallbackText="Third-party API rate throttling during live evaluation"
                  onNotify={onNotify}
                />
              </div>
              <input
                className="input"
                placeholder="e.g., API Rate Throttling on Production Key"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "10px" }}>
              <label className="form-label" style={{ fontSize: "0.78rem" }}>Impact Context & Cause</label>
              <textarea
                className="textarea"
                rows={2}
                placeholder="What causes this risk and what is the technical impact?"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "10px" }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.78rem" }}>Category</label>
                <select className="select" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.78rem" }}>Likelihood (1–5)</label>
                <select className="select" value={newLikelihood} onChange={(e) => setNewLikelihood(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>{v} - {v === 5 ? "Very Likely" : v === 1 ? "Rare" : "Moderate"}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.78rem" }}>Impact (1–5)</label>
                <select className="select" value={newImpact} onChange={(e) => setNewImpact(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>{v} - {v === 5 ? "Critical" : v === 1 ? "Negligible" : "Moderate"}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "12px" }}>
              <label className="form-label" style={{ fontSize: "0.78rem" }}>Mitigation Strategy</label>
              <input
                className="input"
                placeholder="Specific architectural safeguard or contingency..."
                value={newMitigation}
                onChange={(e) => setNewMitigation(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsAdding(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Add to Register</button>
            </div>
          </form>
        ) : (
          <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "30px 20px" }}>
            <AlertTriangle size={32} style={{ color: "var(--accent-amber)", marginBottom: "10px" }} />
            <h3 style={{ fontSize: "1.05rem", marginBottom: "6px" }}>Explainable Risk Scoring</h3>
            <p className="form-hint" style={{ fontSize: "0.82rem", maxWidth: "380px", marginBottom: "14px" }}>
              Severity = Likelihood × Impact (range 1–25). Any risk scoring ≥15 triggers active release-readiness warnings in the Control Center.
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => setIsAdding(true)}>
              <Plus size={14} /> Register New Risk
            </button>
          </div>
        )}
      </div>

      {/* Filter Row */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            className="input"
            style={{ paddingLeft: "34px", fontSize: "0.85rem" }}
            placeholder="Search risks, mitigations, or owners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select className="select" style={{ fontSize: "0.85rem" }} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>

        <select className="select" style={{ fontSize: "0.85rem" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Risk List Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
            No risks match the active criteria.
          </div>
        ) : (
          filtered.map((risk) => {
            const isCrit = risk.severity >= 15;
            const isHigh = risk.severity >= 10 && risk.severity < 15;

            return (
              <div
                key={risk.id}
                className="card"
                style={{
                  padding: "16px 20px",
                  borderLeft: `4px solid ${
                    isCrit ? "var(--accent-rose)" : isHigh ? "var(--accent-amber)" : "var(--accent-emerald)"
                  }`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.98rem", color: "var(--text-main)" }}>
                        {risk.title}
                      </span>
                      <span
                        className={`badge ${
                          isCrit ? "badge-rose" : isHigh ? "badge-amber" : "badge-green"
                        }`}
                      >
                        Severity: {risk.severity} (L{risk.likelihood} × I{risk.impact})
                      </span>
                      <span className="badge badge-purple">{risk.category}</span>
                      <span className={`badge ${risk.status === "mitigated" ? "badge-green" : "badge-slate"}`}>
                        {risk.status}
                      </span>
                    </div>

                    {risk.description && (
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "6px" }}>
                        {risk.description}
                      </p>
                    )}

                    {/* Mitigation strategy display */}
                    <div
                      style={{
                        marginTop: "10px",
                        padding: "8px 12px",
                        background: "var(--bg-subtle)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.82rem",
                      }}
                    >
                      <strong style={{ color: "var(--accent-emerald)", marginRight: "6px" }}>🛡️ Mitigation:</strong>
                      <span style={{ color: "var(--text-main)" }}>{risk.mitigation}</span>
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <select
                      className="select"
                      style={{ fontSize: "0.78rem", padding: "4px 8px" }}
                      value={risk.status}
                      onChange={(e) => handleStatusChange(risk.id, e.target.value)}
                    >
                      {STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st.charAt(0).toUpperCase() + st.slice(1)}
                        </option>
                      ))}
                    </select>

                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: "4px 8px" }}
                      onClick={() => handleDelete(risk)}
                    >
                      <Trash2 size={14} style={{ color: "var(--accent-rose)" }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
