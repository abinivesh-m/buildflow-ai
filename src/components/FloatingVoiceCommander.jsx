import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  ArrowUp,
  X,
  Sparkles,
  Command,
  CheckCircle2,
  AlertCircle,
  FolderPlus,
  GitBranch,
} from "lucide-react";
import { useVoiceDictation } from "../hooks/useVoiceDictation.js";
import { uid } from "../engine.js";

/**
 * FloatingVoiceCommander
 * Floating voice bar docked at bottom center (Wispr Flow Native).
 * Supports voice commands ("go to requirements", "add task...", "next step", "toggle theme")
 * and speech-to-text dictation with real audio waveform feedback.
 */
export default function FloatingVoiceCommander({
  activeProject,
  onPatch,
  onTabChange,
  onToggleTheme,
  onNotify,
  currentTheme = "dark",
}) {
  const [inputVal, setInputVal] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [commandFeedback, setCommandFeedback] = useState("");
  const inputRef = useRef(null);

  const handleSpeechResult = (fullText) => {
    setInputVal(fullText);
  };

  const {
    isListening,
    transcript,
    audioLevel,
    isSupported,
    startListening,
    stopListening,
  } = useVoiceDictation({
    onTranscript: handleSpeechResult,
  });

  // Sync transcript to input while speaking
  useEffect(() => {
    if (transcript) {
      setInputVal(transcript);
    }
  }, [transcript]);

  // Execute Voice Command Router
  const executeCommand = (rawText) => {
    const text = (rawText || inputVal).trim();
    if (!text) return;

    const lower = text.toLowerCase();

    // 1. Navigation Commands
    if (lower.includes("requirement") || lower === "go to requirements" || lower === "open requirements") {
      onTabChange("requirements");
      feedback("Navigated to Requirements Hub");
      reset();
      return;
    }
    if (lower.includes("traceability") || lower.includes("matrix")) {
      onTabChange("traceability");
      feedback("Opened Traceability Matrix");
      reset();
      return;
    }
    if (lower.includes("architecture") || lower.includes("topology") || lower.includes("mermaid")) {
      onTabChange("architecture");
      feedback("Opened System Architecture & Mermaid View");
      reset();
      return;
    }
    if (lower.includes("kanban") || lower.includes("tasks") || lower === "open tasks") {
      onTabChange("tasks");
      feedback("Switched to Kanban Tasks");
      reset();
      return;
    }
    if (lower.includes("decision") || lower.includes("tdr")) {
      onTabChange("decisions");
      feedback("Opened Technical Decision Records (TDR)");
      reset();
      return;
    }
    if (lower.includes("risk") || lower.includes("heatmap")) {
      onTabChange("risks");
      feedback("Opened 5x5 Risk Register");
      reset();
      return;
    }
    if (lower.includes("test") || lower.includes("testing") || lower.includes("checklist")) {
      onTabChange("testing");
      feedback("Opened Testing & Verification Checklist");
      reset();
      return;
    }
    if (lower.includes("deploy") || lower.includes("readiness")) {
      onTabChange("deployment");
      feedback("Opened Release Readiness Center");
      reset();
      return;
    }
    if (lower.includes("demo") || lower.includes("pitch")) {
      onTabChange("demo");
      feedback("Opened Demo & Presentation Studio");
      reset();
      return;
    }
    if (lower.includes("blueprint") || lower.includes("plan")) {
      onTabChange("plan");
      feedback("Opened 18-Point Plan Blueprint");
      reset();
      return;
    }
    if (lower.includes("control center") || lower.includes("overview")) {
      onTabChange("overview");
      feedback("Navigated to Control Center");
      reset();
      return;
    }

    // 2. Theme Commands
    if (lower.includes("light mode") || lower.includes("switch to light")) {
      if (currentTheme !== "light") onToggleTheme();
      feedback("Switched to Warm Light Mode");
      reset();
      return;
    }
    if (lower.includes("dark mode") || lower.includes("switch to dark")) {
      if (currentTheme !== "dark") onToggleTheme();
      feedback("Switched to Deep Dark Mode");
      reset();
      return;
    }
    if (lower.includes("toggle theme") || lower.includes("switch theme")) {
      onToggleTheme();
      feedback(`Switched to ${currentTheme === "light" ? "Dark" : "Light"} Mode`);
      reset();
      return;
    }

    // 3. Complete Next Task ("next step")
    if (lower === "next step" || lower.includes("complete next") || lower.includes("mark next task done")) {
      if (!activeProject) {
        feedback("No active project loaded");
        return;
      }
      const nextPending = (activeProject.tasks || []).find((t) => t.status !== "done");
      if (nextPending) {
        onPatch(
          activeProject.id,
          (p) => ({
            ...p,
            tasks: (p.tasks || []).map((t) =>
              t.id === nextPending.id ? { ...t, status: "done" } : t
            ),
          }),
          `Completed "${nextPending.title}" via voice command`
        );
        feedback(`✓ Completed "${nextPending.title}"`);
      } else {
        feedback("🎉 All tasks already completed!");
      }
      reset();
      return;
    }

    // 4. Create Task via Voice ("create task [title]" or "add task [title]")
    if (lower.startsWith("create task") || lower.startsWith("add task")) {
      const taskTitle = text.replace(/^(create task|add task)\s*:?/i, "").trim();
      if (!taskTitle) {
        feedback("Please specify a task title");
        return;
      }
      if (!activeProject) {
        feedback("Select a project first");
        return;
      }
      const newTask = {
        id: uid(),
        phase: 0,
        title: taskTitle,
        desc: "Dictated hands-free via Wispr Flow voice commander",
        hours: 2,
        priority: "medium",
        status: "todo",
        acceptanceCriteria: "Verified functional requirement.",
        blockers: "",
        notes: "",
        dependencies: [],
        custom: true,
      };
      onPatch(
        activeProject.id,
        (p) => ({
          ...p,
          tasks: [newTask, ...(p.tasks || [])],
        }),
        `Added task "${taskTitle}" via voice`
      );
      feedback(`✓ Added Task: "${taskTitle}"`);
      onTabChange("tasks");
      reset();
      return;
    }

    // 5. Create Requirement via Voice ("add requirement [title]")
    if (lower.startsWith("add requirement") || lower.startsWith("create requirement")) {
      const reqTitle = text.replace(/^(create requirement|add requirement)\s*:?/i, "").trim();
      if (!reqTitle) {
        feedback("Please specify a requirement title");
        return;
      }
      if (!activeProject) return;
      const newReq = {
        id: uid(),
        title: reqTitle,
        description: "Dictated requirement captured hands-free via Wispr Flow.",
        type: "functional",
        priority: "high",
        status: "approved",
        acceptanceCriteria: ["AC: Must satisfy functional validation."],
        linkedTaskIds: [],
        linkedTestIds: [],
        linkedDecisionIds: [],
        linkedRiskIds: [],
        source: "voice-dictated",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      onPatch(
        activeProject.id,
        (p) => ({
          ...p,
          requirements: [newReq, ...(p.requirements || [])],
        }),
        `Added requirement "${reqTitle}" via voice`
      );
      feedback(`✓ Added Requirement: "${reqTitle}"`);
      onTabChange("requirements");
      reset();
      return;
    }

    // 6. Freeform Dictation: Offer Quick Route Actions
    setIsExpanded(true);
  };

  const feedback = (msg) => {
    setCommandFeedback(msg);
    if (onNotify) onNotify(msg);
    setTimeout(() => setCommandFeedback(""), 3500);
  };

  const reset = () => {
    setInputVal("");
    setIsExpanded(false);
    if (isListening) stopListening();
  };

  const toggleMic = (e) => {
    e.preventDefault();
    if (!isSupported) {
      feedback("Browser Speech API unavailable. Use Wispr Flow desktop shortcut (Ctrl+Opt)");
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
      feedback("🎙️ Listening... Say 'next step', 'open requirements', 'add task [title]'...");
    }
  };

  const [isMinimized, setIsMinimized] = useState(false);

  // Real Audio Waveform bars calculation
  const bar1 = Math.max(4, Math.min(22, 4 + audioLevel * 0.18));
  const bar2 = Math.max(5, Math.min(26, 5 + audioLevel * 0.22));
  const bar3 = Math.max(6, Math.min(30, 6 + audioLevel * 0.25));
  const bar4 = Math.max(5, Math.min(26, 5 + audioLevel * 0.21));
  const bar5 = Math.max(4, Math.min(22, 4 + audioLevel * 0.17));

  // If user minimized the voice commander
  if (isMinimized) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "24px",
          zIndex: 90,
        }}
      >
        <button
          type="button"
          className="btn btn-primary"
          style={{
            borderRadius: "999px",
            padding: "8px 16px",
            fontSize: "0.82rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 6px 20px var(--primary-glow)",
          }}
          onClick={() => setIsMinimized(false)}
          title="Open Wispr Voice Commander"
        >
          <Mic size={15} />
          <span>Wispr Voice</span>
          <span
            style={{
              fontSize: "0.7rem",
              opacity: 0.8,
              background: "rgba(255, 255, 255, 0.2)",
              padding: "1px 6px",
              borderRadius: "4px",
            }}
          >
            Opt+Ctrl
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="floating-voice-container"
      role="region"
      aria-label="Wispr Flow Voice Commander"
    >
      {/* Toast Feedback Banner */}
      {commandFeedback && (
        <div className="voice-feedback-toast">
          <CheckCircle2 size={14} style={{ color: "var(--accent-emerald)" }} />
          <span>{commandFeedback}</span>
        </div>
      )}

      {/* Expanded Quick Action Drawer (if freeform speech is entered) */}
      {isExpanded && inputVal && (
        <div className="voice-action-drawer card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Spoken Context Captured:
            </span>
            <button className="btn btn-ghost btn-sm" onClick={() => setIsExpanded(false)}>
              <X size={14} />
            </button>
          </div>
          <p style={{ fontSize: "0.88rem", color: "var(--text-main)", marginBottom: "12px", fontStyle: "italic" }}>
            "{inputVal}"
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                executeCommand(`create task ${inputVal}`);
              }}
            >
              + Create as Task
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                executeCommand(`add requirement ${inputVal}`);
              }}
            >
              + Add as Requirement
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                navigator.clipboard.writeText(inputVal);
                feedback("Dictated text copied to clipboard!");
                reset();
              }}
            >
              Copy Text
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Voice Pill Dock */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: "6px" }}>
        {/* Top Floating Pill: Voice Status */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "999px",
            padding: "3px 12px",
            fontSize: "0.68rem",
            fontWeight: 700,
            color: isListening ? "var(--accent-purple)" : "var(--text-muted)",
            letterSpacing: "0.05em",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: isListening ? "var(--accent-rose)" : "var(--accent-emerald)",
              boxShadow: isListening ? "0 0 6px var(--accent-rose)" : "0 0 6px var(--accent-emerald)",
            }}
          />
          <span>{isListening ? "RECORDING SPEECH STREAM" : "VOICE READY · DEFINE & NAVIGATE"}</span>
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              marginLeft: "4px",
              padding: "0 2px",
              fontSize: "0.75rem",
              lineHeight: 1,
            }}
            title="Minimize Voice Commander"
          >
            ✕
          </button>
        </div>

        <div className={`floating-voice-dock ${isListening ? "dock-active" : ""}`}>
          {/* Left: Waveform / Mic Trigger Button */}
          <button
            type="button"
            className={`voice-dock-mic ${isListening ? "active" : ""}`}
            onClick={toggleMic}
            title={isListening ? "Listening... Click to send" : "Click to speak (Wispr Flow Native)"}
            aria-label={isListening ? "Stop listening" : "Start speaking"}
          >
            {isListening ? (
              <div className="dock-equalizer-bars" aria-hidden="true">
                <span className="dock-bar" style={{ height: `${bar1}px` }} />
                <span className="dock-bar" style={{ height: `${bar2}px` }} />
                <span className="dock-bar" style={{ height: `${bar3}px` }} />
                <span className="dock-bar" style={{ height: `${bar4}px` }} />
                <span className="dock-bar" style={{ height: `${bar5}px` }} />
              </div>
            ) : (
              <Mic size={16} />
            )}
          </button>

          {/* Center: Command Input / Speech Preview */}
          <div className="voice-dock-input-wrapper">
            <input
              ref={inputRef}
              className="voice-dock-input"
              type="text"
              placeholder={
                isListening
                  ? "Listening... Speak naturally"
                  : 'Say "next step", or tell us what should change...'
              }
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  executeCommand(inputVal);
                } else if (e.key === "Escape") {
                  reset();
                }
              }}
            />
          </div>

          {/* Right: Shortcut Hint Badge */}
          <div className="voice-dock-shortcut" title="Use Wispr Flow native global shortcut">
            <Command size={11} />
            <span>Opt+Ctrl</span>
          </div>

          {/* Right Submit / Execute Button */}
          <button
            type="button"
            className="voice-dock-submit"
            onClick={() => executeCommand(inputVal)}
            disabled={!inputVal.trim() && !isListening}
            title="Execute voice command or submit dictation"
            aria-label="Submit voice command"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
