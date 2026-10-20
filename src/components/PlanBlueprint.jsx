import React from "react";
import { docs } from "../engine.js";

export default function PlanBlueprint({ project, onPatch, onNotify }) {
  const plan = project.plan || {};

  const handleUpdateField = (key, val) => {
    onPatch(
      project.id,
      (p) => ({
        ...p,
        plan: { ...(p.plan || {}), [key]: val },
      }),
      null
    );
  };

  const handleUpdateArray = (key, rawText) => {
    const list = rawText
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
    handleUpdateField(key, list);
  };

  const downloadFile = (name, text, mime = "text/markdown") => {
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
      <div className="section-head">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <h2 style={{ fontSize: "1.25rem" }}>18-Point Engineering Blueprint</h2>
            <span className="badge badge-blue">{plan.generatorSource || "Deterministic Rule Engine"}</span>
          </div>
          <p className="page-subtitle">
            An exhaustive implementation plan covering architecture, scope boundaries, and risk mitigations.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => downloadFile(`${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-blueprint.md`, docs.full(project))}
          >
            Export Blueprint (.md)
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => downloadFile("README.md", docs.readme(project))}
          >
            Export README.md
          </button>
        </div>
      </div>

      {/* Plan Note & Generator Transparency */}
      <div
        className="card"
        style={{
          padding: "16px 20px",
          marginBottom: "24px",
          background: "var(--bg-subtle)",
          borderLeft: "4px solid var(--primary)",
        }}
      >
        <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: 0 }}>
          <strong>Transparency Notice:</strong> {plan.note || "Rule-based generated plan based on provided inputs."}
        </p>
      </div>

      {/* Blueprint Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* 1. Problem Statement */}
        <div className="card">
          <h3 className="card-title">1. Problem Statement</h3>
          <textarea
            className="textarea"
            rows={3}
            value={plan.problem || ""}
            onChange={(e) => handleUpdateField("problem", e.target.value)}
          />
        </div>

        {/* 2. Target Audience */}
        <div className="card">
          <h3 className="card-title">2. Target Audience</h3>
          <textarea
            className="textarea"
            rows={3}
            value={plan.audience || ""}
            onChange={(e) => handleUpdateField("audience", e.target.value)}
          />
        </div>

        {/* 3. User Needs */}
        <div className="card">
          <h3 className="card-title">3. User Needs (One per line)</h3>
          <textarea
            className="textarea"
            rows={4}
            value={Array.isArray(plan.userNeeds) ? plan.userNeeds.join("\n") : ""}
            onChange={(e) => handleUpdateArray("userNeeds", e.target.value)}
          />
        </div>

        {/* 4. Proposed Solution */}
        <div className="card">
          <h3 className="card-title">4. Proposed Solution</h3>
          <textarea
            className="textarea"
            rows={4}
            value={plan.solution || ""}
            onChange={(e) => handleUpdateField("solution", e.target.value)}
          />
        </div>

        {/* 5. MVP Scope */}
        <div className="card">
          <h3 className="card-title" style={{ color: "var(--accent-emerald)" }}>5. MVP Scope Boundaries</h3>
          <textarea
            className="textarea"
            rows={4}
            value={Array.isArray(plan.mvp) ? plan.mvp.join("\n") : ""}
            onChange={(e) => handleUpdateArray("mvp", e.target.value)}
          />
        </div>

        {/* 6. Excluded from MVP */}
        <div className="card">
          <h3 className="card-title" style={{ color: "var(--accent-rose)" }}>6. Excluded from MVP (Non-Goals)</h3>
          <textarea
            className="textarea"
            rows={4}
            value={Array.isArray(plan.excludedFromMvp) ? plan.excludedFromMvp.join("\n") : ""}
            onChange={(e) => handleUpdateArray("excludedFromMvp", e.target.value)}
          />
        </div>

        {/* 7. Functional Requirements */}
        <div className="card">
          <h3 className="card-title">7. Functional Requirements</h3>
          <textarea
            className="textarea"
            rows={4}
            value={Array.isArray(plan.functionalRequirements) ? plan.functionalRequirements.join("\n") : ""}
            onChange={(e) => handleUpdateArray("functionalRequirements", e.target.value)}
          />
        </div>

        {/* 8. Non-Functional Requirements */}
        <div className="card">
          <h3 className="card-title">8. Non-Functional Requirements</h3>
          <textarea
            className="textarea"
            rows={4}
            value={Array.isArray(plan.nonFunctionalRequirements) ? plan.nonFunctionalRequirements.join("\n") : ""}
            onChange={(e) => handleUpdateArray("nonFunctionalRequirements", e.target.value)}
          />
        </div>

        {/* 9. Technical Architecture */}
        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <h3 className="card-title">9. Technical Architecture</h3>
          <textarea
            className="textarea"
            rows={3}
            value={plan.architecture || ""}
            onChange={(e) => handleUpdateField("architecture", e.target.value)}
          />
        </div>

        {/* 10. Data Model Entities */}
        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <h3 className="card-title">10. Relational Data Entities</h3>
          <textarea
            className="textarea"
            rows={4}
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}
            value={Array.isArray(plan.dataModel) ? plan.dataModel.join("\n") : ""}
            onChange={(e) => handleUpdateArray("dataModel", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
