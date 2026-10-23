import React, { useEffect, useRef } from "react";

/**
 * LivingBlueprintCanvas
 *
 * Signature Visual Identity: Living Engineering Blueprint
 * Continuous, 60fps lightweight HTML5 canvas rendering an architectural
 * blueprint of interconnected software engineering nodes with travelling
 * purple/lavender light pulses, gentle illumination, and subtle mouse parallax.
 */
export default function LivingBlueprintCanvas({ theme = "dark", density = "normal", height = "100%" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = null;
    let width = 0;
    let heightPx = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Architectural Blueprint System Nodes
    const BLUEPRINT_NODES = [
      { id: "brief", label: "01 BRIEF", rx: 0.12, ry: 0.24, size: 4.5, pulsePhase: 0 },
      { id: "reqs", label: "02 REQUIREMENTS", rx: 0.28, ry: 0.18, size: 5, pulsePhase: 1.2 },
      { id: "matrix", label: "TRACEABILITY", rx: 0.45, ry: 0.32, size: 6, pulsePhase: 2.5 },
      { id: "arch", label: "03 ARCHITECTURE", rx: 0.62, ry: 0.16, size: 5.5, pulsePhase: 3.8 },
      { id: "sprint", label: "04 SPRINT", rx: 0.78, ry: 0.34, size: 5, pulsePhase: 4.7 },
      { id: "tests", label: "05 VERIFY", rx: 0.84, ry: 0.62, size: 5, pulsePhase: 0.9 },
      { id: "deploy", label: "06 DELIVER", rx: 0.66, ry: 0.76, size: 6, pulsePhase: 2.1 },
      { id: "tdr", label: "TDR LOG", rx: 0.42, ry: 0.74, size: 4.5, pulsePhase: 3.4 },
      { id: "risk", label: "5×5 RISK", rx: 0.22, ry: 0.65, size: 4.5, pulsePhase: 5.0 },
      { id: "hud", label: "VOICE HUD", rx: 0.50, ry: 0.52, size: 5, pulsePhase: 1.8 },
      // Micro-satellites for density
      { id: "m1", label: "NLP", rx: 0.18, ry: 0.40, size: 3, pulsePhase: 0.5 },
      { id: "m2", label: "GRAPH", rx: 0.36, ry: 0.46, size: 3.5, pulsePhase: 2.8 },
      { id: "m3", label: "MERMAID", rx: 0.68, ry: 0.42, size: 3.5, pulsePhase: 4.1 },
      { id: "m4", label: "API GATE", rx: 0.74, ry: 0.82, size: 3, pulsePhase: 1.5 },
      { id: "m5", label: "CI/CD", rx: 0.52, ry: 0.88, size: 3, pulsePhase: 3.1 },
    ];

    // Blueprint Connections (Edges)
    const CONNECTIONS = [
      ["brief", "reqs"],
      ["reqs", "matrix"],
      ["matrix", "arch"],
      ["arch", "sprint"],
      ["sprint", "tests"],
      ["tests", "deploy"],
      ["deploy", "tdr"],
      ["tdr", "risk"],
      ["risk", "brief"],
      ["matrix", "hud"],
      ["hud", "sprint"],
      ["brief", "m1"],
      ["m1", "risk"],
      ["matrix", "m2"],
      ["m2", "tdr"],
      ["arch", "m3"],
      ["m3", "sprint"],
      ["deploy", "m4"],
      ["m4", "m5"],
      ["m5", "tdr"],
    ];

    // Moving Data Pulses
    const PULSES = CONNECTIONS.map(([fromId, toId], index) => ({
      fromId,
      toId,
      progress: (index * 0.17) % 1,
      speed: 0.0028 + (index % 5) * 0.0006,
      size: 2.5 + (index % 3) * 0.8,
    }));

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      heightPx = rect.height || (typeof height === "number" ? height : 600);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = heightPx * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse parallax tracking
    const handleMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetParallaxX = ((e.clientX - cx) / cx) * 16;
      targetParallaxY = ((e.clientY - cy) / cy) * 16;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let lastTime = performance.now();

    const render = (now) => {
      const dt = Math.min(now - lastTime, 64);
      lastTime = now;

      // Parallax smooth interpolation
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.04;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.04;

      ctx.clearRect(0, 0, width, heightPx);

      // Determine palette based on theme prop and document element
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || theme || "dark";
      const isLight = currentTheme === "light";

      // Palette Configuration
      const gridLineColor = isLight ? "rgba(124, 58, 237, 0.035)" : "rgba(148, 163, 184, 0.03)";
      const connectionLineColor = isLight
        ? "rgba(124, 58, 237, 0.14)"
        : "rgba(148, 163, 184, 0.16)";
      const connectionLineHighlight = isLight
        ? "rgba(124, 58, 237, 0.35)"
        : "rgba(139, 92, 246, 0.45)";
      const nodeFill = isLight ? "#ffffff" : "#131522";
      const nodeBorder = isLight ? "rgba(124, 58, 237, 0.45)" : "rgba(139, 92, 246, 0.6)";
      const nodeGlow = isLight ? "rgba(124, 58, 237, 0.18)" : "rgba(139, 92, 246, 0.35)";
      const textColor = isLight ? "rgba(87, 83, 78, 0.75)" : "rgba(148, 163, 184, 0.65)";
      const pulseColor = isLight ? "#7c3aed" : "#a855f7";
      const pulseGlow = isLight ? "rgba(124, 58, 237, 0.6)" : "rgba(168, 85, 247, 0.8)";
      const pulseCyan = isLight ? "#0891b2" : "#06b6d4";

      // 1. Subtle Engineering Grid Dots
      const gridSize = width < 600 ? 40 : 36;
      ctx.fillStyle = gridLineColor;
      for (let x = (currentParallaxX * 0.3) % gridSize; x < width; x += gridSize) {
        for (let y = (currentParallaxY * 0.3) % gridSize; y < heightPx; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Compute current screen coordinates of nodes
      const nodeMap = new Map();
      const isMobile = width < 768;
      const nodesToRender = isMobile
        ? BLUEPRINT_NODES.filter((n) => !n.id.startsWith("m"))
        : BLUEPRINT_NODES;

      nodesToRender.forEach((n) => {
        const px = n.rx * width + currentParallaxX;
        const py = n.ry * heightPx + currentParallaxY;
        nodeMap.set(n.id, { ...n, px, py });
      });

      // 2. Draw Architectural Connections (Lines & Circuits)
      CONNECTIONS.forEach(([fromId, toId], idx) => {
        const from = nodeMap.get(fromId);
        const to = nodeMap.get(toId);
        if (!from || !to) return;

        ctx.save();
        ctx.strokeStyle = idx % 3 === 0 ? connectionLineHighlight : connectionLineColor;
        ctx.lineWidth = idx % 4 === 0 ? 1.5 : 1;
        ctx.setLineDash(idx % 2 === 0 ? [] : [4, 4]);

        ctx.beginPath();
        // Subtle orthogonal bend for blueprint look
        const midX = (from.px + to.px) / 2;
        if (idx % 3 === 1) {
          ctx.moveTo(from.px, from.py);
          ctx.lineTo(midX, from.py);
          ctx.lineTo(midX, to.py);
          ctx.lineTo(to.px, to.py);
        } else {
          ctx.moveTo(from.px, from.py);
          ctx.lineTo(to.px, to.py);
        }
        ctx.stroke();
        ctx.restore();
      });

      // 3. Update & Draw Moving Light Pulses (Data Packets)
      if (!prefersReducedMotion) {
        PULSES.forEach((pulse, pIdx) => {
          const from = nodeMap.get(pulse.fromId);
          const to = nodeMap.get(pulse.toId);
          if (!from || !to) return;

          pulse.progress += pulse.speed * (dt / 16.6);
          if (pulse.progress >= 1) {
            pulse.progress = 0;
          }

          // Compute pulse position
          let x, y;
          if (pIdx % 3 === 1) {
            const midX = (from.px + to.px) / 2;
            if (pulse.progress < 0.33) {
              const segP = pulse.progress / 0.33;
              x = from.px + (midX - from.px) * segP;
              y = from.py;
            } else if (pulse.progress < 0.66) {
              const segP = (pulse.progress - 0.33) / 0.33;
              x = midX;
              y = from.py + (to.py - from.py) * segP;
            } else {
              const segP = (pulse.progress - 0.66) / 0.34;
              x = midX + (to.px - midX) * segP;
              y = to.py;
            }
          } else {
            x = from.px + (to.px - from.px) * pulse.progress;
            y = from.py + (to.py - from.py) * pulse.progress;
          }

          // Draw Glowing Pulse with Halo
          ctx.save();
          const pulseG = ctx.createRadialGradient(x, y, 0, x, y, pulse.size * 3.5);
          const activeColor = pIdx % 3 === 2 ? pulseCyan : pulseColor;
          pulseG.addColorStop(0, activeColor);
          pulseG.addColorStop(0.4, pIdx % 3 === 2 ? "rgba(6, 182, 212, 0.4)" : pulseGlow);
          pulseG.addColorStop(1, "rgba(124, 58, 237, 0)");

          ctx.fillStyle = pulseG;
          ctx.beginPath();
          ctx.arc(x, y, pulse.size * 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Intense center core
          ctx.fillStyle = isLight ? "#4c1d95" : "#ffffff";
          ctx.beginPath();
          ctx.arc(x, y, pulse.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // 4. Draw Architectural Blueprint Nodes
      nodesToRender.forEach((node) => {
        const n = nodeMap.get(node.id);
        if (!n) return;

        // Gentle breathing pulsation
        const timeVal = now * 0.0018 + node.pulsePhase;
        const breath = prefersReducedMotion ? 1 : 1 + Math.sin(timeVal) * 0.18;
        const radius = n.size * breath;

        ctx.save();

        // Node Outer Aura
        const aura = ctx.createRadialGradient(n.px, n.py, radius * 0.5, n.px, n.py, radius * 3.5);
        aura.addColorStop(0, nodeGlow);
        aura.addColorStop(1, "rgba(124, 58, 237, 0)");
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(n.px, n.py, radius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Node Main Disc
        ctx.fillStyle = nodeFill;
        ctx.strokeStyle = nodeBorder;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(n.px, n.py, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner Tech Core
        ctx.fillStyle = isLight ? "#7c3aed" : "#a855f7";
        ctx.beginPath();
        ctx.arc(n.px, n.py, radius * 0.45, 0, Math.PI * 2);
        ctx.fill();

        // Node Label (Editorial Mono)
        if (width > 500 && n.label) {
          ctx.font = "600 9px 'JetBrains Mono', monospace";
          ctx.fillStyle = textColor;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(n.label, n.px, n.py + radius + 5);
        }

        ctx.restore();
      });

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    if (prefersReducedMotion) {
      render(performance.now());
    } else {
      animId = requestAnimationFrame(render);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [theme, density, height]);

  return (
    <canvas
      ref={canvasRef}
      className="living-blueprint-canvas"
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: height,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
