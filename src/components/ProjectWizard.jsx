import React, { useState } from "react";
import { CATEGORIES, LEVELS } from "../engine.js";
import { parseIntake } from "../intake.js";

const STEPS = ["Describe Idea", "Technical Constraints", "Review & Generate"];

export default function ProjectWizard({ onCreate, onCancel }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "",
    idea: "",
    problem: "",
    audience: "",
    category: "",
    level: "beginner",
    time: "7",
    unit: "days",
    teamSize: "1",
    languages: "",
    skills: "",
    framework: "",
    constraints: "",
    goals: "",
    deadline: "",
  });

  const [naturalText, setNaturalText] = useState("");
  const [intakeResult, setIntakeResult] = useState(null);
  const [intakeError, setIntakeError] = useState("");
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [useAiIfAvailable, setUseAiIfAvailable] = useState(false);

  const updateField = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleExtractIntake = () => {
    const res = parseIntake(naturalText);
    if (res.error) {
      setIntakeError(res.error);
      setIntakeResult(null);
      return;
    }
    setIntakeError("");
    setIntakeResult(res);
    setForm((prev) => ({
      ...prev,
      idea: naturalText.trim(),
      ...(res.values.title && { title: res.values.title }),
      ...(res.values.category && { category: res.values.category }),
      ...(res.values.time && { time: String(res.values.time), unit: res.values.unit || prev.unit }),
      ...(res.values.level && { level: res.values.level }),
      ...(res.values.languages && { languages: res.values.languages, skills: res.values.languages }),
    }));
  };

  const validateStep = (s) => {
    const errs = {};
    if (s >= 0) {
      if (!form.title.trim()) errs.title = "Project title is required.";
      if (form.idea.trim().length < 20) {
        errs.idea = "Please provide an idea description of at least 20 characters.";
      }
      if (!form.category) errs.category = "Please select a project category.";
    }
    if (s >= 1) {
      const numTime = Number(form.time);
      if (isNaN(numTime) || numTime <= 0) {
        errs.time = "Enter a valid positive number for duration.";
      }
      if (!form.languages.trim() && !form.skills.trim()) {
        errs.skills = "Specify at least one primary programming language or skill.";
      }
    }
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allErrors = validateStep(2);
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) {
      if (allErrors.title || allErrors.idea || allErrors.category) {
        setStep(0);
      } else {
        setStep(1);
      }
      return;
    }

    setIsGenerating(true);
    try {
      await onCreate({
        ...form,
        title: form.title.trim(),
        idea: form.idea.trim(),
        useAiIfAvailable,
      });
    } catch (err) {
      setErrors({
        submit: `Plan creation failed: ${err.message || "Unknown error"}. You can retry or switch options.`,
      });
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="section-head">
        <div>
          <h1 className="page-title">Create New Project</h1>
          <p className="page-subtitle">
            Turn your raw concept into a structured, production-ready engineering workspace.
          </p>
        </div>
        {onCancel && (
          <button className="btn btn-ghost" onClick={onCancel} type="button">
            Cancel
          </button>
        )}
      </div>

      {/* Progress Steps */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
        role="tablist"
      >
        {STEPS.map((sName, idx) => (
          <div
            key={sName}
            style={{
              padding: "8px 16px",
              borderRadius: "999px",
              fontSize: "0.85rem",
              fontWeight: 600,
              background:
                idx === step
                  ? "var(--primary)"
                  : idx < step
                  ? "rgba(37, 99, 235, 0.15)"
                  : "var(--bg-card)",
              color:
                idx === step
                  ? "#fff"
                  : idx < step
                  ? "#60a5fa"
                  : "var(--text-muted)",
              border: "1px solid var(--border)",
            }}
          >
            {idx + 1}. {sName}
          </div>
        ))}
      </div>

      <form className="card" onSubmit={handleSubmit} noValidate>
        {/* Step 1: Idea and Problem */}
        {step === 0 && (
          <div>
            {/* Natural Language / Voice Dictation Box */}
            <div
              style={{
                backgroundColor: "var(--bg-subtle)",
                border: "1px solid var(--accent-purple)",
                borderRadius: "var(--radius-md)",
                padding: "20px",
                marginBottom: "24px",
                background: "linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, var(--bg-subtle) 100%)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                <div className="form-label" style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>🎙️ Voice Dictation · Wispr Flow Optimized</span>
                  <span className="badge badge-purple">Speech-to-Spec</span>
                  <span className="badge badge-blue">Deterministic NLP</span>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: "0.72rem", padding: "2px 8px" }}
                    onClick={() => {
                      const sample = "I want to build HealthTrack AI for resident doctors and medical students. It parses vitals, triggers critical threshold alerts, and exports handover summaries. We are 2 developers using TypeScript, React, and FastAPI over 7 days.";
                      setNaturalText(sample);
                      const res = parseIntake(sample);
                      setIntakeResult(res);
                      setForm((prev) => ({
                        ...prev,
                        idea: sample,
                        title: "HealthTrack AI",
                        category: "AI and machine learning",
                        time: "7",
                        unit: "days",
                        teamSize: "2",
                        level: "intermediate",
                        languages: "TypeScript, React, FastAPI",
                        skills: "TypeScript, React, FastAPI",
                      }));
                    }}
                  >
                    Sample Speech 1 (HealthTrack)
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: "0.72rem", padding: "2px 8px" }}
                    onClick={() => {
                      const sample = "I want to build an AI study planner for engineering students using Next.js and Python. We need automated task breakdown and exam deadline tracking. We are an intermediate team of 2 building this in 10 days.";
                      setNaturalText(sample);
                      const res = parseIntake(sample);
                      setIntakeResult(res);
                      setForm((prev) => ({
                        ...prev,
                        idea: sample,
                        title: "StudyPlanner AI",
                        category: "Productivity",
                        time: "10",
                        unit: "days",
                        teamSize: "2",
                        level: "intermediate",
                        languages: "Next.js, Python",
                        skills: "Next.js, Python",
                      }));
                    }}
                  >
                    Sample Speech 2 (StudyPlanner)
                  </button>
                </div>
              </div>

              <p className="form-hint" style={{ marginBottom: "12px" }}>
                Hold your Wispr Flow hotkey and dictate your idea naturally at 160+ WPM.
                Our deterministic parser extracts project title, technology, timeline, and domain category instantly without cloud roundtrips.
              </p>
              <textarea
                className="textarea"
                rows={3}
                placeholder="e.g. Hold Wispr Flow hotkey: 'I want to build a real-time sensor telemetry dashboard with React and MQTT. I am an advanced developer with 5 days.'"
                value={naturalText}
                onChange={(e) => {
                  setNaturalText(e.target.value);
                  setIntakeError("");
                }}
              />
              {intakeError && <p className="form-error-msg" style={{ marginTop: "6px" }}>{intakeError}</p>}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", flexWrap: "wrap", gap: "8px" }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleExtractIntake}
                >
                  ⚡ Auto-Extract Spoken Fields
                </button>
                <span className="form-hint" style={{ color: "var(--accent-purple)", fontWeight: 600 }}>
                  ✓ Wispr Flow Desktop & Speech-to-Text Optimized
                </span>
              </div>

              {intakeResult && (
                <div
                  style={{
                    marginTop: "16px",
                    background: "var(--bg-card)",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                    fontSize: "0.85rem",
                  }}
                >
                  <strong style={{ color: "var(--text-main)" }}>Extraction Summary:</strong>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                    {intakeResult.detected.map((d, i) => (
                      <span key={i} className="badge badge-green">
                        ✓ {d.label}: {d.value}
                      </span>
                    ))}
                    {intakeResult.missing.map((m, i) => (
                      <span key={i} className="badge badge-amber">
                        ? {m.label}
                      </span>
                    ))}
                  </div>
                  {intakeResult.notes.length > 0 && (
                    <p style={{ marginTop: "8px", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                      Note: {intakeResult.notes.join("; ")}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Standard Input Fields */}
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Project Name <span className="required">*</span>
              </label>
              <input
                id="title"
                className={`input ${errors.title ? "error" : ""}`}
                type="text"
                placeholder="e.g. HealthSync Tracker"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
              {errors.title && <p className="form-error-msg">{errors.title}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="idea">
                Project Idea / Core Pitch <span className="required">*</span>
              </label>
              <textarea
                id="idea"
                className={`textarea ${errors.idea ? "error" : ""}`}
                rows={4}
                placeholder="What are you building and what is the primary workflow?"
                value={form.idea}
                onChange={(e) => updateField("idea", e.target.value)}
              />
              <span className="form-hint">Preserved permanently in your workspace for reference.</span>
              {errors.idea && <p className="form-error-msg">{errors.idea}</p>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="category">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="category"
                  className={`select ${errors.category ? "error" : ""}`}
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="form-error-msg">{errors.category}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="audience">
                  Target Users
                </label>
                <input
                  id="audience"
                  className="input"
                  type="text"
                  placeholder="e.g. Remote software engineers"
                  value={form.audience}
                  onChange={(e) => updateField("audience", e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="problem">
                Specific Problem Solved
              </label>
              <textarea
                id="problem"
                className="textarea"
                rows={2}
                placeholder="What friction exists today that this project fixes?"
                value={form.problem}
                onChange={(e) => updateField("problem", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 2: Constraints & Skills */}
        {step === 1 && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="time">
                  Available Time <span className="required">*</span>
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    id="time"
                    className={`input ${errors.time ? "error" : ""}`}
                    type="number"
                    min="1"
                    value={form.time}
                    onChange={(e) => updateField("time", e.target.value)}
                  />
                  <select
                    className="select"
                    style={{ width: "130px" }}
                    value={form.unit}
                    onChange={(e) => updateField("unit", e.target.value)}
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                  </select>
                </div>
                {errors.time && <p className="form-error-msg">{errors.time}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="level">
                  Builder Experience Level
                </label>
                <select
                  id="level"
                  className="select"
                  value={form.level}
                  onChange={(e) => updateField("level", e.target.value)}
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="languages">
                  Languages / Skills <span className="required">*</span>
                </label>
                <input
                  id="languages"
                  className={`input ${errors.skills ? "error" : ""}`}
                  type="text"
                  placeholder="e.g. TypeScript, React, Python"
                  value={form.languages}
                  onChange={(e) => updateField("languages", e.target.value)}
                />
                {errors.skills && <p className="form-error-msg">{errors.skills}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="framework">
                  Preferred Framework (Optional)
                </label>
                <input
                  id="framework"
                  className="input"
                  type="text"
                  placeholder="e.g. Next.js, Vite, FastAPI"
                  value={form.framework}
                  onChange={(e) => updateField("framework", e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="teamSize">
                  Team Size
                </label>
                <input
                  id="teamSize"
                  className="input"
                  type="number"
                  min="1"
                  value={form.teamSize}
                  onChange={(e) => updateField("teamSize", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="deadline">
                  Hard Deadline (Optional)
                </label>
                <input
                  id="deadline"
                  className="input"
                  type="date"
                  value={form.deadline}
                  onChange={(e) => updateField("deadline", e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="constraints">
                Budget or Resource Constraints
              </label>
              <input
                id="constraints"
                className="input"
                type="text"
                placeholder="e.g. Free tier hosting only, no paid OpenAI API key"
                value={form.constraints}
                onChange={(e) => updateField("constraints", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 3: Review and Generate */}
        {step === 2 && (
          <div>
            <div className="form-group">
              <label className="form-label" htmlFor="goals">
                Specific Success Goals (One per line)
              </label>
              <textarea
                id="goals"
                className="textarea"
                rows={3}
                placeholder="Deliver working demo in 5 minutes&#10;Zero unhandled runtime errors&#10;Live URL passes mobile audit"
                value={form.goals}
                onChange={(e) => updateField("goals", e.target.value)}
              />
            </div>

            <div
              style={{
                backgroundColor: "var(--bg-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "20px",
                border: "1px solid var(--border)",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ fontSize: "1rem", marginBottom: "12px" }}>Plan Generation Summary</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  fontSize: "0.88rem",
                }}
              >
                <div>
                  <span style={{ color: "var(--text-muted)" }}>Project:</span>{" "}
                  <strong>{form.title}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)" }}>Category:</span>{" "}
                  <strong>{form.category}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)" }}>Allocated Time:</span>{" "}
                  <strong>
                    {form.time} {form.unit}
                  </strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)" }}>Level:</span>{" "}
                  <strong style={{ textTransform: "capitalize" }}>{form.level}</strong>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <span style={{ color: "var(--text-muted)" }}>Skills & Stack:</span>{" "}
                  <strong>{form.languages || "Standard Web Stack"}</strong>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "rgba(37, 99, 235, 0.08)",
                border: "1px solid rgba(37, 99, 235, 0.2)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="useAiCheckbox"
                  style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
                  checked={useAiIfAvailable}
                  onChange={(e) => setUseAiIfAvailable(e.target.checked)}
                />
                <label htmlFor="useAiCheckbox" style={{ fontSize: "0.88rem", cursor: "pointer", fontWeight: 600 }}>
                  Query Server AI Model if Configured (Fallback enabled automatically)
                </label>
              </div>
              <p className="form-hint" style={{ marginTop: "6px", marginLeft: "28px" }}>
                If no server API key is configured or the provider is slow, BuildFlow instantly uses its local
                rule engine so you are never blocked.
              </p>
            </div>

            {errors.submit && <p className="form-error-msg" style={{ marginBottom: "16px" }}>{errors.submit}</p>}
          </div>
        )}

        {/* Action Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "24px",
            borderTop: "1px solid var(--border)",
            paddingTop: "20px",
          }}
        >
          {step > 0 ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStep((prev) => prev - 1)}
              disabled={isGenerating}
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < 2 ? (
            <button type="button" className="btn btn-primary" onClick={handleNext}>
              Continue →
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" disabled={isGenerating}>
              {isGenerating ? "Building Blueprint..." : "Generate Implementation Plan 🚀"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
