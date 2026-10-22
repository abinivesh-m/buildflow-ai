import React, { useState } from "react";
import { docs } from "../engine.js";

export default function DemoStudio({ project, onPatch, onNotify }) {
  const [copied, setCopied] = useState(false);
  const [copiedWisprPitch, setCopiedWisprPitch] = useState(false);
  const script = project.demoScript || {};

  const wisprPitch = `# 🎙️ 2-Minute Video Pitch: No Hands Wispr Challenge
Project: ${project.title}
Target Track: Track 1 (Builders - Developers)
Live Production URL: ${project.productionUrl || "https://buildflow-ai-livid.vercel.app/"}

---

## [0:00 - 0:30] 1. The Real Problem in My Work (30% Weight)
"Hi judges! As a developer, the hardest part of building software isn't just writing code — it's the massive friction between having an idea and turning it into an execution plan. I used to spend hours manually typing out functional requirements, user stories, architecture diagrams, and TDR records across 5 different apps. Context switching killed my velocity, and requirements constantly fell out of sync with tasks and tests."

## [0:30 - 1:00] 2. Meaningful Wispr Flow Integration (30% Weight)
"With Wispr Flow, I built BuildFlow AI to eliminate typing from project delivery. By holding my hotkey, I dictate at 251 words per minute—placing in the Top 0.1% of all Wispr Flow users, with over 209,000+ words dictated across our engineering documents and AI prompts. BuildFlow takes that speech and immediately parses it into an 18-point execution blueprint. I dictate new requirements, change impact requests, and architecture decisions completely hands-free — over 6x faster than average typing."

## [1:00 - 1:30] 3. Real Product Walkthrough & Traceability (25% Weight)
"Let me show you the live product:
- First, the Requirements Hub with Acceptance Criteria.
- Next, our core differentiator: the End-to-End Traceability Matrix. Notice every requirement links directly to its implementing tasks, verifying tests, and architectural decisions. If a requirement lacks a test, it's flagged as an untracked gap.
- We have an interactive Kanban board where tasks advance with dependency guards.
- A 5x5 Likelihood x Impact Risk Register with automated severity scoring.
- And automated Mermaid system architecture diagrams."

## [1:30 - 2:00] 4. Proven Execution & Conclusion (15% Weight)
"Everything runs on our verified Vercel production deployment with complete offline-first schema v3 persistence. Zero mocked cards, zero fake buttons. BuildFlow AI turns spoken thoughts into traceable, working software. Thank you to WeMakeDevs and Wispr Flow for the No Hands Challenge!"
`;

  const handleCopyWisprPitch = () => {
    navigator.clipboard.writeText(wisprPitch).then(() => {
      setCopiedWisprPitch(true);
      onNotify("Wispr Challenge 2-min pitch copied!");
      setTimeout(() => setCopiedWisprPitch(false), 3000);
    });
  };

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
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button className="btn btn-secondary btn-sm" onClick={handleCopyWisprPitch}>
            {copiedWisprPitch ? "✓ Copied Wispr Pitch!" : "🎙️ Copy 2-Min Wispr Challenge Pitch"}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleCopyMarkdown}>
            {copied ? "✓ Copied!" : "Copy Script (.md)"}
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleDownload}>
            Download .md
          </button>
        </div>
      </div>

      {/* Submission Pack Card */}
      <div
        className="card"
        style={{
          marginBottom: "20px",
          background: "rgba(16, 185, 129, 0.05)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          padding: "20px 24px",
        }}
      >
        <h3 style={{ fontSize: "1.05rem", color: "var(--accent-emerald)", marginBottom: "12px" }}>
          📦 Submission Pack — Wispr Challenge
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Submission Checklist
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                "Live URL: https://buildflow-ai-livid.vercel.app/",
                "2-min demo video recorded with Wispr screen capture",
                "GitHub repo: github.com/abinivesh-m/buildflow-ai (public)",
                "Submission blurb (right) — copy-paste to form",
              ].map((item, i) => (
                <div key={i} style={{ fontSize: "0.83rem", color: "var(--text-secondary)", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--accent-emerald)", flexShrink: 0 }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Copy-Paste Submission Blurb
            </div>
            <div
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "12px",
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
                lineHeight: "1.55",
                fontFamily: "var(--font-mono)",
                maxHeight: "130px",
                overflowY: "auto",
              }}
            >
              Problem: Developers lose hours bridging the gap between rough ideas and structured execution plans — manually writing requirements, architecture diagrams, and risk registers across 5 disconnected apps. Audience: Indie developers, student teams, and solo engineers who need structure without overhead. Wispr Flow Usage: I dictated every requirement, architectural decision, and risk record at 251 WPM (Top 0.1% globally, 209,000+ words total) — BuildFlow parses spoken project briefs into 18-point engineering blueprints with full traceability matrix, 5×5 risk heatmap, and Mermaid topology. Voice replaced typing for the entire development workflow.
            </div>
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginTop: "8px", width: "100%" }}
              onClick={() => {
                navigator.clipboard.writeText("Problem: Developers lose hours bridging the gap between rough ideas and structured execution plans — manually writing requirements, architecture diagrams, and risk registers across 5 disconnected apps. Audience: Indie developers, student teams, and solo engineers who need structure without overhead. Wispr Flow Usage: I dictated every requirement, architectural decision, and risk record at 251 WPM (Top 0.1% globally, 209,000+ words total) — BuildFlow parses spoken project briefs into 18-point engineering blueprints with full traceability matrix, 5×5 risk heatmap, and Mermaid topology. Voice replaced typing for the entire development workflow.");
                onNotify("Submission blurb copied to clipboard!");
              }}
            >
              📋 Copy Submission Blurb
            </button>
          </div>
        </div>
      </div>

      {/* Executive Pitch Banner Card */}
      <div
        className="card"
        style={{
          marginBottom: "20px",
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
          border: "1px solid var(--accent-purple)",
          padding: "16px 20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="badge badge-purple">Executive Walkthrough</span>
              <span className="badge badge-blue">Wispr Flow Workflow</span>
              <span className="badge badge-green">Production Verified</span>
            </div>
            <h3 style={{ fontSize: "1.05rem", margin: "6px 0 2px" }}>
              Structured 2-Minute Presentation Pitch: Problem · Voice Flow · Traceable Execution · Verified Delivery
            </h3>
            <p className="form-hint" style={{ margin: 0, fontSize: "0.8rem" }}>
              Engineered for high-impact presentations and technical review. Demonstrates meaningful hands-free execution.
            </p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleCopyWisprPitch}>
            📋 Copy 2-Min Script
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
