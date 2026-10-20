import React, { useState } from "react";

export default function GlobalSettingsView({ projects, onClearAll, onImportBackup, onNotify }) {
  const [activeTab, setActiveTab] = useState("storage");

  const downloadJson = () => {
    const backup = {
      app: "BuildFlow",
      version: 2,
      exportedAt: new Date().toISOString(),
      projects,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `buildflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify("Complete JSON backup downloaded.");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (parsed && Array.isArray(parsed.projects)) {
          onImportBackup(parsed.projects);
          onNotify(`Successfully restored ${parsed.projects.length} projects!`);
        } else {
          onNotify("Invalid backup file format: missing projects array.");
        }
      } catch (_err) {
        onNotify("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <div className="section-head">
        <div>
          <h1 className="page-title">Application Settings</h1>
          <p className="page-subtitle">
            Configure persistence, data backups, privacy models, and honest provider settings.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <button
          className={`btn btn-sm ${activeTab === "storage" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveTab("storage")}
        >
          Data & Persistence
        </button>
        <button
          className={`btn btn-sm ${activeTab === "ai" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveTab("ai")}
        >
          AI Engine Provider
        </button>
        <button
          className={`btn btn-sm ${activeTab === "privacy" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveTab("privacy")}
        >
          Privacy & Security
        </button>
      </div>

      {activeTab === "storage" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="card">
            <h3 className="card-title">Complete JSON Backup</h3>
            <p className="form-hint" style={{ marginBottom: "16px" }}>
              Download every project, task, TDR decision, testing check, and demo script into a single portable JSON file.
            </p>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button
                className="btn btn-primary"
                disabled={projects.length === 0}
                onClick={downloadJson}
              >
                Download JSON Backup ({projects.length} Projects)
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Restore from Backup</h3>
            <p className="form-hint" style={{ marginBottom: "16px" }}>
              Select a valid BuildFlow JSON backup to restore or append projects into your workspace.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              style={{ fontSize: "0.88rem" }}
            />
          </div>

          <div className="card" style={{ borderColor: "rgba(244, 63, 94, 0.3)" }}>
            <h3 className="card-title" style={{ color: "var(--accent-rose)" }}>
              Danger Zone
            </h3>
            <p className="form-hint" style={{ marginBottom: "16px" }}>
              Clear all project data and activity records from this browser's local storage. This action cannot be reversed.
            </p>
            <button className="btn btn-danger" onClick={onClearAll}>
              Delete All Local Projects
            </button>
          </div>
        </div>
      )}

      {activeTab === "ai" && (
        <div className="card">
          <h3 className="card-title">AI Engine Architecture</h3>
          <p className="form-hint" style={{ marginBottom: "16px" }}>
            BuildFlow maintains an honest architecture:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.88rem" }}>
            <div style={{ background: "var(--bg-subtle)", padding: "14px", borderRadius: "var(--radius-sm)" }}>
              <strong>1. Built-in Deterministic Engine (Default)</strong>
              <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
                Zero network requests, zero remote dependencies, and immediate 18-point plan generation. Generates complete tasks, effort estimates, and TDR records locally in your browser.
              </p>
            </div>

            <div style={{ background: "var(--bg-subtle)", padding: "14px", borderRadius: "var(--radius-sm)" }}>
              <strong>2. Server-side Gemini API (Optional)</strong>
              <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
                Configured via the server environment variable <code>GEMINI_API_KEY</code>. Keeps keys safe and out of client bundles. If omitted or if the provider times out, BuildFlow falls back to the deterministic engine seamlessly.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "privacy" && (
        <div className="card">
          <h3 className="card-title">Privacy & Security Guarantees</h3>
          <ul style={{ paddingLeft: "20px", fontSize: "0.88rem", display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
            <li>
              <strong>Local-First Storage:</strong> Your ideas, projects, and plans live in your browser's persistent storage.
            </li>
            <li>
              <strong>Zero Tracking:</strong> No behavioral telemetry trackers or third-party ad pixels.
            </li>
            <li>
              <strong>Safe API Seams:</strong> API secrets are never requested or stored in the browser frontend.
            </li>
            <li>
              <strong>Strict Schema Validation:</strong> Data is validated at each layer before being committed to storage.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
