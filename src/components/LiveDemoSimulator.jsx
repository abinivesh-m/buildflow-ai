import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function LiveDemoSimulator({ project, onOpenProject }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      stage: "1. IDEA INTAKE",
      title: "Analyzing Problem & Constraints",
      desc: "Parsing user prompt, identifying target audience and technical boundaries.",
      detail: "Detected: 7 days timeline | Framework: React + Vite | Persistence: Dual-tier Relational Store.",
      terminal: [
        "$ buildflow analyze --prompt 'Community Waste Reduction web app'",
        "[ok] Target users identified: Eco-conscious residents",
        "[ok] 18-point engineering blueprint schema compiled in 42ms",
        "[ok] MVP boundaries established: 3 essential workflows defined",
      ],
      progress: 18,
    },
    {
      stage: "2. ARCHITECTURE",
      title: "Generating Technical Decision Records",
      desc: "Selecting relational schema, API endpoints, and evaluating architectural trade-offs.",
      detail: "TDR-001 Logged: Dual-tier local sync with remote PostgreSQL synchronization seams.",
      terminal: [
        "$ buildflow tdr generate --tier standard",
        "[tdr] Accepted: React 19 + Single-page execution interface",
        "[tdr] Accepted: Dual-tier schema with backward-compatible migrations",
        "[data-model] 6 relational tables generated with foreign key constraints",
      ],
      progress: 38,
    },
    {
      stage: "3. ATOMIC BUILD",
      title: "Executing Verified Implementation Tasks",
      desc: "Dependency-guarded task graph enforcing strict sequential completion.",
      detail: "14 atomic tasks scheduled across 3 engineering phases totaling 28 estimated hours.",
      terminal: [
        "$ buildflow tasks verify --dependency-check",
        "[task-1] Define project scope & criteria -> DONE",
        "[task-2] Initialize repository with strict linting -> DONE",
        "[task-3] Build live telemetry workflow interface -> DONE",
        "[task-4] Implement validation and persistence layer -> DONE",
      ],
      progress: 68,
    },
    {
      stage: "4. TEST & AUDIT",
      title: "Automated Suite & Responsive Audit",
      desc: "Executing Vitest tests and validating mobile viewport constraints down to 360px.",
      detail: "18 automated tests passing cleanly. Zero unhandled exceptions or layout breaks.",
      terminal: [
        "$ vitest run --coverage",
        "✓ src/intake.test.js (8 tests passed)",
        "✓ src/workflow.test.js (5 tests passed)",
        "✓ src/engine.test.js (5 tests passed)",
        "[audit] Mobile viewport 360px passed with 0 horizontal overflow",
      ],
      progress: 88,
    },
    {
      stage: "5. DEPLOY & PITCH",
      title: "Live Production Verification",
      desc: "HTTPS production target reached, pre-flight demo checklist verified.",
      detail: "Production release bundle built in 278ms. Live demo script ready for judges.",
      terminal: [
        "$ npm run build",
        "[vite] Built in 278ms: dist/index.html, dist/assets/index.js",
        "[security] 0 committed plaintext secrets verified",
        "[status] PRODUCTION READY - Live demo walkthrough loaded",
      ],
      progress: 100,
    },
  ];

  // Auto-run simulation sequence
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % demoSteps.length;
        if (next === demoSteps.length - 1) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
            });
          } catch (_e) {
            // Ignore confetti in unsupported environments
          }
        }
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying, demoSteps.length]);

  const step = demoSteps[currentStep];

  return (
    <div
      className="card"
      style={{
        border: "1px solid rgba(79, 70, 229, 0.4)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 30px rgba(79, 70, 229, 0.15)",
        overflow: "hidden",
        padding: "0",
        marginBottom: "60px",
      }}
    >
      {/* Top Controller Bar */}
      <div
        style={{
          background: "linear-gradient(90deg, #111422, #171b2d)",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="live-indicator">
            <span className="live-dot" />
            <span>LIVE INTERACTIVE SIMULATION</span>
          </div>
          <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)" }}>
            Real-Time Delivery Engine
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause Simulation" : "Resume Simulation"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setCurrentStep(0)}
            title="Restart Simulation"
          >
            <RotateCcw size={14} />
          </button>
          {project && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onOpenProject(project.id)}
            >
              Open Live Workspace →
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Stage Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr", minHeight: "360px" }}>
        {/* Left Side: Step Progress & Detail */}
        <div
          style={{
            padding: "28px",
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "var(--bg-card)",
          }}
        >
          <div>
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
              {demoSteps.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  style={{
                    flex: 1,
                    height: "5px",
                    borderRadius: "999px",
                    background:
                      idx === currentStep
                        ? "var(--accent-cyan)"
                        : idx < currentStep
                        ? "var(--primary)"
                        : "var(--border)",
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.3s ease",
                  }}
                  title={s.stage}
                />
              ))}
            </div>

            <div style={{ fontSize: "0.8rem", color: "var(--accent-cyan)", fontWeight: 700, letterSpacing: "0.05em" }}>
              STAGE {currentStep + 1} OF {demoSteps.length} — {step.stage}
            </div>

            <h3 style={{ fontSize: "1.45rem", margin: "8px 0 10px", lineHeight: "1.25" }}>
              {step.title}
            </h3>

            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: "1.6", marginBottom: "16px" }}>
              {step.desc}
            </p>

            <div
              style={{
                background: "var(--bg-subtle)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "14px 16px",
                fontSize: "0.85rem",
                color: "var(--text-main)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <CheckCircle2 size={18} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} />
              <span>{step.detail}</span>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "6px" }}>
              <span className="form-hint">Stage Velocity</span>
              <span style={{ fontWeight: 700, color: "var(--accent-emerald)" }}>{step.progress}% Complete</span>
            </div>
            <div className="progress-container">
              <div
                className={`progress-fill ${step.progress === 100 ? "complete" : ""}`}
                style={{ width: `${step.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: High-Tech Terminal Visualizer */}
        <div className="terminal-window" style={{ border: "none", borderRadius: "0" }}>
          <div className="terminal-header">
            <div className="terminal-dots">
              <div className="terminal-dot" style={{ background: "#f43f5e" }} />
              <div className="terminal-dot" style={{ background: "#f59e0b" }} />
              <div className="terminal-dot" style={{ background: "#10b981" }} />
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              buildflow-cli v2.2 (live runtime daemon)
            </span>
            <span className="badge badge-blue" style={{ fontSize: "0.68rem" }}>
              NODE 20 / VITEST
            </span>
          </div>

          <div className="terminal-content">
            <div style={{ color: "var(--text-muted)", marginBottom: "8px" }}>
              // Live reactive telemetry streaming from local project engine...
            </div>
            {step.terminal.map((line, idx) => (
              <div
                key={idx}
                style={{
                  color: line.startsWith("$")
                    ? "var(--accent-cyan)"
                    : line.includes("[ok]") || line.includes("✓") || line.includes("DONE")
                    ? "var(--accent-emerald)"
                    : line.includes("[tdr]")
                    ? "#a78bfa"
                    : "var(--text-main)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.82rem",
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>{line}</span>
              </div>
            ))}
            <div
              style={{
                display: "inline-block",
                width: "8px",
                height: "14px",
                background: "var(--accent-cyan)",
                verticalAlign: "middle",
                animation: "livePulse 1s infinite",
                marginTop: "6px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
