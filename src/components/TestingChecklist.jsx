import React, { useState } from "react";
import { uid } from "../engine.js";

export default function TestingChecklist({ project, onPatch, onNotify }) {
  const [filterCat, setFilterCat] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState("Core functionality");
  const [newDesc, setNewDesc] = useState("");
  const [isAutomated, setIsAutomated] = useState(false);

  const checklist = project.testChecklist || [];
  const categories = [
    "Core functionality",
    "Input validation",
    "Data persistence",
    "Error handling",
    "Accessibility",
    "Mobile responsiveness",
    "Performance",
    "Security",
    "Deployment verification",
  ];

  const handleToggleStatus = (item) => {
    const nextStatus = item.status === "passed" ? "failed" : item.status === "failed" ? "pending" : "passed";
    const verifiedAt = nextStatus === "passed" ? Date.now() : null;

    onPatch(
      project.id,
      (p) => ({
        ...p,
        testChecklist: (p.testChecklist || []).map((c) =>
          c.id === item.id ? { ...c, status: nextStatus, verifiedAt } : c
        ),
      }),
      `Updated test check "${item.title}" to ${nextStatus}`
    );
  };

  const handleUpdateNotes = (itemId, notes, evidence) => {
    onPatch(
      project.id,
      (p) => ({
        ...p,
        testChecklist: (p.testChecklist || []).map((c) =>
          c.id === itemId ? { ...c, notes, evidence } : c
        ),
      }),
      null
    );
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      onNotify("Title is required.");
      return;
    }

    const newItem = {
      id: uid(),
      category: newCat,
      title: newTitle.trim(),
      description: newDesc.trim() || "Manual verification step.",
      isAutomated,
      status: "pending",
      evidence: "",
      notes: "",
      verifiedAt: null,
    };

    onPatch(
      project.id,
      (p) => ({
        ...p,
        testChecklist: [...(p.testChecklist || []), newItem],
      }),
      `Added test check "${newItem.title}"`
    );

    setNewTitle("");
    setNewDesc("");
    setShowAdd(false);
    onNotify("Test check item added.");
  };

  const filtered = checklist.filter((c) => !filterCat || c.category === filterCat);
  const passedCount = checklist.filter((c) => c.status === "passed").length;
  const failedCount = checklist.filter((c) => c.status === "failed").length;

  return (
    <div>
      <div className="section-head">
        <div>
          <h2 style={{ fontSize: "1.25rem" }}>Testing & Quality Checklist</h2>
          <p className="page-subtitle">
            Verify functional correctness, mobile responsiveness, input validation, and security before shipping.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "Close" : "+ Add Test Check"}
        </button>
      </div>

      {/* Progress & Integrity Alert */}
      <div
        className="card"
        style={{
          padding: "16px 20px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span className="badge badge-green">Passed: {passedCount}</span>
          {failedCount > 0 && <span className="badge badge-rose">Failed: {failedCount}</span>}
          <span className="badge badge-slate">
            Pending: {checklist.length - passedCount - failedCount}
          </span>
        </div>
        <span className="form-hint" style={{ color: "var(--accent-cyan)" }}>
          🛡️ Tests are never auto-passed. Results require deliberate verification.
        </span>
      </div>

      {showAdd && (
        <form className="card" onSubmit={handleAddItem} style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "1.05rem", marginBottom: "12px" }}>Add Verification Check</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <input
              className="input"
              placeholder="Test Title (e.g. Empty form submission rejection)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <select className="select" value={newCat} onChange={(e) => setNewCat(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <textarea
            className="textarea"
            rows={2}
            placeholder="Verification criteria / Expected behavior"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={isAutomated}
                onChange={(e) => setIsAutomated(e.target.checked)}
              />
              Automated Check (Vitest or script-driven)
            </label>
            <button type="submit" className="btn btn-primary btn-sm">
              Save Check
            </button>
          </div>
        </form>
      )}

      {/* Category Filter */}
      <div style={{ marginBottom: "16px" }}>
        <select
          className="select"
          style={{ width: "240px" }}
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
        >
          <option value="">All Categories ({checklist.length})</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Checklist items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map((item) => {
          const statusColors = {
            passed: "badge-green",
            failed: "badge-rose",
            pending: "badge-slate",
          };

          return (
            <div
              key={item.id}
              className="card"
              style={{
                padding: "16px 20px",
                borderLeft: `4px solid ${
                  item.status === "passed"
                    ? "var(--accent-emerald)"
                    : item.status === "failed"
                    ? "var(--accent-rose)"
                    : "var(--border)"
                }`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{item.title}</span>
                    <span className="badge badge-purple">{item.category}</span>
                    {item.isAutomated && <span className="badge badge-blue">Automated</span>}
                    <span className={`badge ${statusColors[item.status]}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className={`btn btn-sm ${
                      item.status === "passed"
                        ? "btn-secondary"
                        : "btn-primary"
                    }`}
                    onClick={() => handleToggleStatus(item)}
                  >
                    {item.status === "passed"
                      ? "Mark Failed"
                      : item.status === "failed"
                      ? "Reset"
                      : "Mark Passed ✓"}
                  </button>
                </div>
              </div>

              {/* Notes & Evidence */}
              <div
                style={{
                  marginTop: "12px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  paddingTop: "10px",
                  borderTop: "1px solid var(--border-subtle)",
                }}
              >
                <div>
                  <label className="form-hint">Evidence / Logs / Test file</label>
                  <input
                    className="input"
                    style={{ fontSize: "0.8rem", padding: "4px 8px" }}
                    placeholder="e.g. src/intake.test.js: line 42"
                    value={item.evidence || ""}
                    onChange={(e) => handleUpdateNotes(item.id, item.notes, e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-hint">Tester Notes</label>
                  <input
                    className="input"
                    style={{ fontSize: "0.8rem", padding: "4px 8px" }}
                    placeholder="Notes or conditions tested..."
                    value={item.notes || ""}
                    onChange={(e) => handleUpdateNotes(item.id, e.target.value, item.evidence)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
