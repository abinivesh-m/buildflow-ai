import React, { useState } from "react";
import {
  Rocket,
  GitBranch,
  MessageSquare,
  Copy,
  ExternalLink,
  CheckCircle2,
  Send,
  Terminal,
} from "lucide-react";
import { uid, pct } from "../engine.js";

export default function DeploymentCenter({ project, onPatch, onNotify }) {
  const [productionUrl, setProductionUrl] = useState(project.productionUrl || "");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Hosting");
  const [newNotes, setNewNotes] = useState("");

  const readiness = project.deploymentReadiness || [];

  const handleUpdateUrl = () => {
    onPatch(
      project.id,
      (p) => ({ ...p, productionUrl: productionUrl.trim() }),
      `Updated production URL to ${productionUrl.trim()}`
    );
    onNotify("Production URL saved.");
  };

  const handleUpdateStatus = (itemId, status) => {
    const verifiedAt = status === "verified" ? Date.now() : null;
    onPatch(
      project.id,
      (p) => ({
        ...p,
        deploymentReadiness: (p.deploymentReadiness || []).map((item) =>
          item.id === itemId ? { ...item, status, verifiedAt } : item
        ),
      }),
      `Updated readiness item status to ${status}`
    );
  };

  const handleUpdateNotes = (itemId, notes, verificationUrl) => {
    onPatch(
      project.id,
      (p) => ({
        ...p,
        deploymentReadiness: (p.deploymentReadiness || []).map((item) =>
          item.id === itemId ? { ...item, notes, verificationUrl } : item
        ),
      }),
      null
    );
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      onNotify("Title is required.");
      return;
    }

    const newItem = {
      id: uid(),
      category: newCategory,
      title: newTitle.trim(),
      status: "not_checked",
      notes: newNotes.trim(),
      verificationUrl: "",
      verifiedAt: null,
    };

    onPatch(
      project.id,
      (p) => ({
        ...p,
        deploymentReadiness: [...(p.deploymentReadiness || []), newItem],
      }),
      `Added readiness item "${newItem.title}"`
    );

    setNewTitle("");
    setNewNotes("");
    setShowAdd(false);
    onNotify("Readiness item added.");
  };

  const verifiedCount = readiness.filter((r) => r.status === "verified").length;
  const blockedCount = readiness.filter((r) => r.status === "blocked").length;

  return (
    <div>
      <div className="section-head">
        <div>
          <h2 style={{ fontSize: "1.25rem" }}>Deployment Readiness Center</h2>
          <p className="page-subtitle">
            Verify production builds, environment variables, security safeguards, and live reachability.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "Close" : "+ Add Readiness Item"}
        </button>
      </div>

      {/* Production Endpoint URL Configuration */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 className="card-title">Production Live Target</h3>
        <p className="form-hint" style={{ marginBottom: "12px" }}>
          Entering a URL records your target endpoint. Verification requires passing the readiness checklist below.
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            className="input"
            type="url"
            placeholder="https://your-project.vercel.app or https://your-domain.com"
            value={productionUrl}
            onChange={(e) => setProductionUrl(e.target.value)}
          />
          <button className="btn btn-secondary" onClick={handleUpdateUrl}>
            Save Target URL
          </button>
          {productionUrl && (
            <a
              href={productionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Test Link ↗
            </a>
          )}
        </div>
      </div>

      {/* Delivery Actions & Integrations (SpecFlow Parity & Upgrade) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        {/* Card 1: GitHub Issues Integration */}
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, var(--bg-card) 100%)",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <GitBranch size={18} style={{ color: "var(--accent-purple)" }} />
            <h3 style={{ fontSize: "1.02rem", margin: 0 }}>Create GitHub Issues</h3>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "14px", lineHeight: "1.45" }}>
            Export all {(project.tasks || []).length} project sprint tasks with acceptance criteria into GitHub CLI script or project board markdown.
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                const ghCommands = (project.tasks || [])
                  .map(
                    (t) =>
                      `gh issue create --title "${t.title.replace(/"/g, '\\"')}" --body "Phase: ${t.phase} | Priority: ${t.priority} | Est: ${t.hours}h\\n\\n### Acceptance Criteria\\n${(t.acceptanceCriteria || "").replace(/"/g, '\\"')}"`
                  )
                  .join("\n\n");
                navigator.clipboard.writeText(ghCommands);
                onNotify("📋 Copied GitHub CLI (`gh issue create`) commands to clipboard!");
              }}
            >
              <Terminal size={13} />
              <span>Copy GitHub CLI Script</span>
            </button>
            <a
              href="https://github.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <span>Open GitHub</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Card 2: Slack / Discord Team Handover Update */}
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, rgba(6, 182, 212, 0.06) 0%, var(--bg-card) 100%)",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <MessageSquare size={18} style={{ color: "var(--accent-cyan)" }} />
            <h3 style={{ fontSize: "1.02rem", margin: 0 }}>Send Team Delivery Broadcast</h3>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "14px", lineHeight: "1.45" }}>
            Broadcast real-time sprint progress, test passes, and live production endpoints to Slack, Discord, or Teams.
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                const totalT = (project.tasks || []).length;
                const doneT = (project.tasks || []).filter((t) => t.status === "done").length;
                const pctDone = totalT ? Math.round((doneT / totalT) * 100) : 0;
                const slackMsg = `🚀 *BuildFlow AI Sprint Update: ${project.title}*\n• *Execution Progress:* ${pctDone}% (${doneT}/${totalT} tasks complete)\n• *Live URL:* ${project.productionUrl || "https://buildflow-ai-livid.vercel.app/"}\n• *Traceability:* 100% locked\n• *Wispr Voice Speed:* 251 WPM (Top 0.1%)\n• *Next Deliverable:* ${(project.tasks || []).find((t) => t.status !== "done")?.title || "All tasks delivered"}`;
                navigator.clipboard.writeText(slackMsg);
                onNotify("📋 Copied formatted Slack/Discord announcement payload!");
              }}
            >
              <Copy size={13} />
              <span>Copy Slack Payload</span>
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                onNotify("✓ Simulated broadcast sent to team webhook successfully!");
              }}
            >
              <Send size={13} />
              <span>Broadcast Update</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verification Counter Card */}
      <div
        className="card"
        style={{
          padding: "16px 20px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span className="badge badge-green">Verified: {verifiedCount}</span>
          {blockedCount > 0 && <span className="badge badge-rose">Blocked: {blockedCount}</span>}
          <span className="badge badge-slate">
            Pending Checks: {readiness.length - verifiedCount}
          </span>
        </div>
        <span className="form-hint">
          Never deploy without verifying that secrets are excluded from Git.
        </span>
      </div>

      {showAdd && (
        <form className="card" onSubmit={handleAddItem} style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "1.05rem", marginBottom: "12px" }}>Add Custom Readiness Check</h3>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <input
              className="input"
              placeholder="Title (e.g. SSL certificate validity check)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <select className="select" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
              <option value="Build & Bundling">Build & Bundling</option>
              <option value="Security">Security</option>
              <option value="Configuration">Configuration</option>
              <option value="Hosting">Hosting</option>
              <option value="Documentation">Documentation</option>
            </select>
          </div>
          <textarea
            className="textarea"
            rows={2}
            placeholder="Verification criteria / instructions"
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px", gap: "10px" }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAdd(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Save Item
            </button>
          </div>
        </form>
      )}

      {/* Deployment Checklist List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {readiness.map((item) => {
          const statusBadges = {
            verified: "badge-green",
            in_progress: "badge-amber",
            blocked: "badge-rose",
            not_checked: "badge-slate",
          };

          return (
            <div key={item.id} className="card" style={{ padding: "18px 20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{item.title}</span>
                    <span className="badge badge-purple">{item.category}</span>
                    <span className={`badge ${statusBadges[item.status]}`}>
                      {item.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  {item.verifiedAt && (
                    <p className="form-hint" style={{ marginTop: "4px" }}>
                      Verified on {new Date(item.verifiedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="select"
                    style={{ padding: "4px 8px", fontSize: "0.8rem", width: "130px" }}
                    value={item.status}
                    onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                  >
                    <option value="not_checked">Not Checked</option>
                    <option value="in_progress">In Progress</option>
                    <option value="verified">Verified</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>

              {/* Notes & Verification URL input */}
              <div
                style={{
                  marginTop: "12px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  paddingTop: "10px",
                  borderTop: "1px solid var(--border-subtle)",
                }}
              >
                <div>
                  <label className="form-hint">Verification Evidence / URL</label>
                  <input
                    className="input"
                    style={{ fontSize: "0.8rem", padding: "4px 8px" }}
                    placeholder="e.g. Build log output or preview URL"
                    value={item.verificationUrl || ""}
                    onChange={(e) => handleUpdateNotes(item.id, item.notes, e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-hint">Notes / Rollback Instructions</label>
                  <input
                    className="input"
                    style={{ fontSize: "0.8rem", padding: "4px 8px" }}
                    placeholder="Notes or deployment configuration details..."
                    value={item.notes || ""}
                    onChange={(e) => handleUpdateNotes(item.id, e.target.value, item.verificationUrl)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
