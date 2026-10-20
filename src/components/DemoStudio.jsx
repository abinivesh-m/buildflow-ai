import React, { useState } from "react";
import { docs } from "../engine.js";

export default function DemoStudio({ project, onPatch, onNotify }) {
  const [copied, setCopied] = useState(false);
  const script = project.demoScript || {};

  const handleUpdateScript = (key, val) => {
    onPatch(
      project.id,
      (p) => ({
        ...p,
        demoScript: { ...(p.demoScript || {}), [key]: val },
      }),
      null
    );
  };

  const handleToggleChecklist = (index) => {
    const currentList = Array.isArray(script.checklist) ? [...script.checklist] : [];
    if (currentList[index]) {
      currentList[index].checked = !currentList[index].checked;
      handleUpdateScript("checklist", currentList);
    }
  };

  const handleCopyMarkdown = () => {
    const text = docs.demoScript(project);
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        onNotify("Demo script copied to clipboard as Markdown!");
        setTimeout(() => setCopied(false), 3000);
      },
      () => {
        onNotify("Failed to copy script to clipboard.");
      }
    );
  };

  const handleDownload = () => {
    const text = docs.demoScript(project);
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-demo-script.md`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify("Demo script downloaded.");
  };

  return (
    <div>
      <div className="section-head">
        <div>
          <h2 style={{ fontSize: "1.25rem" }}>Demo & Presentation Studio</h2>
          <p className="page-subtitle">
            Craft a persuasive presentation, live walkthrough narrative, and pre-flight checklist.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-secondary" onClick={handleCopyMarkdown}>
            {copied ? "✓ Copied!" : "Copy Script (Markdown)"}
          </button>
          <button className="btn btn-primary" onClick={handleDownload}>
            Download .md
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        {/* Left Column: Script Editor */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "1.05rem" }}>Presentation Outline</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label className="form-hint">Target Duration (min):</label>
              <input
                className="input"
                type="number"
                min="1"
                max="30"
                style={{ width: "70px", padding: "4px 8px" }}
                value={script.targetDurationMin || 3}
                onChange={(e) => handleUpdateScript("targetDurationMin", Number(e.target.value) || 3)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">1. Problem Hook (30 seconds)</label>
            <textarea
              className="textarea"
              rows={2}
              placeholder="Start with the genuine problem and who suffers from it."
              value={script.problem || ""}
              onChange={(e) => handleUpdateScript("problem", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">2. Target Audience</label>
            <input
              className="input"
              value={script.audience || ""}
              onChange={(e) => handleUpdateScript("audience", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">3. The Proposed Solution</label>
            <textarea
              className="textarea"
              rows={2}
              placeholder="How does your application uniquely solve this problem?"
              value={script.solution || ""}
              onChange={(e) => handleUpdateScript("solution", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">4. Live Walkthrough Narrative</label>
            <textarea
              className="textarea"
              rows={4}
              placeholder="Step-by-step clicks: 1. Land on homepage -> 2. Create project -> 3. View task progress..."
              value={script.liveWalkthrough || ""}
              onChange={(e) => handleUpdateScript("liveWalkthrough", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">5. Stand-Out Capabilities</label>
            <input
              className="input"
              value={script.keyFeatures || ""}
              onChange={(e) => handleUpdateScript("keyFeatures", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">6. Technical Architecture Overview</label>
            <textarea
              className="textarea"
              rows={2}
              value={script.architecture || ""}
              onChange={(e) => handleUpdateScript("architecture", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">7. Testing Evidence & Quality Validation</label>
            <textarea
              className="textarea"
              rows={2}
              value={script.testingEvidence || ""}
              onChange={(e) => handleUpdateScript("testingEvidence", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">8. Limitations & Future Milestones</label>
            <textarea
              className="textarea"
              rows={2}
              placeholder="Be honest about current constraints and your roadmap."
              value={script.limitations || ""}
              onChange={(e) => handleUpdateScript("limitations", e.target.value)}
            />
          </div>
        </div>

        {/* Right Column: Pre-Flight Demo Checklist */}
        <div>
          <div className="card" style={{ marginBottom: "20px" }}>
            <h3 className="card-title">Pre-Flight Demo Checklist</h3>
            <p className="form-hint" style={{ marginBottom: "16px" }}>
              Verify these vital steps before pitching to judges or users.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {(script.checklist || []).map((item, idx) => (
                <label
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "0.86rem",
                    cursor: "pointer",
                    padding: "8px 10px",
                    borderRadius: "var(--radius-sm)",
                    background: item.checked ? "rgba(16, 185, 129, 0.08)" : "var(--bg-subtle)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <input
                    type="checkbox"
                    style={{ width: "16px", height: "16px", accentColor: "var(--accent-emerald)" }}
                    checked={item.checked}
                    onChange={() => handleToggleChecklist(idx)}
                  />
                  <span
                    style={{
                      color: item.checked ? "var(--text-main)" : "var(--text-secondary)",
                      textDecoration: item.checked ? "line-through" : "none",
                    }}
                  >
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div
            className="card"
            style={{
              background: "rgba(245, 158, 11, 0.05)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
            }}
          >
            <h4 style={{ color: "#fbbf24", marginBottom: "6px", fontSize: "0.95rem" }}>
              💡 Presentation Tip
            </h4>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
              Judges value a working, demonstrated core workflow over a dozen half-finished features. Keep your live walkthrough under 2 minutes and prepare backup screenshots in case of network latency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
