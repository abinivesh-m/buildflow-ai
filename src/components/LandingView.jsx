import React, { useState } from "react";
import { ArrowRight, Sparkles, CheckCircle2, Shield, Layers, FileCode2, Terminal, ChevronDown, ChevronUp } from "lucide-react";
import LiveDemoSimulator from "./LiveDemoSimulator.jsx";

export default function LandingView({ onGetStarted, onDemoProject, sampleProject }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "What genuine problem does BuildFlow solve?",
      a: "Most developers and students don't fail because they lack ideas—they fail in execution. They underestimate complexity, lack architectural decision tracking, skip validation checks, and rush demos without working workflows. BuildFlow turns raw concepts into an actionable engineering workspace with task graphs, TDR records, and pre-flight checklists.",
    },
    {
      q: "Does BuildFlow work completely offline without paid AI APIs?",
      a: "Yes. BuildFlow has a high-speed, deterministic engineering rule engine built directly into your browser. You get an exhaustive 18-point plan, atomic task tracker, and decision records instantly with zero third-party dependencies. If an optional server-side Gemini key is provided, it enriches the plan with transparent source labeling.",
    },
    {
      q: "Will my project data survive browser reloads?",
      a: "Yes. All projects, tasks, decision records, test results, and settings persist automatically to local storage with schema migration. You can also export backups as JSON or download Markdown & CSV files at any time.",
    },
    {
      q: "How does progress tracking work?",
      a: "Progress is strictly calculated from actual persisted task completions. BuildFlow never fabricates metrics, hardcodes completion percentages, or displays fake dashboard statistics.",
    },
  ];

  return (
    <div className="landing-container">
      {/* Hero Section with Cinematic Living Engineering Blueprint Framing */}
      <div className="cinematic-hero-wrapper">
        <div className="hero-ambient-vignette" />

        <section className="landing-hero" style={{ padding: "48px 24px 36px", position: "relative", zIndex: 2 }}>
          <div className="hero-pill">
            <span className="live-dot" />
            <span>NO HANDS: THE WISPR CHALLENGE · WEMAKEDEVS × WISPR FLOW · TRACK: BUILDERS</span>
          </div>

          <h1 className="hero-title">Say the idea.<br />Make the work <em>clear.</em></h1>
          <p className="hero-desc">
            Turn your spoken project decisions into traceable engineering blueprints your team can review.
            Dictate hands-free at ~150 WPM with Wispr Flow—BuildFlow parses speech into
            end-to-end traceability matrices, system architecture topologies, dependency-aware sprint tickets, and team delivery broadcasts.
          </p>

          <div className="hero-cta-group">
            <button
              className="btn btn-primary"
              style={{ padding: "14px 28px", fontSize: "1rem" }}
              onClick={onGetStarted}
            >
              <span>Start with Your Voice</span>
              <ArrowRight size={18} />
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: "14px 24px", fontSize: "1rem" }}
              onClick={onDemoProject}
            >
              Preview Sample Project ↗
            </button>
          </div>

          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "28px" }}>
            Built with Wispr Flow · Real browser speech engine · Zero API keys required
          </div>

          {/* The 6-Stage Execution Stepper with Illuminated Flow */}
          <div className="workflow-stepper" aria-label="BuildFlow Execution Workflow">
            {[
              { num: "01", label: "BRIEF", active: true },
              { num: "02", label: "REQUIREMENTS", active: true },
              { num: "03", label: "ARCHITECTURE", active: true },
              { num: "04", label: "SPRINT", active: true },
              { num: "05", label: "VERIFICATION", active: true },
              { num: "06", label: "DELIVER", active: true },
            ].map((st, i, arr) => (
              <React.Fragment key={st.num}>
                <div className={`step-node ${st.active ? "active stage-illuminating" : ""}`}>
                  <span className="step-num-pill">{st.num}</span>
                  <span>{st.label}</span>
                  <span className="step-check">✓</span>
                </div>
                {i < arr.length - 1 && (
                  <span className="step-arrow-animated">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>
      </div>

      {/* Live Interactive Simulation Widget */}
      <LiveDemoSimulator project={sampleProject} onOpenProject={onDemoProject} />

      {/* Feature Value Grid */}
      <section style={{ marginBottom: "64px" }}>
        <div className="section-head" style={{ justifyContent: "center", textAlign: "center", marginBottom: "32px" }}>
          <div>
            <h2 style={{ fontSize: "1.75rem" }}>Engineered for execution over vanity dashboards</h2>
            <p className="form-hint" style={{ fontSize: "0.95rem", marginTop: "6px" }}>
              Every feature solves a genuine pain point encountered when developing software.
            </p>
          </div>
        </div>

        <div className="landing-grid">
          <div className="landing-feature-card">
            <div
              className="feature-icon-wrapper"
              style={{ background: "rgba(79, 70, 229, 0.15)", color: "#818cf8" }}
            >
              <Layers size={22} />
            </div>
            <h3>18-Point Planning Blueprint</h3>
            <p>
              Receive an exhaustive breakdown covering problem statements, MVP scope,
              explicitly excluded features, non-functional requirements, data models,
              and implementation phases.
            </p>
          </div>

          <div className="landing-feature-card">
            <div
              className="feature-icon-wrapper"
              style={{ background: "rgba(6, 182, 212, 0.15)", color: "#22d3ee" }}
            >
              <Sparkles size={22} />
            </div>
            <h3>End-to-End Traceability Matrix</h3>
            <p>
              Our core differentiator: bidirectional links connecting Requirements ↔ Tasks ↔ Tests ↔ TDRs ↔ Risks.
              Instantly discover unverified gaps and orphan tasks.
            </p>
          </div>

          <div className="landing-feature-card">
            <div
              className="feature-icon-wrapper"
              style={{ background: "rgba(139, 92, 246, 0.15)", color: "#a78bfa" }}
            >
              <Terminal size={22} />
            </div>
            <h3>Voice-to-Spec (Wispr Flow Native)</h3>
            <p>
              Speak your ideas at ~150 WPM average. Local deterministic NLP extracts project scope,
              tech stack, and timelines without sending private text to external servers.
            </p>
          </div>

          <div className="landing-feature-card">
            <div
              className="feature-icon-wrapper"
              style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}
            >
              <CheckCircle2 size={22} />
            </div>
            <h3>Interactive Kanban & Task Execution</h3>
            <p>
              Dual view: Kanban Board and Phase Lists. Real progress is strictly derived
              from completed tasks with dependency-guarded completion controls.
            </p>
          </div>

          <div className="landing-feature-card">
            <div
              className="feature-icon-wrapper"
              style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}
            >
              <FileCode2 size={22} />
            </div>
            <h3>Technical Decision Records (TDR)</h3>
            <p>
              Capture the context, options considered, chosen option, reasoning, and
              consequences for critical architecture choices. Exportable directly to Git Markdown.
            </p>
          </div>

          <div className="landing-feature-card">
            <div
              className="feature-icon-wrapper"
              style={{ background: "rgba(244, 63, 94, 0.15)", color: "#fb7185" }}
            >
              <Shield size={22} />
            </div>
            <h3>5×5 Risk Heatmap & Mermaid Topology</h3>
            <p>
              Explainable severity scoring with an interactive coordinate heatmap matrix,
              paired with auto-generated Mermaid system architecture diagrams.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Frequently Asked Questions</h2>
          <p className="form-hint" style={{ marginTop: "6px" }}>
            Clear answers to architectural, persistence, and execution questions.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {faqs.map((f, i) => (
            <div
              key={i}
              className="faq-item"
              onClick={() => toggleFaq(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleFaq(i);
                }
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                <div className="faq-q">{f.q}</div>
                <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                  {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </div>
              {openFaq === i && <p className="faq-a">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "40px 0 32px",
          marginTop: "60px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          fontSize: "0.85rem",
          color: "var(--text-muted)",
        }}
      >
        <div>
          <strong>BuildFlow</strong> — Turn your ideas into things that actually work.
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <span>Privacy: Local First (Zero telemetry tracking)</span>
          <span>MIT Open Source</span>
        </div>
      </footer>
    </div>
  );
}
