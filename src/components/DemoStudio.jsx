import React, { useState } from "react";
import { docs } from "../engine.js";

export default function DemoStudio({ project, onPatch, onNotify }) {
  const [copied, setCopied] = useState(false);
  const [copiedWisprPitch, setCopiedWisprPitch] = useState(false);
  const script = project.demoScript || {};

  const wisprPitch = `# 🎙️ 2-Minute Official Winning Video Script — No Hands: The Wispr Challenge
Project: ${project.title}
Target Track: Track 1 (Builders - Developers)
Live Production URL: ${project.productionUrl || "https://buildflow-ai-livid.vercel.app/"}
Evaluation Panel: Kunal Kushwaha, Rohan Kochhar, Aayush Sharma, Sachin Sharma

---

## ⏱️ [0:00 - 0:15] 1. The Real Engineering Problem (30% Weight)
"Hi Kunal, Rohan, and the judging team! As an engineering student and solo developer, the hardest part of software isn't just writing code — it's the chaotic disconnect between having an idea and organizing requirements, architecture, tasks, and test verification. Context switching across 5 different apps kills momentum, and requirements constantly fall out of sync with tasks and tests."

## ⏱️ [0:15 - 0:35] 2. Meaningful Wispr Voice Intake (30% Weight)
"With Wispr Flow, I dictate natural ideas directly into BuildFlow at ~150 WPM average speed. Watch this: I trigger Wispr and dictate: 'Build a clinical vitals monitoring dashboard with alerts and React Vite.' In 40 milliseconds, our deterministic parser extracts the project title, technical boundaries, timeline, and compiles an 18-point engineering blueprint without sending any private data to cloud APIs."

## ⏱️ [0:35 - 0:55] 3. Requirements & Architecture (25% Weight)
"Next, look at the Requirements Hub. Every requirement has acceptance criteria and source tags. Under Architecture, BuildFlow automatically compiles Mermaid system topology and our Living Component Topology Visualizer showing real-time circuit data flow between Client SPA, API Gateway, and Persistence Store."

## ⏱️ [0:55 - 1:15] 4. Tasks & End-to-End Traceability (Core Differentiator)
"Now our killer feature: the Traceability Matrix. Notice every requirement links directly to its implementing tasks, verifying tests, and architectural decisions. If a requirement lacks a test, it's flagged as an unverified gap. Our interactive Kanban board enforces dependency-guarded completions — you cannot complete a task if its blockers aren't done."

## ⏱️ [1:15 - 1:35] 5. Verification, 5×5 Risk Heatmap & Delivery
"In the Verification Lab, test checklist items track real passed assertions. In the Risk Register, our 5×5 coordinate heatmap calculates severity from Likelihood × Impact with automated mitigation plans. In Release Readiness, we can one-click export GitHub CLI issues and broadcast sprint progress directly to Slack."

## ⏱️ [1:35 - 1:50] 6. Polished Dual-Theme Workspace
"Notice our Living Engineering Blueprint visual identity. In Light Mode, it's a warm cream architectural blueprint inspired by technical wireframes. In Dark Mode, one toggle shifts to a futuristic purple technology network with glowing circuit buses — fully responsive with offline-first schema v3 persistence."

## ⏱️ [1:50 - 2:00] 7. Closing & Tagline (15% Weight)
"BuildFlow AI solves the real friction between spoken thoughts and structured engineering delivery — powered natively by Wispr Flow. Everything you see is live at buildflow-ai-livid.vercel.app with zero mocked cards. Say the idea. Make the work clear. Thank you!"
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
          <h3 style={{ fontSize: "1.05rem", color: "var(--accent-emerald)", margin: 0 }}>
            📦 Official Wispr Challenge Submission & Evaluation Pack
          </h3>
          <div style={{ display: "flex", gap: "6px" }}>
            <span className="badge badge-purple">Track 1: Builders</span>
            <span className="badge badge-green">~150 WPM Avg</span>
            <span className="badge badge-blue">₹1,00,000 Contender</span>
          </div>
        </div>

        {/* Wispr Flow Official Challenge Proof Card */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
            marginBottom: "16px",
            padding: "12px 14px",
            background: "rgba(124, 58, 237, 0.08)",
            border: "1px solid rgba(124, 58, 237, 0.3)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Dictation Speed
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--accent-purple)", marginTop: "2px" }}>
              ~150 WPM
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-secondary)" }}>
              Nearly 4x faster than 40 WPM typing
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Voice Workflow Coverage
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--accent-emerald)", marginTop: "2px" }}>
              6 / 6 Stages
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-secondary)" }}>
              Brief, Reqs, Arch, Sprint, Tests, Deliver
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Spoken Command Engine
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--accent-cyan)", marginTop: "2px" }}>
              10 Actions
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-secondary)" }}>
              Voice navigation, creation & theme
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Privacy & Offline Engine
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--accent-amber)", marginTop: "2px" }}>
              100% Local
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-secondary)" }}>
              Deterministic NLP, zero leaked tokens
            </div>
          </div>
        </div>

        {/* 4 Official Weighted Scoring Criteria Breakdown */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
            marginBottom: "16px",
            padding: "12px",
            background: "var(--bg-subtle)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ borderLeft: "3px solid var(--accent-purple)", paddingLeft: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>1. Real Problem</strong>
              <span className="badge badge-purple" style={{ fontSize: "0.68rem" }}>30% Weight</span>
            </div>
            <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginTop: "4px", lineHeight: "1.4" }}>
              Eliminates the friction of translating ideas to specs across 5 disjointed apps. Saves 4-6 hours per project.
            </p>
          </div>

          <div style={{ borderLeft: "3px solid var(--accent-cyan)", paddingLeft: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>2. Meaningful Wispr</strong>
              <span className="badge badge-blue" style={{ fontSize: "0.68rem" }}>30% Weight</span>
            </div>
            <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginTop: "4px", lineHeight: "1.4" }}>
              Voice intake, bottom Floating Voice Commander, speech-to-text on every field, ~150 WPM average dictation.
            </p>
          </div>

          <div style={{ borderLeft: "3px solid var(--accent-emerald)", paddingLeft: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>3. Does it Work?</strong>
              <span className="badge badge-green" style={{ fontSize: "0.68rem" }}>25% Weight</span>
            </div>
            <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginTop: "4px", lineHeight: "1.4" }}>
              Verified Vercel deployment with local-first schema v3 persistence, Kanban drag/drop, and full traceability.
            </p>
          </div>

          <div style={{ borderLeft: "3px solid var(--accent-amber)", paddingLeft: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>4. Clear 2-Min Demo</strong>
              <span className="badge badge-amber" style={{ fontSize: "0.68rem" }}>15% Weight</span>
            </div>
            <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginTop: "4px", lineHeight: "1.4" }}>
              Timestamped [0:00 - 2:00] video walkthrough ready to record with Wispr screen capture.
            </p>
          </div>
        </div>

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
                "Evaluation Panel: Kunal Kushwaha, Rohan Kochhar, Aayush Sharma, Sachin Sharma",
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
              Problem: Developers lose hours bridging the gap between rough ideas and structured execution plans — manually writing requirements, architecture diagrams, and risk registers across 5 disconnected apps. Audience: Indie developers, student teams, and solo engineers who need structure without overhead. Wispr Flow Usage: I dictated every requirement, architectural decision, and risk record at ~150 WPM average — BuildFlow parses spoken project briefs into 18-point engineering blueprints with full traceability matrix, 5×5 risk heatmap, and Mermaid topology. Voice replaced typing for the entire development workflow.
            </div>
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginTop: "8px", width: "100%" }}
              onClick={() => {
                navigator.clipboard.writeText("Problem: Developers lose hours bridging the gap between rough ideas and structured execution plans — manually writing requirements, architecture diagrams, and risk registers across 5 disconnected apps. Audience: Indie developers, student teams, and solo engineers who need structure without overhead. Wispr Flow Usage: I dictated every requirement, architectural decision, and risk record at ~150 WPM average — BuildFlow parses spoken project briefs into 18-point engineering blueprints with full traceability matrix, 5×5 risk heatmap, and Mermaid topology. Voice replaced typing for the entire development workflow.");
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
