import React, { useState } from "react";
import { uid } from "../engine.js";
import VoiceDictateButton from "./VoiceDictateButton.jsx";

export default function DecisionsManager({ project, onPatch, onAskConfirm, onNotify }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContext, setNewContext] = useState("");
  const [newOptions, setNewOptions] = useState("");
  const [newChosen, setNewChosen] = useState("");
  const [newReasoning, setNewReasoning] = useState("");
  const [newConsequences, setNewConsequences] = useState("");

  const decisions = project.decisions || [];

  const handleAddDecision = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newChosen.trim()) {
      onNotify("Title and Chosen Option are required.");
      return;
    }

    const tdr = {
      id: uid(),
      title: newTitle.trim(),
      context: newContext.trim() || "No context provided.",
      optionsConsidered: newOptions.trim() || "Single candidate evaluated.",
      chosenOption: newChosen.trim(),
      reasoning: newReasoning.trim() || "Aligned with MVP constraints.",
      consequences: newConsequences.trim() || "Standard operational trade-offs.",
      status: "accepted",
      createdAt: Date.now(),
    };

    onPatch(
      project.id,
      (p) => ({ ...p, decisions: [tdr, ...(p.decisions || [])] }),
      `Recorded technical decision: "${tdr.title}"`
    );

    setNewTitle("");
    setNewContext("");
    setNewOptions("");
    setNewChosen("");
    setNewReasoning("");
    setNewConsequences("");
    setShowAdd(false);
    onNotify("Technical decision recorded.");
  };

  const handleUpdateStatus = (decisionId, status) => {
    onPatch(
      project.id,
      (p) => ({
        ...p,
        decisions: (p.decisions || []).map((d) => (d.id === decisionId ? { ...d, status } : d)),
      }),
      `Updated decision status to ${status}`
    );
  };

  const handleDelete = (decision) => {
    onAskConfirm(`Delete decision record "${decision.title}"?`, () => {
      onPatch(
        project.id,
        (p) => ({
          ...p,
          decisions: (p.decisions || []).filter((d) => d.id !== decision.id),
        }),
        `Deleted decision record "${decision.title}"`
      );
      onNotify("Decision record removed.");
    });
  };

  return (
    <div>
      <div className="section-head">
        <div>
          <h2 style={{ fontSize: "1.25rem" }}>Technical Decision Records (TDR)</h2>
          <p className="page-subtitle">
            Document architectural trade-offs, chosen technologies, and long-term consequences.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "Close Form" : "+ Record New Decision"}
        </button>
      </div>

      {showAdd && (
        <form className="card" onSubmit={handleAddDecision} style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
            <h3 style={{ fontSize: "1.05rem", margin: 0 }}>New Technical Decision</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <VoiceDictateButton
                currentValue={newTitle}
                onReplace={(t) => setNewTitle(t)}
                label="Dictate Title"
                sampleFallbackText="Adopt React 19 Client SPA Architecture"
                onNotify={onNotify}
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: "0.76rem" }}
                onClick={() => {
                  setNewTitle("Adopt React 19 Client SPA Architecture");
                  setNewContext("We need an interactive workspace with instant local state responsiveness and zero page reloads.");
                  setNewOptions("React 19 SPA, Next.js App Router, SvelteKit");
                  setNewChosen("React 19 Single Page Application");
                  setNewReasoning("Enables instant local persistence with 0ms network latency for state updates and rich component lifecycle control.");
                  setNewConsequences("Client bundle must remain lean to load quickly on low-bandwidth mobile connections.");
                  onNotify("🎙️ Populated architectural decision from speech template.");
                }}
              >
                🎙️ Sample Speech
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Decision Title *</label>
            <input
              className="input"
              placeholder="e.g. Use PostgreSQL instead of MongoDB"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Context / Problem Statement</label>
            <textarea
              className="textarea"
              rows={2}
              placeholder="What situation forced this decision?"
              value={newContext}
              onChange={(e) => setNewContext(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Options Considered</label>
              <input
                className="input"
                placeholder="e.g. PostgreSQL, SQLite, DynamoDB"
                value={newOptions}
                onChange={(e) => setNewOptions(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Chosen Option *</label>
              <input
                className="input"
                placeholder="e.g. PostgreSQL"
                value={newChosen}
                onChange={(e) => setNewChosen(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reasoning / Justification</label>
            <textarea
              className="textarea"
              rows={2}
              placeholder="Why was this option chosen over the alternatives?"
              value={newReasoning}
              onChange={(e) => setNewReasoning(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Consequences / Trade-offs</label>
            <textarea
              className="textarea"
              rows={2}
              placeholder="What negative impacts or maintenance overhead must we accept?"
              value={newConsequences}
              onChange={(e) => setNewConsequences(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Decision Record
            </button>
          </div>
        </form>
      )}

      {decisions.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <p className="form-hint">No technical decisions recorded yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {decisions.map((d) => (
            <div key={d.id} className="card" style={{ padding: "20px" }}>
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
                    <h3 style={{ fontSize: "1.1rem" }}>{d.title}</h3>
                    <span
                      className={`badge ${
                        d.status === "accepted"
                          ? "badge-green"
                          : d.status === "deprecated"
                          ? "badge-rose"
                          : "badge-amber"
                      }`}
                    >
                      {d.status}
                    </span>
                    <span className="form-hint">
                      {new Date(d.createdAt).toISOString().slice(0, 10)}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="select"
                    style={{ padding: "4px 8px", fontSize: "0.8rem", width: "130px" }}
                    value={d.status}
                    onChange={(e) => handleUpdateStatus(d.id, e.target.value)}
                  >
                    <option value="proposed">Proposed</option>
                    <option value="accepted">Accepted</option>
                    <option value="deprecated">Deprecated</option>
                    <option value="superseded">Superseded</option>
                  </select>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d)}>
                    Delete
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginTop: "16px",
                  fontSize: "0.88rem",
                }}
              >
                <div style={{ background: "var(--bg-subtle)", padding: "12px", borderRadius: "var(--radius-sm)" }}>
                  <strong style={{ color: "var(--text-main)" }}>Context:</strong>
                  <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>{d.context}</p>
                </div>

                <div style={{ background: "var(--bg-subtle)", padding: "12px", borderRadius: "var(--radius-sm)" }}>
                  <strong style={{ color: "var(--text-main)" }}>Chosen Option:</strong>
                  <p style={{ color: "var(--accent-emerald)", fontWeight: 600, marginTop: "4px" }}>
                    {d.chosenOption}
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                    Alternatives considered: {d.optionsConsidered}
                  </p>
                </div>

                <div style={{ background: "var(--bg-subtle)", padding: "12px", borderRadius: "var(--radius-sm)" }}>
                  <strong style={{ color: "var(--text-main)" }}>Reasoning:</strong>
                  <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>{d.reasoning}</p>
                </div>

                <div style={{ background: "var(--bg-subtle)", padding: "12px", borderRadius: "var(--radius-sm)" }}>
                  <strong style={{ color: "var(--text-main)" }}>Consequences & Risks:</strong>
                  <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>{d.consequences}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
