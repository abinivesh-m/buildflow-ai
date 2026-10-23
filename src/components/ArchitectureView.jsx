import React, { useState } from "react";
import {
  Layers,
  Workflow,
  Copy,
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2,
  Database,
  ExternalLink,
} from "lucide-react";
import { uid } from "../engine.js";
import AnimatedTopologyVisualizer from "./AnimatedTopologyVisualizer.jsx";

export default function ArchitectureView({ project, onPatch, onNotify }) {
  const arch = project.architecture || {
    description: project.plan?.architecture || "A modern single-page web client interfacing with REST endpoints.",
    mermaidDiagram: `flowchart TD\n  Client["Client SPA"] --> Gateway["API Gateway"]\n  Gateway --> DB["Database"]`,
    components: [],
  };

  const [description, setDescription] = useState(arch.description || "");
  const [mermaidCode, setMermaidCode] = useState(arch.mermaidDiagram || "");
  const [copied, setCopied] = useState(false);
  const [isEditingComponent, setIsEditingComponent] = useState(false);
  const [newCompName, setNewCompName] = useState("");
  const [newCompTech, setNewCompTech] = useState("");
  const [newCompDesc, setNewCompDesc] = useState("");

  const stack = project.plan?.stack || [];
  const dataModel = project.plan?.dataModel || [];
  const components = arch.components || [];

  const handleSaveDescription = () => {
    onPatch(
      project.id,
      (p) => ({
        ...p,
        architecture: {
          ...p.architecture,
          description: description.trim(),
          mermaidDiagram: mermaidCode.trim(),
        },
      }),
      "Updated system architecture specification"
    );
    onNotify("Architecture description and diagram saved.");
  };

  const handleCopyMermaid = () => {
    navigator.clipboard.writeText(mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    onNotify("Mermaid diagram code copied to clipboard.");
  };

  const handleRegenerateDiagram = () => {
    const fe = stack.find((s) => s.group === "Frontend")?.name || "Frontend Client";
    const be = stack.find((s) => s.group === "Backend")?.name || "Node.js Server";
    const db = stack.find((s) => s.group === "Database")?.name || "PostgreSQL";
    const host = stack.find((s) => s.group === "Deployment")?.name || "Vercel";

    const generated = `flowchart TD
  User["👤 End User / Clinician"] --> Client["🖥️ Client Application\\n(${fe})"]
  Client --> State["💾 Local Client Store\\n(Schema v3 Normalizer)"]
  Client --> API["🌐 REST API Gateway\\n(${be})"]
  API --> Auth["🔒 Session & Token Guard"]
  API --> Engine["⚙️ Execution & Workflow Engine"]
  Engine --> Database["🗄️ Database\\n(${db})"]
  Engine --> CloudInference["🤖 Inference Provider\\n(Gemini 2.5 / Meta AI)"]
  API --> CloudDeploy["🚀 Production Host\\n(${host})"]

  classDef clientStyle fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#fff
  classDef apiStyle fill:#312e81,stroke:#818cf8,stroke-width:2px,color:#fff
  classDef dbStyle fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff
  classDef aiStyle fill:#581c87,stroke:#c084fc,stroke-width:2px,color:#fff

  class Client,State clientStyle
  class API,Auth,Engine apiStyle
  class Database dbStyle
  class CloudInference aiStyle`;

    setMermaidCode(generated);
    onPatch(
      project.id,
      (p) => ({
        ...p,
        architecture: {
          ...p.architecture,
          mermaidDiagram: generated,
        },
      }),
      "Regenerated architecture topology diagram"
    );
    onNotify("Regenerated system architecture diagram.");
  };

  const handleAddComponent = (e) => {
    e.preventDefault();
    if (!newCompName.trim()) return;

    const newComponent = {
      id: uid(),
      name: newCompName.trim(),
      technology: newCompTech.trim() || "Standard Module",
      description: newCompDesc.trim() || "Core system element",
      connections: [],
    };

    onPatch(
      project.id,
      (p) => ({
        ...p,
        architecture: {
          ...p.architecture,
          components: [...(p.architecture?.components || []), newComponent],
        },
      }),
      `Added architecture component: ${newComponent.name}`
    );

    setNewCompName("");
    setNewCompTech("");
    setNewCompDesc("");
    setIsEditingComponent(false);
    onNotify("Component added to topology.");
  };

  const handleDeleteComponent = (id) => {
    onPatch(
      project.id,
      (p) => ({
        ...p,
        architecture: {
          ...p.architecture,
          components: (p.architecture?.components || []).filter((c) => c.id !== id),
        },
      }),
      "Deleted architecture component"
    );
    onNotify("Component deleted.");
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
              <Layers size={22} style={{ color: "var(--accent-purple)" }} />
              <h2 style={{ fontSize: "1.3rem", margin: 0 }}>System Architecture & Topology</h2>
            </div>
            <p className="form-hint" style={{ marginTop: "4px" }}>
              Structural blueprint detailing client components, API boundaries, data pipelines, and third-party AI integrations.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button className="btn btn-secondary btn-sm" onClick={handleRegenerateDiagram}>
              <RefreshCw size={14} /> Regenerate Diagram
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleCopyMermaid}>
              {copied ? <CheckCircle2 size={14} style={{ color: "var(--accent-emerald)" }} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy Mermaid"}
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSaveDescription}>
              Save Architecture
            </button>
          </div>
        </div>

        {/* Technology Stack Pill Row */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", paddingTop: "8px" }}>
          {stack.map((s) => (
            <div
              key={s.id}
              style={{
                background: "var(--bg-card)",
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                fontSize: "0.8rem",
              }}
            >
              <span className="form-hint" style={{ marginRight: "6px" }}>{s.group}:</span>
              <strong style={{ color: "var(--text-main)" }}>{s.name}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Main 2-column Grid: Left = Architecture & Mermaid / Right = Stack & Entities */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "20px" }}>
        <div>
          {/* Architecture Description */}
          <div className="card" style={{ marginBottom: "20px" }}>
            <h3 className="card-title">Architecture Description & Data Flow</h3>
            <div className="form-group" style={{ marginTop: "12px" }}>
              <textarea
                className="textarea"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe how data flows from user actions to backend services and external APIs..."
              />
            </div>
          </div>

          {/* Mermaid Diagram Editor & Preview */}
          <div className="card" style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 className="card-title" style={{ display: "flex", alignItems: "center", gap: "6px", margin: 0 }}>
                <Workflow size={16} style={{ color: "var(--accent-cyan)" }} />
                Mermaid Topology Flowchart
              </h3>
              <a
                href="https://mermaid.live"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: "0.75rem", padding: "2px 8px" }}
              >
                Open Mermaid Live <ExternalLink size={11} style={{ marginLeft: "4px" }} />
              </a>
            </div>

            {/* Mermaid Source Code Editor */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: "0.78rem" }}>Mermaid Source (Editable)</label>
              <textarea
                className="textarea"
                rows={9}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.82rem",
                  lineHeight: "1.4",
                  background: "var(--bg-subtle)",
                }}
                value={mermaidCode}
                onChange={(e) => setMermaidCode(e.target.value)}
              />
            </div>

            {/* Animated Living Component Topology & Data Flow */}
            <AnimatedTopologyVisualizer stack={stack} />
          </div>
        </div>

        {/* Right Column: Component Registry & Data Model Entities */}
        <div>
          {/* Component Registry */}
          <div className="card" style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 className="card-title" style={{ margin: 0 }}>Registered Components</h3>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditingComponent(!isEditingComponent)}
              >
                <Plus size={13} /> Add
              </button>
            </div>

            {isEditingComponent && (
              <form onSubmit={handleAddComponent} style={{ marginBottom: "16px", padding: "12px", background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }}>
                <div className="form-group" style={{ marginBottom: "8px" }}>
                  <input
                    className="input"
                    placeholder="Component Name (e.g., Notification Hub)"
                    value={newCompName}
                    onChange={(e) => setNewCompName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: "8px" }}>
                  <input
                    className="input"
                    placeholder="Technology / Framework"
                    value={newCompTech}
                    onChange={(e) => setNewCompTech(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: "8px" }}>
                  <input
                    className="input"
                    placeholder="Role & Responsibilities"
                    value={newCompDesc}
                    onChange={(e) => setNewCompDesc(e.target.value)}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsEditingComponent(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">Add</button>
                </div>
              </form>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {components.map((comp) => (
                <div
                  key={comp.id}
                  style={{
                    padding: "10px 12px",
                    background: "var(--bg-subtle)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "0.88rem", color: "var(--text-main)" }}>{comp.name}</strong>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: "2px 6px" }}
                      onClick={() => handleDeleteComponent(comp.id)}
                    >
                      <Trash2 size={12} style={{ color: "var(--accent-rose)" }} />
                    </button>
                  </div>
                  <div className="badge badge-slate" style={{ fontSize: "0.7rem", marginTop: "4px" }}>
                    {comp.technology}
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "6px", lineHeight: "1.3" }}>
                    {comp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Data Model Entities */}
          <div className="card">
            <h3 className="card-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Database size={16} style={{ color: "var(--accent-emerald)" }} />
              Entity Schemas & Domain Models
            </h3>
            <p className="form-hint" style={{ marginBottom: "12px" }}>
              Normalized domain structures persisted across application sessions.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {dataModel.map((model, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "8px 12px",
                    background: "var(--bg-subtle)",
                    borderRadius: "var(--radius-sm)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.78rem",
                    color: "var(--text-main)",
                    lineHeight: "1.4",
                    wordBreak: "break-word",
                  }}
                >
                  {model}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
