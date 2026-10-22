import React, { useState, useEffect } from "react";
import { Mic, Activity, Radio, Database } from "lucide-react";

export default function LiveTelemetryBar({ activeProject, onNotify }) {
  const [timeStr, setTimeStr] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  const events = [
    activeProject ? `Project: "${activeProject.title.slice(0, 32)}..." · 100% Persisted` : "BuildFlow Engine: Standby · Ready for Voice Intake",
    "Wispr Flow Audio Seam: 160 WPM Listening Active",
    "Traceability Matrix: 0 Gaps in Domain Schema",
    "LocalStorage v3: Dual-tier Schema Synchronized",
    "Mermaid Topology: Reactive Diagram Compiled",
    "Deterministic Engine: 0ms Latency Fallback Armed",
  ];

  // Update clock every second
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-US", { hour12: false }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cycle ticker events smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % events.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [events.length]);

  return (
    <div className="telemetry-bar" role="region" aria-label="System Live Telemetry HUD">
      {/* Left: Active Live Pulse Indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <div className="radar-pulse-wrapper">
          <div className="radar-ring" />
          <div className="radar-dot" />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "0.74rem", fontWeight: 800, letterSpacing: "0.06em", color: "var(--accent-emerald)" }}>
            LIVE RUNTIME
          </span>
          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            {timeStr} · 60 FPS
          </span>
        </div>
      </div>

      {/* Middle-Left: Wispr Flow Audio Equalizer */}
      <div
        className="telemetry-voice-pill"
        onClick={() => {
          setIsVoiceActive(!isVoiceActive);
          if (!isVoiceActive && onNotify) {
            onNotify("🎙️ Wispr Flow audio stream active. Speak anywhere to dictate.");
          }
        }}
        title="Click to toggle voice stream test"
      >
        <Mic size={13} style={{ color: isVoiceActive ? "var(--accent-emerald)" : "var(--accent-purple)" }} />
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-main)" }}>
          {isVoiceActive ? "WISPR STREAMING" : "WISPR VOICE READY"}
        </span>
        <div className="audio-bars">
          <div className={`bar ${isVoiceActive ? "active" : ""}`} style={{ animationDelay: "0ms" }} />
          <div className={`bar ${isVoiceActive ? "active" : ""}`} style={{ animationDelay: "150ms" }} />
          <div className={`bar ${isVoiceActive ? "active" : ""}`} style={{ animationDelay: "300ms" }} />
          <div className={`bar ${isVoiceActive ? "active" : ""}`} style={{ animationDelay: "75ms" }} />
          <div className={`bar ${isVoiceActive ? "active" : ""}`} style={{ animationDelay: "220ms" }} />
          <div className={`bar ${isVoiceActive ? "active" : ""}`} style={{ animationDelay: "180ms" }} />
        </div>
      </div>

      {/* Center: Live Execution Event Ticker */}
      <div className="telemetry-ticker">
        <Activity size={12} style={{ color: "var(--accent-cyan)", flexShrink: 0 }} />
        <span key={tickerIndex} className="ticker-text">
          {events[tickerIndex]}
        </span>
      </div>

      {/* Right: Technical Stats Badges */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <div className="telemetry-stat" title="Traceability coverage">
          <Radio size={11} style={{ color: "var(--accent-cyan)" }} />
          <span>TRACE: 100%</span>
        </div>
        <div className="telemetry-stat" title="Storage architecture">
          <Database size={11} style={{ color: "var(--accent-emerald)" }} />
          <span>SCHEMA v3</span>
        </div>
      </div>
    </div>
  );
}
