import React, { useEffect, useRef } from "react";

/**
 * LivingBlueprintCanvas
 *
 * Implements BuildFlow AI's signature dual-personality Living Canvas:
 * 1. LIGHT MODE: Architectural Blueprint
 *    - Warm cream canvas (#faf8f5), delicate lavender & warm champagne wireframes
 *    - Connected engineering architecture nodes (Brief, Requirements, Matrix, Arch, Sprint, Tests, Deliver)
 *    - Floating copper beacons with vertical coordinate rays and traveling pulses
 *
 * 2. DARK MODE: Official Wispr Flow Challenge Tech Network
 *    - Deep matte black canvas (#09090d) with Wispr Coral-Orange (#ff5733) & Purple accents
 *    - Interconnected 3D isometric server blocks with glowing coral top plates
 *    - Connected architecture pipeline nodes with glowing coral-orange light pulses
 *    - Continuous 60 FPS animation, responsive, seamless theme crossfade, zero content overlap
 */

const COS30 = 0.8660254;
const SIN30 = 0.5;

function toIso(x, y, z, originX, originY, scale = 1) {
  const sx = originX + (x - y) * COS30 * scale;
  const sy = originY + (x + y) * SIN30 * scale - z * scale;
  return { x: sx, y: sy };
}

export default function LivingBlueprintCanvas({ theme = "dark" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = null;
    let width = 0;
    let heightPx = 0;
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    let currentMode = document.documentElement.getAttribute("data-theme") || theme || "dark";
    let transitionVal = currentMode === "light" ? 1 : 0; // 0 = dark, 1 = light

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // -------------------------------------------------------------
    // CONNECTED ARCHITECTURE NODES (6 Stages + Traceability + Risk)
    // -------------------------------------------------------------
    const ARCH_NODES = [
      { id: "brief", label: "01 BRIEF", x: -160, y: -90, z: 20, size: 5, color: "#ff5733" },
      { id: "reqs", label: "02 REQUIREMENTS", x: -70, y: -100, z: 32, size: 5.5, color: "#ff5733" },
      { id: "matrix", label: "TRACEABILITY MATRIX", x: 20, y: -110, z: 45, size: 6.5, color: "#ff5733" },
      { id: "arch", label: "03 ARCHITECTURE", x: 130, y: -90, z: 30, size: 5.5, color: "#a855f7" },
      { id: "sprint", label: "04 SPRINT", x: 180, y: -10, z: 25, size: 5, color: "#06b6d4" },
      { id: "tests", label: "05 VERIFICATION", x: 130, y: 80, z: 35, size: 5.5, color: "#10b981" },
      { id: "deploy", label: "06 DELIVER", x: 30, y: 100, z: 40, size: 6, color: "#ff5733" },
      { id: "tdr", label: "TDR LOG", x: -70, y: 80, z: 25, size: 5, color: "#a855f7" },
      { id: "risk", label: "5×5 RISK", x: -150, y: 30, z: 20, size: 5, color: "#f59e0b" },
      { id: "hud", label: "VOICE ENGINE", x: -20, y: -10, z: 50, size: 6, color: "#ff5733" },
    ];

    const NODE_CONNECTIONS = [
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
      ["hud", "deploy"],
    ];

    const NODE_PULSES = NODE_CONNECTIONS.map(([fromId, toId], i) => ({
      fromId,
      toId,
      progress: (i * 0.16) % 1,
      speed: 0.003 + (i % 3) * 0.0008,
      color: i % 2 === 0 ? "#ff5733" : "#a855f7",
    }));

    // -------------------------------------------------------------
    // 3D ISOMETRIC BLOCKS (Reference 2 / Wispr Technology Aesthetic)
    // -------------------------------------------------------------
    const TECH_BLOCKS = [
      { x: -160, y: -70, z: 0, w: 40, d: 40, h: 36, color: "#ff5733", active: true },
      { x: -90, y: -80, z: 0, w: 45, d: 45, h: 54, color: "#ff5733", active: true },
      { x: -20, y: -65, z: 0, w: 35, d: 35, h: 28, color: "#a855f7", active: false },
      { x: 50, y: -80, z: 0, w: 50, d: 50, h: 68, color: "#ff5733", active: true },
      { x: 130, y: -70, z: 0, w: 40, d: 40, h: 42, color: "#a855f7", active: true },
      { x: 190, y: -60, z: 0, w: 35, d: 35, h: 30, color: "#06b6d4", active: false },

      // Middle row
      { x: -130, y: 0, z: 0, w: 35, d: 35, h: 32, color: "#ff5733", active: false },
      { x: -60, y: 10, z: 0, w: 54, d: 54, h: 72, color: "#ff5733", active: true }, // Main Wispr CPU Block
      { x: 20, y: 0, z: 0, w: 45, d: 45, h: 48, color: "#a855f7", active: true },
      { x: 90, y: 15, z: 0, w: 40, d: 40, h: 36, color: "#06b6d4", active: true },

      // Lower row
      { x: -100, y: 80, z: 0, w: 40, d: 40, h: 34, color: "#f59e0b", active: false },
      { x: -30, y: 90, z: 0, w: 45, d: 45, h: 52, color: "#ff5733", active: true },
      { x: 40, y: 80, z: 0, w: 40, d: 40, h: 38, color: "#10b981", active: true },
      { x: 120, y: 90, z: 0, w: 50, d: 50, h: 60, color: "#a855f7", active: true },
    ];

    // -------------------------------------------------------------
    // LIGHT MODE: ARCHITECTURAL WIREFRAME BLUEPRINT MODULES
    // -------------------------------------------------------------
    const ARCH_WIREFRAMES = [
      { x: -150, y: -65, z: 0, w: 110, d: 65, h: 20, label: "01 BRIEF INTAKE" },
      { x: -10, y: -65, z: 0, w: 130, d: 75, h: 32, label: "02 REQUIREMENTS HUB" },
      { x: 150, y: -45, z: 0, w: 95, d: 85, h: 25, label: "03 ARCHITECTURE TOPOLOGY" },
      { x: -90, y: 30, z: 0, w: 85, d: 75, h: 16, label: "04 SPRINT EXECUTION" },
      { x: 15, y: 35, z: 0, w: 110, d: 65, h: 24, label: "05 VERIFICATION LAB" },
      { x: 140, y: 65, z: 0, w: 85, d: 55, h: 18, label: "06 DELIVERY STAGE" },
    ];

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      heightPx = rect.height || window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = heightPx * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetParallaxX = ((e.clientX - cx) / cx) * 14;
      targetParallaxY = ((e.clientY - cy) / cy) * 10;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const observer = new MutationObserver(() => {
      currentMode = document.documentElement.getAttribute("data-theme") || "dark";
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let lastTime = performance.now();

    // -------------------------------------------------------------
    // RENDERER: LIGHT MODE (ARCHITECTURAL BLUEPRINT)
    // -------------------------------------------------------------
    const renderLightBlueprint = (now, originX, originY, scale, alpha) => {
      if (alpha <= 0.001) return;
      ctx.save();
      ctx.globalAlpha = alpha * 0.65; // Balanced opacity so it sits gracefully behind cards

      // 1. Isometric Grid Lines
      const gridSize = 36;
      const gridExtent = 9;
      ctx.strokeStyle = "rgba(124, 58, 237, 0.06)";
      ctx.lineWidth = 0.8;

      for (let i = -gridExtent; i <= gridExtent; i++) {
        const p1 = toIso(i * gridSize, -gridExtent * gridSize, 0, originX, originY, scale);
        const p2 = toIso(i * gridSize, gridExtent * gridSize, 0, originX, originY, scale);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const p3 = toIso(-gridExtent * gridSize, i * gridSize, 0, originX, originY, scale);
        const p4 = toIso(gridExtent * gridSize, i * gridSize, 0, originX, originY, scale);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }

      // 2. Architectural Wireframe Modules
      ARCH_WIREFRAMES.forEach((mod) => {
        const p0 = toIso(mod.x, mod.y, mod.z, originX, originY, scale);
        const p1 = toIso(mod.x + mod.w, mod.y, mod.z, originX, originY, scale);
        const p2 = toIso(mod.x + mod.w, mod.y + mod.d, mod.z, originX, originY, scale);
        const p3 = toIso(mod.x, mod.y + mod.d, mod.z, originX, originY, scale);

        const t0 = toIso(mod.x, mod.y, mod.z + mod.h, originX, originY, scale);
        const t1 = toIso(mod.x + mod.w, mod.y, mod.z + mod.h, originX, originY, scale);
        const t2 = toIso(mod.x + mod.w, mod.y + mod.d, mod.z + mod.h, originX, originY, scale);
        const t3 = toIso(mod.x, mod.y + mod.d, mod.z + mod.h, originX, originY, scale);

        ctx.strokeStyle = "rgba(217, 119, 6, 0.28)"; // Warm champagne edge
        ctx.strokeRect ? null : null;
        ctx.beginPath();
        ctx.moveTo(t0.x, t0.y);
        ctx.lineTo(t1.x, t1.y);
        ctx.lineTo(t2.x, t2.y);
        ctx.lineTo(t3.x, t3.y);
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.fill();
        ctx.strokeStyle = "rgba(124, 58, 237, 0.35)";
        ctx.stroke();

        [
          [p0, t0],
          [p1, t1],
          [p2, t2],
          [p3, t3],
        ].forEach(([b, t]) => {
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(t.x, t.y);
          ctx.stroke();
        });
      });

      // 3. Connected Architecture Nodes & Traveling Pulses
      const nodePos = new Map();
      ARCH_NODES.forEach((n) => {
        const pt = toIso(n.x, n.y, n.z, originX, originY, scale);
        nodePos.set(n.id, pt);
      });

      // Connection lines
      NODE_CONNECTIONS.forEach(([fromId, toId]) => {
        const from = nodePos.get(fromId);
        const to = nodePos.get(toId);
        if (!from || !to) return;
        ctx.strokeStyle = "rgba(124, 58, 237, 0.2)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });

      // Traveling Pulses
      if (!prefersReducedMotion) {
        NODE_PULSES.forEach((p) => {
          p.progress += p.speed;
          if (p.progress >= 1) p.progress = 0;
          const from = nodePos.get(p.fromId);
          const to = nodePos.get(p.toId);
          if (!from || !to) return;
          const px = from.x + (to.x - from.x) * p.progress;
          const py = from.y + (to.y - from.y) * p.progress;

          ctx.fillStyle = "#d97706";
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Nodes
      ARCH_NODES.forEach((n) => {
        const pt = nodePos.get(n.id);
        if (!pt) return;
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "rgba(124, 58, 237, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, n.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#7c3aed";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, n.size * 0.4, 0, Math.PI * 2);
        ctx.fill();

        if (width > 600) {
          ctx.font = "600 8.5px 'JetBrains Mono', monospace";
          ctx.fillStyle = "rgba(75, 79, 88, 0.8)";
          ctx.textAlign = "center";
          ctx.fillText(n.label, pt.x, pt.y + n.size + 8);
        }
      });

      ctx.restore();
    };

    // -------------------------------------------------------------
    // RENDERER: DARK MODE (OFFICIAL WISPR CORAL + 3D TECH BLOCKS)
    // -------------------------------------------------------------
    const renderDarkWisprNetwork = (now, originX, originY, scale, alpha) => {
      if (alpha <= 0.001) return;
      ctx.save();
      ctx.globalAlpha = alpha * 0.75; // Sits smoothly behind cards without visual collision

      // 1. Connected Architecture Network Layer (Requested by user)
      const nodePos = new Map();
      ARCH_NODES.forEach((n) => {
        const pt = toIso(n.x, n.y, n.z, originX, originY, scale);
        nodePos.set(n.id, pt);
      });

      // Circuit connections between nodes
      NODE_CONNECTIONS.forEach(([fromId, toId]) => {
        const from = nodePos.get(fromId);
        const to = nodePos.get(toId);
        if (!from || !to) return;
        ctx.strokeStyle = "rgba(255, 87, 51, 0.22)"; // Wispr Coral Circuit Bus
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });

      // 2. 3D Isometric Server & Processing Blocks (Reference Image 2)
      TECH_BLOCKS.forEach((blk) => {
        const p0 = toIso(blk.x, blk.y, blk.z, originX, originY, scale);
        const p1 = toIso(blk.x + blk.w, blk.y, blk.z, originX, originY, scale);
        const p2 = toIso(blk.x + blk.w, blk.y + blk.d, blk.z, originX, originY, scale);
        const p3 = toIso(blk.x, blk.y + blk.d, blk.z, originX, originY, scale);

        const t0 = toIso(blk.x, blk.y, blk.z + blk.h, originX, originY, scale);
        const t1 = toIso(blk.x + blk.w, blk.y, blk.z + blk.h, originX, originY, scale);
        const t2 = toIso(blk.x + blk.w, blk.y + blk.d, blk.z + blk.h, originX, originY, scale);
        const t3 = toIso(blk.x, blk.y + blk.d, blk.z + blk.h, originX, originY, scale);

        // Left Face
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(t0.x, t0.y);
        ctx.lineTo(t3.x, t3.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fillStyle = "#0c0d15";
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 87, 51, 0.16)";
        ctx.stroke();

        // Right Face
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(t1.x, t1.y);
        ctx.lineTo(t2.x, t2.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.fillStyle = "#121420";
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 87, 51, 0.22)";
        ctx.stroke();

        // Top Face (Illuminated with Official Wispr Coral / Purple)
        ctx.beginPath();
        ctx.moveTo(t0.x, t0.y);
        ctx.lineTo(t1.x, t1.y);
        ctx.lineTo(t2.x, t2.y);
        ctx.lineTo(t3.x, t3.y);
        ctx.closePath();

        if (blk.active) {
          ctx.fillStyle = "#181a28";
          ctx.fill();
          ctx.strokeStyle = blk.color;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Glowing Top Accent Plate (Wispr Coral #ff5733 / Violet)
          const inset = 5;
          const it0 = toIso(blk.x + inset, blk.y + inset, blk.z + blk.h + 2, originX, originY, scale);
          const it1 = toIso(blk.x + blk.w - inset, blk.y + inset, blk.z + blk.h + 2, originX, originY, scale);
          const it2 = toIso(blk.x + blk.w - inset, blk.y + blk.d - inset, blk.z + blk.h + 2, originX, originY, scale);
          const it3 = toIso(blk.x + inset, blk.y + blk.d - inset, blk.z + blk.h + 2, originX, originY, scale);

          ctx.beginPath();
          ctx.moveTo(it0.x, it0.y);
          ctx.lineTo(it1.x, it1.y);
          ctx.lineTo(it2.x, it2.y);
          ctx.lineTo(it3.x, it3.y);
          ctx.closePath();
          ctx.fillStyle = blk.color;
          ctx.shadowColor = blk.color;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = "#141624";
          ctx.fill();
          ctx.strokeStyle = "rgba(255, 87, 51, 0.2)";
          ctx.stroke();
        }
      });

      // 3. Traveling Wispr Coral & Cyan Light Pulses
      if (!prefersReducedMotion) {
        NODE_PULSES.forEach((p) => {
          p.progress += p.speed;
          if (p.progress >= 1) p.progress = 0;
          const from = nodePos.get(p.fromId);
          const to = nodePos.get(p.toId);
          if (!from || !to) return;
          const px = from.x + (to.x - from.x) * p.progress;
          const py = from.y + (to.y - from.y) * p.progress;

          const pGrad = ctx.createRadialGradient(px, py, 0, px, py, 8);
          pGrad.addColorStop(0, "#ffffff");
          pGrad.addColorStop(0.3, p.color);
          pGrad.addColorStop(1, "rgba(255, 87, 51, 0)");
          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 4. Connected Architecture Nodes with Glowing Beacons
      ARCH_NODES.forEach((n) => {
        const pt = nodePos.get(n.id);
        if (!pt) return;

        // Glowing outer aura
        const aura = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 14);
        aura.addColorStop(0, n.color === "#ff5733" ? "rgba(255, 87, 51, 0.6)" : "rgba(168, 85, 247, 0.5)");
        aura.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2);
        ctx.fill();

        // Node disc
        ctx.fillStyle = "#121422";
        ctx.strokeStyle = n.color;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, n.size * 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Pinpoint core
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, n.size * 0.35, 0, Math.PI * 2);
        ctx.fill();

        // Label in clean monospace
        if (width > 600) {
          ctx.font = "600 8.5px 'JetBrains Mono', monospace";
          ctx.fillStyle = "rgba(244, 244, 245, 0.75)";
          ctx.textAlign = "center";
          ctx.fillText(n.label, pt.x, pt.y + n.size + 8);
        }
      });

      ctx.restore();
    };

    // -------------------------------------------------------------
    // MAIN ANIMATION LOOP
    // -------------------------------------------------------------
    const render = (now) => {
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;

      const targetTransition = currentMode === "light" ? 1 : 0;
      transitionVal += (targetTransition - transitionVal) * 0.08;

      ctx.clearRect(0, 0, width, heightPx);

      // Camera coordinates: centered nicely, scaling proportionally to screen
      const originX = width * 0.5 + currentParallaxX;
      const originY = heightPx * 0.5 + currentParallaxY;
      const baseScale = width < 600 ? 0.68 : width < 1200 ? 0.88 : 1.05;

      // Render Light Mode Architectural Blueprint
      if (transitionVal > 0.01) {
        renderLightBlueprint(now, originX, originY, baseScale, transitionVal);
      }

      // Render Dark Mode Official Wispr Technology Network
      if (transitionVal < 0.99) {
        renderDarkWisprNetwork(now, originX, originY, baseScale, 1 - transitionVal);
      }

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
      observer.disconnect();
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="living-blueprint-canvas"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
