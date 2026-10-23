import React, { useEffect, useState } from "react";
import {
  Sparkles,
  LayoutDashboard,
  FolderPlus,
  FolderKanban,
  Settings,
  Sun,
  Moon,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from "lucide-react";
import { uid, generatePlan } from "./engine.js";
import LandingView from "./components/LandingView.jsx";
import DashboardView from "./components/DashboardView.jsx";
import ProjectWizard from "./components/ProjectWizard.jsx";
import WorkspaceView from "./components/WorkspaceView.jsx";
import GlobalSettingsView from "./components/GlobalSettingsView.jsx";
import LiveTelemetryBar from "./components/LiveTelemetryBar.jsx";
import FloatingVoiceCommander from "./components/FloatingVoiceCommander.jsx";
import LivingBlueprintCanvas from "./components/LivingBlueprintCanvas.jsx";

const STORAGE_KEY = "buildflow:v3";
const LEGACY_V2 = "billflow:v2";
const LEGACY_V1 = "billflow:projects";

const getPreferredTheme = () => {
  if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
};

const readStorage = (k) => {
  try {
    return JSON.parse(localStorage.getItem(k));
  } catch {
    return null;
  }
};

const arr = (v) => (Array.isArray(v) ? v : []);

// Normalizer to ensure complete v3 schema integrity
function sanitizeProject(p) {
  if (!p || typeof p !== "object" || !p.plan || !Array.isArray(p.tasks)) return null;

  return {
    id: p.id || uid(),
    title: p.title || "Untitled Project",
    idea: p.idea || "",
    problem: p.problem || "",
    audience: p.audience || "",
    category: p.category || "Web application",
    level: p.level || "beginner",
    time: p.time || "7",
    unit: p.unit || "days",
    teamSize: p.teamSize || "1",
    languages: p.languages || "",
    skills: p.skills || "",
    framework: p.framework || "",
    constraints: p.constraints || "",
    goals: p.goals || "",
    deadline: p.deadline || "",
    productionUrl: p.productionUrl || "",
    createdAt: p.createdAt || Date.now(),
    updatedAt: p.updatedAt || Date.now(),
    openedAt: p.openedAt || 0,
    plan: {
      ...p.plan,
      stack: arr(p.plan?.stack),
      phases: arr(p.plan?.phases),
      objectives: arr(p.plan?.objectives),
      mvp: arr(p.plan?.mvp),
      features: arr(p.plan?.features),
      optional: arr(p.plan?.optional),
      userNeeds: arr(p.plan?.userNeeds),
      excludedFromMvp: arr(p.plan?.excludedFromMvp),
      functionalRequirements: arr(p.plan?.functionalRequirements),
      nonFunctionalRequirements: arr(p.plan?.nonFunctionalRequirements),
      userStories: arr(p.plan?.userStories),
      acceptanceCriteria: arr(p.plan?.acceptanceCriteria),
      dataModel: arr(p.plan?.dataModel),
      testing: arr(p.plan?.testing),
      deployment: arr(p.plan?.deployment),
      potentialRisks: arr(p.plan?.potentialRisks),
      generatorSource: p.plan?.generatorSource || "BuildFlow Deterministic Rule Engine",
    },
    tasks: arr(p.tasks)
      .filter((t) => t && t.title)
      .map((t) => ({
        id: t.id || uid(),
        phase: t.phase ?? 0,
        title: t.title,
        desc: t.desc || "",
        hours: Number(t.hours) || 1,
        priority: t.priority || "medium",
        status: t.status || "todo",
        acceptanceCriteria: t.acceptanceCriteria || "Functional verification without regressions.",
        blockers: t.blockers || "",
        notes: t.notes || "",
        dependencies: arr(t.dependencies),
        custom: !!t.custom,
      })),
    decisions: arr(p.decisions).map((d) => ({
      id: d.id || uid(),
      title: d.title || "Architecture Choice",
      context: d.context || "",
      optionsConsidered: d.optionsConsidered || "",
      chosenOption: d.chosenOption || "",
      reasoning: d.reasoning || "",
      consequences: d.consequences || "",
      status: d.status || "accepted",
      createdAt: d.createdAt || Date.now(),
    })),
    testChecklist: arr(p.testChecklist).map((tc) => ({
      id: tc.id || uid(),
      category: tc.category || "Core functionality",
      title: tc.title || "Check item",
      description: tc.description || "",
      isAutomated: !!tc.isAutomated,
      status: tc.status || "pending",
      evidence: tc.evidence || "",
      notes: tc.notes || "",
      verifiedAt: tc.verifiedAt || null,
    })),
    deploymentReadiness: arr(p.deploymentReadiness).map((dr) => ({
      id: dr.id || uid(),
      category: dr.category || "Configuration",
      title: dr.title || "Deployment Item",
      status: dr.status || "not_checked",
      notes: dr.notes || "",
      verificationUrl: dr.verificationUrl || "",
      verifiedAt: dr.verifiedAt || null,
    })),
    demoScript: p.demoScript || {
      targetDurationMin: 3,
      problem: p.plan?.problem || "",
      audience: p.audience || "",
      solution: p.plan?.solution || "",
      liveWalkthrough: "",
      keyFeatures: "",
      architecture: p.plan?.architecture || "",
      testingEvidence: "",
      limitations: "",
      futureWork: "",
      checklist: [
        { text: "Application starts and runs cleanly", checked: true },
        { text: "Main workflow demonstrated without errors", checked: false },
        { text: "No sensitive API tokens visible on screen", checked: true },
        { text: "Backup screenshots ready", checked: false },
      ],
    },
    requirements: arr(p.requirements).map((r) => ({
      id: r.id || uid(),
      title: r.title || "Functional Requirement",
      description: r.description || "",
      type: r.type || "functional",
      priority: r.priority || "medium",
      status: r.status || "approved",
      acceptanceCriteria: arr(r.acceptanceCriteria),
      linkedTaskIds: arr(r.linkedTaskIds),
      linkedTestIds: arr(r.linkedTestIds),
      linkedDecisionIds: arr(r.linkedDecisionIds),
      linkedRiskIds: arr(r.linkedRiskIds),
      source: r.source || "user",
      createdAt: r.createdAt || Date.now(),
      updatedAt: r.updatedAt || Date.now(),
    })),
    risks: arr(p.risks).map((rk) => ({
      id: rk.id || uid(),
      title: rk.title || "Project Risk",
      description: rk.description || "",
      category: rk.category || "technical",
      likelihood: Number(rk.likelihood) || 3,
      impact: Number(rk.impact) || 3,
      severity: (Number(rk.likelihood) || 3) * (Number(rk.impact) || 3),
      status: rk.status || "open",
      mitigation: rk.mitigation || "",
      owner: rk.owner || "",
      linkedRequirementIds: arr(rk.linkedRequirementIds),
      linkedTaskIds: arr(rk.linkedTaskIds),
      createdAt: rk.createdAt || Date.now(),
      updatedAt: rk.updatedAt || Date.now(),
    })),
    architecture: p.architecture || {
      description: p.plan?.architecture || "A modern responsive single-page client interfacing with structured REST endpoints.",
      mermaidDiagram: `flowchart TD\n  Client["Client SPA"] --> Gateway["API Gateway"]\n  Gateway --> DB["Database"]`,
      components: [],
    },
  };
}

function initStore() {
  const v3 = readStorage(STORAGE_KEY);
  if (v3 && Array.isArray(v3.projects)) {
    return {
      projects: v3.projects.map(sanitizeProject).filter(Boolean),
      activity: arr(v3.activity),
      theme: v3.theme || getPreferredTheme(),
    };
  }

  const v2 = readStorage(LEGACY_V2);
  if (v2 && Array.isArray(v2.projects)) {
    return {
      projects: v2.projects.map((p) => {
        const full = generatePlan(p);
        return sanitizeProject({
          ...p,
          ...full,
          tasks: p.tasks && p.tasks.length ? p.tasks : full.tasks,
        });
      }),
      activity: arr(v2.activity),
      theme: v2.theme || getPreferredTheme(),
    };
  }

  const v1 = readStorage(LEGACY_V1);
  if (Array.isArray(v1) && v1.length) {
    return {
      projects: v1.map((old) => {
        const inp = {
          title: String(old.idea || "Untitled").slice(0, 50),
          idea: old.idea || "",
          category: old.category || "Web application",
          time: old.time || "7",
          unit: old.unit || "days",
          level: "intermediate",
        };
        const gen = generatePlan(inp);
        return sanitizeProject({ ...inp, id: old.id || uid(), ...gen });
      }),
      activity: [],
      theme: getPreferredTheme(),
    };
  }

  const sample = generatePlan({
    title: "HealthTrack AI: Clinical Vitals & Alert System",
    idea: "A clinical vitals monitoring workspace for student medical teams. Parses lab readings, alerts clinicians of critical thresholds, and generates structured handover summaries.",
    problem: "Resident doctors and medical students spend 40% of handover shifts reconciling vitals without automated trend alerts.",
    audience: "Resident doctors, nurses, and clinical teams",
    category: "AI and machine learning",
    level: "intermediate",
    time: "7",
    unit: "days",
    teamSize: "2",
    languages: "TypeScript, Python, React",
    skills: "React, FastAPI, PostgreSQL",
    framework: "React (Vite)",
    constraints: "Strict HIPAA-compliant local storage, sub-second alerts",
    goals: "Real-time vitals triage chart\nCritical alert notification engine\nAutomated shift handover export",
    deadline: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
  });

  const initialProject = sanitizeProject({
    id: uid(),
    title: "HealthTrack AI: Clinical Vitals & Alert System",
    idea: "A clinical vitals monitoring workspace for student medical teams. Parses lab readings, alerts clinicians of critical thresholds, and generates structured handover summaries.",
    problem: "Resident doctors and medical students spend 40% of handover shifts reconciling vitals without automated trend alerts.",
    audience: "Resident doctors, nurses, and clinical teams",
    category: "AI and machine learning",
    level: "intermediate",
    time: "7",
    unit: "days",
    teamSize: "2",
    languages: "TypeScript, Python, React",
    skills: "React, FastAPI, PostgreSQL",
    framework: "React (Vite)",
    constraints: "Strict HIPAA-compliant local storage, sub-second alerts",
    goals: "Real-time vitals triage chart\nCritical alert notification engine\nAutomated shift handover export",
    deadline: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    ...sample,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    openedAt: Date.now(),
  });

  return {
    projects: [initialProject],
    activity: [{ id: uid(), text: 'Loaded sample project "HealthTrack AI"', at: Date.now() }],
    theme: getPreferredTheme(),
  };
}

export default function App() {
  const [store, setStore] = useState(initStore);
  const [view, setView] = useState("landing");
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [workspaceTab, setWorkspaceTab] = useState("overview");
  const [confirmModal, setConfirmModal] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [storageAvailable, setStorageAvailable] = useState(true);

  const { projects, activity, theme } = store;
  const currentProject = projects.find((p) => p.id === activeProjectId);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      setStorageAvailable(true);
    } catch (_e) {
      setStorageAvailable(false);
    }
  }, [store]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme || "dark");
  }, [theme]);

  const notify = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const askConfirmation = (msg, onConfirm) => {
    setConfirmModal({ msg, onConfirm });
  };

  const commitStore = (projectUpdater, activityMsg) => {
    setStore((prev) => ({
      ...prev,
      projects: projectUpdater(prev.projects),
      activity: activityMsg
        ? [{ id: uid(), text: activityMsg, at: Date.now() }, ...prev.activity].slice(0, 30)
        : prev.activity,
    }));
  };

  const patchProject = (id, updater, activityMsg) => {
    commitStore(
      (ps) => ps.map((p) => (p.id === id ? { ...updater(p), updatedAt: Date.now() } : p)),
      activityMsg
    );
  };

  const toggleTheme = () => {
    setStore((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  const openProject = (id, initialTab = "overview") => {
    setActiveProjectId(id);
    setWorkspaceTab(initialTab);
    setView("workspace");
    patchProject(id, (p) => ({ ...p, openedAt: Date.now() }), null);
  };

  const handleCreateProject = async (formData) => {
    let generated;

    if (formData.useAiIfAvailable) {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idea: formData.idea,
            category: formData.category,
            time: formData.time,
            unit: formData.unit,
            skills: [formData.languages, formData.skills].filter(Boolean),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.plan) {
            const fallback = generatePlan(formData);
            generated = {
              ...fallback,
              plan: {
                ...fallback.plan,
                ...data.plan,
                generatorSource: "Server AI Model (Gemini 2.5 Flash)",
              },
            };
          }
        }
      } catch (_err) {
        // Fallback transparently
      }
    }

    if (!generated) {
      generated = generatePlan(formData);
    }

    const newProject = sanitizeProject({
      ...formData,
      id: uid(),
      ...generated,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      openedAt: Date.now(),
    });

    commitStore((ps) => [newProject, ...ps], `Created project "${newProject.title}"`);
    setActiveProjectId(newProject.id);
    setWorkspaceTab("overview");
    setView("workspace");
    notify("Implementation plan generated successfully!");
  };

  const handleRegeneratePlan = (p) => {
    askConfirmation(
      `Regenerate plan for "${p.title}"? Custom tasks and completed statuses will be preserved.`,
      () => {
        const fresh = generatePlan(p);
        const doneTitles = new Set(
          (p.tasks || []).filter((t) => t.status === "done").map((t) => t.title)
        );

        patchProject(
          p.id,
          (curr) => ({
            ...curr,
            plan: fresh.plan,
            tasks: [
              ...fresh.tasks.map((t) => (doneTitles.has(t.title) ? { ...t, status: "done" } : t)),
              ...(curr.tasks || []).filter((t) => t.custom),
            ],
          }),
          `Regenerated plan for "${p.title}"`
        );
        notify("Plan regenerated with preserved progress.");
      }
    );
  };

  const handleDuplicateProject = (p) => {
    const copy = sanitizeProject({
      ...p,
      id: uid(),
      title: `${p.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      openedAt: 0,
      tasks: (p.tasks || []).map((t) => ({ ...t, id: uid() })),
      decisions: (p.decisions || []).map((d) => ({ ...d, id: uid() })),
      testChecklist: (p.testChecklist || []).map((tc) => ({ ...tc, id: uid() })),
      deploymentReadiness: (p.deploymentReadiness || []).map((dr) => ({ ...dr, id: uid() })),
      requirements: (p.requirements || []).map((r) => ({ ...r, id: uid() })),
      risks: (p.risks || []).map((rk) => ({ ...rk, id: uid() })),
      architecture: p.architecture ? JSON.parse(JSON.stringify(p.architecture)) : undefined,
    });

    commitStore((ps) => [copy, ...ps], `Duplicated "${p.title}"`);
    notify("Project duplicated.");
  };

  const handleDeleteProject = (p) => {
    askConfirmation(`Permanently delete project "${p.title}"?`, () => {
      commitStore((ps) => ps.filter((x) => x.id !== p.id), `Deleted project "${p.title}"`);
      if (activeProjectId === p.id) {
        setActiveProjectId(null);
        setView("dashboard");
      }
      notify("Project deleted.");
    });
  };

  const handleClearAllProjects = () => {
    askConfirmation("Delete all projects from this browser?", () => {
      setStore({
        projects: [],
        activity: [],
        theme: "dark",
      });
      setActiveProjectId(null);
      setView("dashboard");
      notify("All local projects have been erased.");
    });
  };

  const handleImportBackup = (restoredProjects) => {
    const sanitized = restoredProjects.map(sanitizeProject).filter(Boolean);
    commitStore(
      (ps) => [...sanitized, ...ps],
      `Imported ${sanitized.length} projects from backup`
    );
  };

  return (
    <div className="app-shell">
      {/* Background Subtle Ambient Engineering Grid */}
      <div className="bg-mesh" />
      <LivingBlueprintCanvas theme={theme} variant="ambient" />

      {/* Mobile Top Bar */}
      <div className="mobile-topbar">
        <div className="brand-badge" onClick={() => setView("landing")}>
          <div className="brand-icon">
            <Flame size={18} />
          </div>
          <span>BuildFlow</span>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={toggleTheme}>
          {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <button className="brand-badge" onClick={() => setView("landing")}>
            <div className="brand-icon">
              <Flame size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800 }}>BuildFlow</div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                Execution Workspace
              </div>
            </div>
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Main Navigation">
          <button
            className={`nav-link ${view === "landing" ? "active" : ""}`}
            onClick={() => setView("landing")}
          >
            <Sparkles size={16} />
            <span>Product Overview</span>
          </button>

          <button
            className={`nav-link ${view === "dashboard" ? "active" : ""}`}
            onClick={() => setView("dashboard")}
          >
            <LayoutDashboard size={16} />
            <span>Control Center</span>
          </button>

          <button
            className={`nav-link ${view === "wizard" ? "active" : ""}`}
            onClick={() => setView("wizard")}
          >
            <FolderPlus size={16} />
            <span>New Project</span>
          </button>

          {currentProject && (
            <button
              className={`nav-link ${view === "workspace" ? "active" : ""}`}
              onClick={() => setView("workspace")}
            >
              <FolderKanban size={16} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {currentProject.title}
              </span>
            </button>
          )}

          <button
            className={`nav-link ${view === "settings" ? "active" : ""}`}
            onClick={() => setView("settings")}
          >
            <Settings size={16} />
            <span>Settings & Backups</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            <span>Mode</span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {theme === "light" ? <Sun size={13} /> : <Moon size={13} />}
              {theme === "light" ? "Light" : "Dark"}
            </span>
          </button>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center" }}>
            Production Workspace v2.2
          </div>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="main-content">
        <LiveTelemetryBar activeProject={currentProject || projects[0]} onNotify={notify} />

        {!storageAvailable && (
          <div
            className="card"
            style={{
              background: "rgba(244, 63, 94, 0.15)",
              borderColor: "var(--accent-rose)",
              padding: "12px 16px",
              marginBottom: "20px",
              color: "var(--accent-rose)",
              fontSize: "0.88rem",
            }}
          >
            <AlertTriangle size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
            Local storage is currently restricted. Your data will only persist for this browser session.
          </div>
        )}

        {view === "landing" && (
          <LandingView
            sampleProject={projects[0]}
            onGetStarted={() => setView("wizard")}
            onDemoProject={() => {
              if (projects.length > 0) {
                openProject(projects[0].id);
              } else {
                setView("wizard");
              }
            }}
          />
        )}

        {view === "dashboard" && (
          <DashboardView
            projects={projects}
            activity={activity}
            onOpenProject={(id) => openProject(id)}
            onNewProject={() => setView("wizard")}
            onDuplicate={handleDuplicateProject}
            onDelete={handleDeleteProject}
          />
        )}

        {view === "wizard" && (
          <ProjectWizard
            onCreate={handleCreateProject}
            onCancel={() => setView(projects.length > 0 ? "dashboard" : "landing")}
          />
        )}

        {view === "workspace" && currentProject && (
          <WorkspaceView
            project={currentProject}
            tab={workspaceTab}
            setTab={setWorkspaceTab}
            onPatch={patchProject}
            onAskConfirm={askConfirmation}
            onNotify={notify}
            onRegenerate={handleRegeneratePlan}
          />
        )}

        {view === "settings" && (
          <GlobalSettingsView
            projects={projects}
            onClearAll={handleClearAllProjects}
            onImportBackup={handleImportBackup}
            onNotify={notify}
          />
        )}
      </main>

      {/* Toast */}
      {toastMessage && (
        <div className="toast-notice" role="status">
          <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)" }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Safeguard Modal */}
      {confirmModal && (
        <div className="modal-backdrop" onClick={() => setConfirmModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "12px", color: "var(--accent-rose)" }}>
              Confirmation Required
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: "1.5" }}>
              {confirmModal.msg}
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setConfirmModal(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Floating Wispr Flow Voice Commander Dock (Active in Workspace & Dashboard) */}
      {view !== "wizard" && (
        <FloatingVoiceCommander
          activeProject={currentProject || projects[0]}
          onPatch={patchProject}
          onTabChange={(targetTab) => {
            if (view !== "workspace") {
              if (currentProject) {
                setView("workspace");
                setWorkspaceTab(targetTab);
              } else if (projects.length > 0) {
                openProject(projects[0].id, targetTab);
              }
            } else {
              setWorkspaceTab(targetTab);
            }
          }}
          onToggleTheme={toggleTheme}
          onNotify={notify}
          currentTheme={theme}
        />
      )}
    </div>
  );
}
