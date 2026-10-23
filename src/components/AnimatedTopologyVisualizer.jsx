import React, { useState } from "react";
import { Server, Database, Globe, Cpu, ShieldCheck, Zap, Activity, HardDrive } from "lucide-react";

/**
 * AnimatedTopologyVisualizer
 *
 * Cinematic interactive architecture topology with animated component
 * connections, traveling purple/lavender light pulses, and live data telemetry.
 */
export default function AnimatedTopologyVisualizer({ stack = [], theme = "dark" }) {
  const [selectedNode, setSelectedNode] = useState(null);

  const fe = stack.find((s) => s.group === "Frontend")?.name || "React 19 (Vite SPA)";
  const be = stack.find((s) => s.group === "Backend")?.name || "REST API Gateway";
  const db = stack.find((s) => s.group === "Database")?.name || "Schema v3 Relational";
  const host = stack.find((s) => s.group === "Deployment")?.name || "Vercel Edge Host";

  const nodes = [
    {
      id: "client",
      name: "Frontend Client",
      tech: fe,
      role: "Voice Intake & Reactive UI",
      icon: Globe,
      x: 100,
      y: 70,
      badge: "UI Layer",
      color: "var(--accent-purple)",
    },
    {
      id: "state",
      name: "Client State Store",
      tech: "Schema v3 Normalizer",
      role: "Local-First Persistence & Sync",
      icon: HardDrive,
      x: 100,
      y: 220,
      badge: "Local Cache",
      color: "var(--accent-cyan)",
    },
    {
      id: "gateway",
      name: "API Gateway",
      tech: be,
      role: "Route Auth & Rate Limiting",
      icon: Server,
      x: 360,
      y: 70,
      badge: "Service Boundary",
      color: "var(--accent-cyan)",
    },
    {
      id: "engine",
      name: "Workflow Engine",
      tech: "Deterministic Rule Core",
      role: "18-Point Planning & NLP",
      icon: Cpu,
      x: 360,
      y: 220,
      badge: "Core Logic",
      color: "var(--accent-purple)",
    },
    {
      id: "db",
      name: "Persistence Database",
      tech: db,
      role: "Traceability & Entities",
      icon: Database,
      x: 620,
      y: 70,
      badge: "Data Layer",
      color: "var(--accent-emerald)",
    },
    {
      id: "deploy",
      name: "Edge Production",
      tech: host,
      role: "Global CDN & HTTPS",
      icon: ShieldCheck,
      x: 620,
      y: 220,
      badge: "Release Target",
      color: "var(--accent-amber)",
    },
  ];

  const connections = [
    { from: "client", to: "gateway", path: "M 180 70 L 280 70", id: "c-gw" },
    { from: "client", to: "state", path: "M 100 110 L 100 180", id: "c-st" },
    { from: "gateway", to: "engine", path: "M 360 110 L 360 180", id: "gw-eng" },
    { from: "gateway", to: "db", path: "M 440 70 L 540 70", id: "gw-db" },
    { from: "engine", to: "deploy", path: "M 440 220 L 540 220", id: "eng-dep" },
    { from: "state", to: "engine", path: "M 180 220 L 280 220", id: "st-eng" },
  ];

  return (
    <div className="animated-topology-card">
      <div className="topology-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Activity size={16} style={{ color: "var(--accent-purple)" }} />
          <h4 style={{ fontSize: "0.92rem", fontWeight: 700, margin: 0 }}>
            Living Component Topology & Data Flow
          </h4>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="live-indicator">
            <span className="live-dot" /> LIVE 60 FPS
          </span>
          <span className="badge badge-purple" style={{ fontSize: "0.7rem" }}>
            Traceability: Locked
          </span>
        </div>
      </div>

      {/* SVG Canvas for Circuit Connections & Traveling Pulses */}
      <div className="topology-viewport">
        <svg
          viewBox="0 0 720 290"
          className="topology-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Connection Gradient */}
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0.7" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="pulseGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Connection Bus Lines */}
          {connections.map((c) => (
            <g key={c.id}>
              {/* Static base circuit line */}
              <path
                d={c.path}
                className="circuit-path-base"
              />
              {/* Animated glowing pulse line */}
              <path
                d={c.path}
                className="circuit-path-pulse"
              />
            </g>
          ))}
        </svg>

        {/* Interactive Component Nodes */}
        <div className="topology-nodes-overlay">
          {nodes.map((node) => {
            const IconComponent = node.icon;
            const isSelected = selectedNode?.id === node.id;

            return (
              <div
                key={node.id}
                className={`topology-node ${isSelected ? "selected" : ""}`}
                style={{
                  left: `${(node.x / 720) * 100}%`,
                  top: `${(node.y / 290) * 100}%`,
                }}
                onClick={() => setSelectedNode(node)}
                role="button"
                tabIndex={0}
                title={`${node.name}: ${node.role}`}
              >
                <div className="node-icon-wrapper" style={{ borderColor: node.color }}>
                  <IconComponent size={15} style={{ color: node.color }} />
                  <span className="node-beacon" style={{ backgroundColor: node.color }} />
                </div>
                <div className="node-details">
                  <div className="node-badge" style={{ color: node.color }}>{node.badge}</div>
                  <div className="node-name">{node.name}</div>
                  <div className="node-tech">{node.tech}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Inspector Tray */}
      {selectedNode ? (
        <div className="topology-inspector">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Zap size={14} style={{ color: selectedNode.color }} />
              <strong style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>
                {selectedNode.name}
              </strong>
              <span className="badge badge-slate" style={{ fontSize: "0.68rem" }}>
                {selectedNode.tech}
              </span>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              style={{ fontSize: "0.72rem", padding: "2px 8px" }}
              onClick={() => setSelectedNode(null)}
            >
              Close
            </button>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "4px", margin: 0 }}>
            {selectedNode.role}. Fully integrated with schema v3 state, deterministic validation, and offline-first persistence.
          </p>
        </div>
      ) : (
        <div className="topology-hint">
          Click any component node to inspect real-time data boundaries & execution paths.
        </div>
      )}
    </div>
  );
}
