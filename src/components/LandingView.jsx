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
      {/* Hero Section */}
      <section className="landing-hero" style={{ padding: "40px 0 32px" }}>
        <div className="hero-pill" style={{ display: "inline-flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          <Sparkles size={14} style={{ color: "var(--accent-cyan)" }} />
          <span>Built for No Hands: The Wispr Challenge · WeMakeDevs × Wispr Flow</span>
          <span className="badge badge-purple" style={{ fontSize: "0.68rem" }}>Track 1: Builders</span>
        </div>

        <h1 className="hero-title">Turn spoken ideas into software that actually works.</h1>
        <p className="hero-desc">
          Build it, write it, ship it. Just don’t type it. Speak your project concept hands-free with Wispr Flow at 160+ WPM.
          BuildFlow instantly transforms your speech into structured requirements, architecture flowcharts, atomic task graphs,
          and a verified release checklist.
        </p>

        <div className="hero-cta-group">
          <button
            className="btn btn-primary"
            style={{ padding: "14px 28px", fontSize: "1rem" }}
            onClick={onGetStarted}
          >
            <span>Start Planning a Project</span>
            <ArrowRight size={18} />
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: "14px 24px", fontSize: "1rem" }}
            onClick={onDemoProject}
          >
            Preview Sample Project
          </button>
        </div>

        {/* The 6-Stage Execution Stepper */}
        <div className="workflow-stepper" aria-label="BuildFlow Execution Workflow">
          <div className="step-node active">
            <span>1. IDEA</span>
          </div>
          <span className="step-arrow">→</span>
          <div className="step-node active">
            <span>2. PLAN</span>
          </div>
          <span className="step-arrow">→</span>
          <div className="step-node active">
            <span>3. BUILD</span>
          </div>
          <span className="step-arrow">→</span>
          <div className="step-node active">
            <span>4. TEST</span>
          </div>
          <span className="step-arrow">→</span>
          <div className="step-node active">
            <span>5. DEPLOY</span>
          </div>
          <span className="step-arrow">→</span>
          <div className="step-node active">
            <span>6. PRESENT</span>
          </div>
        </div>
      </section>

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
            <h3 style={{ fontSize: "1.1rem" }}>18-Point Planning Blueprint</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.6" }}>
              Receive an exhaustive breakdown covering problem statements, MVP scope,
              explicitly excluded features, non-functional requirements, data models,
              and implementation phases.
            </p>
          </div>

          <div className="landing-feature-card">
            <div
              className="feature-icon-wrapper"
              style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}
            >
              <Sparkles size={22} />
            </div>
            <h3 style={{ fontSize: "1.1rem" }}>Honest Planning Engine</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.6" }}>
              Deterministic local rules generate immediate plans with zero API dependencies.
              If an AI provider is configured, it enriches the plan with transparent source labeling.
            </p>
          </div>

          <div className="landing-feature-card">
            <div
              className="feature-icon-wrapper"
              style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}
            >
              <CheckCircle2 size={22} />
            </div>
            <h3 style={{ fontSize: "1.1rem" }}>Atomic Task Execution</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.6" }}>
              Every task comes equipped with unique IDs, priorities, effort estimates,
              acceptance criteria, and blocker logs. Real progress is derived from completed tasks.
            </p>
          </div>

          <div className="landing-feature-card">
            <div
              className="feature-icon-wrapper"
              style={{ background: "rgba(139, 92, 246, 0.15)", color: "#a78bfa" }}
            >
              <FileCode2 size={22} />
            </div>
            <h3 style={{ fontSize: "1.1rem" }}>Technical Decision Records (TDR)</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.6" }}>
              Capture the context, options considered, chosen option, reasoning, and
              consequences for critical architecture choices. Exportable directly to your repository.
            </p>
          </div>

          <div className="landing-feature-card">
            <div
              className="feature-icon-wrapper"
              style={{ background: "rgba(6, 182, 212, 0.15)", color: "#22d3ee" }}
            >
              <Shield size={22} />
            </div>
            <h3 style={{ fontSize: "1.1rem" }}>Testing & Deployment Readiness</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.6" }}>
              Structured verification checklists for validation, security, responsiveness,
              accessibility, and production URL verification. Real checkmarks, never auto-fabricated.
            </p>
          </div>

          <div className="landing-feature-card">
            <div
              className="feature-icon-wrapper"
              style={{ background: "rgba(244, 63, 94, 0.15)", color: "#fb7185" }}
            >
              <Terminal size={22} />
            </div>
            <h3 style={{ fontSize: "1.1rem" }}>Demo & Presentation Studio</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.6" }}>
              Prepare an airtight presentation with customizable timing, problem hooks, live
              walkthrough scripts, and pre-flight demo day verification checklists.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" style={{ maxWidth: "800px", margin: "0 auto 64px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "28px", fontSize: "1.6rem" }}>
          Frequently Asked Questions
        </h2>
        {faqs.map((f, i) => (
          <div
            key={i}
            className="faq-item"
            style={{ cursor: "pointer", transition: "border-color 0.2s ease" }}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="faq-q">{f.q}</div>
              <span style={{ color: "var(--text-muted)" }}>
                {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </div>
            {openFaq === i && <p className="faq-a" style={{ marginTop: "10px" }}>{f.a}</p>}
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "36px 0 24px",
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
          <strong>BuildFlow</strong> — Turn your ideas into things that work.
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <span>Privacy: Local First (Zero telemetry tracking)</span>
          <span>MIT Open Source</span>
        </div>
      </footer>
    </div>
  );
}
