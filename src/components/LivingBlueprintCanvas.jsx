import React, { useEffect, useRef } from "react";

/**
 * LivingBlueprintCanvas
 *
 * Implements BuildFlow AI's signature dual-personality Living Canvas:
 * 1. LIGHT MODE (Reference 1): Architectural Blueprint
 *    - Warm cream canvas, fine lavender & warm champagne wireframes
 *    - Isometric floor plans, technical dimension markers, vertical coordinate rays
 *    - Glowing copper/warm champagne beacon beads and traveling pulses
 *
 * 2. DARK MODE (Reference 2): Purple Technology Network
 *    - Deep charcoal canvas, futuristic isometric component blocks
 *    - Glowing purple circuit paths, elevated server nodes with illuminated top caps
 *    - Glowing purple and cyan light pulses traveling along isometric buses
 *
 * Runs continuously at 60 FPS, loops seamlessly, adapts to resize and theme toggle,
 * supports smooth crossfade between themes, and respects prefers-reduced-motion.
 */

const COS30 = 0.8660254; // Math.cos(Math.PI / 6)
const SIN30 = 0.5;       // Math.sin(Math.PI / 6)

function toIso(x, y, z, originX, originY, scale = 1) {
  const sx = originX + (x - y) * COS30 * scale;
  const sy = originY + (x + y) * SIN30 * scale - z * scale;
  return { x: sx, y: sy };
}

export default function LivingBlueprintCanvas({ theme = "dark", height = "100%" }) {
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

    // Theme crossfade tracking
    let currentMode = document.documentElement.getAttribute("data-theme") || theme || "dark";
    let transitionVal = currentMode === "light" ? 1 : 0; // 0 = dark, 1 = light

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // -------------------------------------------------------------
    // DATA STRUCTURES FOR ARCHITECTURAL BLUEPRINT (LIGHT MODE)
    // -------------------------------------------------------------
    // Architectural building rooms/modules in isometric coordinates (x, y, z, w, d, h)
    const ARCH_MODULES = [
      // Central engineering wing
      { x: -140, y: -60, z: 0, w: 120, d: 70, h: 22, label: "01 BRIEF INTAKE", elev: "+0.00" },
      { x: 0, y: -60, z: 0, w: 140, d: 80, h: 36, label: "02 REQUIREMENTS CORE", elev: "+3.20" },
      { x: 160, y: -40, z: 0, w: 100, d: 90, h: 28, label: "03 ARCHITECTURE TOPOLOGY", elev: "+2.40" },
      // Secondary wings
      { x: -100, y: 30, z: 0, w: 90, d: 80, h: 18, label: "04 SPRINT EXECUTION", elev: "+1.20" },
      { x: 10, y: 40, z: 0, w: 120, d: 70, h: 26, label: "05 VERIFICATION LAB", elev: "+2.80" },
      { x: 150, y: 70, z: 0, w: 90, d: 60, h: 20, label: "06 DELIVER & SHIP", elev: "+1.80" },
      // Traceability bridge
      { x: -30, y: -130, z: 0, w: 180, d: 50, h: 14, label: "TRACEABILITY MATRIX", elev: "+0.80" },
    ];

    // Vertical beacon poles rising from junctions (as in Reference Image 1)
    const ARCH_BEACONS = [
      { x: -140, y: -60, height: 75, phase: 0 },
      { x: -20, y: -60, height: 95, phase: 1.2 },
      { x: 140, y: -60, height: 110, phase: 2.5 },
      { x: 260, y: -40, height: 85, phase: 3.8 },
      { x: -10, y: 40, height: 90, phase: 4.7 },
      { x: 130, y: 40, height: 105, phase: 1.8 },
      { x: 240, y: 70, height: 80, phase: 3.1 },
      { x: 50, y: -130, height: 65, phase: 0.9 },
    ];

    // Blueprint pathway edges for traveling light pulses
    const ARCH_PATHS = [
      { from: { x: -140, y: -60, z: 22 }, to: { x: -20, y: -60, z: 22 } },
      { from: { x: 0, y: -60, z: 36 }, to: { x: 140, y: -60, z: 36 } },
      { from: { x: 140, y: -60, z: 28 }, to: { x: 260, y: -40, z: 28 } },
      { from: { x: -10, y: 40, z: 26 }, to: { x: 130, y: 40, z: 26 } },
      { from: { x: 130, y: 40, z: 20 }, to: { x: 240, y: 70, z: 20 } },
      { from: { x: 0, y: -60, z: 36 }, to: { x: 10, y: 40, z: 26 } },
      { from: { x: -20, y: -60, z: 22 }, to: { x: -100, y: 30, z: 18 } },
    ];

    const ARCH_PULSES = ARCH_PATHS.map((p, i) => ({
      ...p,
      progress: (i * 0.22) % 1,
      speed: 0.003 + (i % 3) * 0.0008,
    }));

    // -------------------------------------------------------------
    // DATA STRUCTURES FOR PURPLE TECHNOLOGY NETWORK (DARK MODE)
    // -------------------------------------------------------------
    // Futuristic server blocks and processing cubes (Reference Image 2)
    const TECH_BLOCKS = [
      { x: -160, y: -70, z: 0, w: 45, d: 45, h: 42, color: "#8b5cf6", active: true },
      { x: -90, y: -80, z: 0, w: 50, d: 50, h: 60, color: "#a855f7", active: true },
      { x: -20, y: -65, z: 0, w: 40, d: 40, h: 32, color: "#6366f1", active: false },
      { x: 50, y: -80, z: 0, w: 55, d: 55, h: 75, color: "#c084fc", active: true },
      { x: 130, y: -70, z: 0, w: 45, d: 45, h: 48, color: "#a855f7", active: true },
      { x: 200, y: -60, z: 0, w: 40, d: 40, h: 35, color: "#8b5cf6", active: false },

      // Middle row
      { x: -130, y: 0, z: 0, w: 40, d: 40, h: 36, color: "#8b5cf6", active: false },
      { x: -60, y: 10, z: 0, w: 60, d: 60, h: 80, color: "#e879f9", active: true }, // Main CPU block
      { x: 20, y: 0, z: 0, w: 50, d: 50, h: 52, color: "#a855f7", active: true },
      { x: 90, y: 15, z: 0, w: 45, d: 45, h: 40, color: "#06b6d4", active: true },
      { x: 160, y: 5, z: 0, w: 45, d: 45, h: 44, color: "#8b5cf6", active: false },

      // Lower row
      { x: -100, y: 80, z: 0, w: 45, d: 45, h: 38, color: "#8b5cf6", active: false },
      { x: -30, y: 90, z: 0, w: 50, d: 50, h: 58, color: "#a855f7", active: true },
      { x: 40, y: 80, z: 0, w: 45, d: 45, h: 42, color: "#c084fc", active: true },
      { x: 120, y: 90, z: 0, w: 55, d: 55, h: 68, color: "#a855f7", active: true },
    ];

    // Orthogonal circuit bus connections with right-angle bends
    const TECH_CIRCUITS = [
      { from: { x: -160, y: -50 }, to: { x: -90, y: -50 }, branch: { x: -90, y: 10 } },
      { from: { x: -90, y: -50 }, to: { x: 50, y: -50 }, branch: { x: 50, y: 0 } },
      { from: { x: 50, y: -50 }, to: { x: 130, y: -50 }, branch: { x: 130, y: 10 } },
      { from: { x: -60, y: 40 }, to: { x: 20, y: 40 }, branch: { x: 20, y: 90 } },
      { from: { x: 20, y: 40 }, to: { x: 90, y: 40 }, branch: { x: 90, y: 90 } },
      { from: { x: 90, y: 40 }, to: { x: 160, y: 40 }, branch: null },
      { from: { x: -30, y: 110 }, to: { x: 40, y: 110 }, branch: { x: 40, y: 80 } },
      { from: { x: 40, y: 110 }, to: { x: 120, y: 110 }, branch: null },
      // Vertical cross links
      { from: { x: -60, y: -80 }, to: { x: -60, y: 10 }, branch: null },
      { from: { x: 50, y: -80 }, to: { x: 50, y: 80 }, branch: null },
    ];

    const TECH_PULSES = TECH_CIRCUITS.map((c, i) => ({
      ...c,
      progress: (i * 0.19) % 1,
      speed: 0.0035 + (i % 4) * 0.0007,
      color: i % 3 === 2 ? "#06b6d4" : "#c084fc",
    }));

    // Handle canvas dimensions with Retina DPR
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

    // Subtle mouse parallax
    const handleMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetParallaxX = ((e.clientX - cx) / cx) * 14;
      targetParallaxY = ((e.clientY - cy) / cy) * 10;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Mutation observer for theme changes
    const observer = new MutationObserver(() => {
      currentMode = document.documentElement.getAttribute("data-theme") || "dark";
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let lastTime = performance.now();

    // -------------------------------------------------------------
    // RENDERER 1: ARCHITECTURAL BLUEPRINT (LIGHT MODE)
    // Inspired by Reference Image 1 (Warm Cream, Lavender, Warm Champagne)
    // -------------------------------------------------------------
    const renderArchitecturalBlueprint = (now, originX, originY, scale, alpha) => {
      if (alpha <= 0.001) return;

      ctx.save();
      ctx.globalAlpha = alpha;

      // 1. Isometric Blueprint Technical Grid
      const gridSize = 32;
      const gridExtent = 10;
      ctx.strokeStyle = "rgba(124, 58, 237, 0.045)";
      ctx.lineWidth = 0.8;

      for (let i = -gridExtent; i <= gridExtent; i++) {
        // Grid lines along X
        const pStart = toIso(i * gridSize, -gridExtent * gridSize, 0, originX, originY, scale);
        const pEnd = toIso(i * gridSize, gridExtent * gridSize, 0, originX, originY, scale);
        ctx.beginPath();
        ctx.moveTo(pStart.x, pStart.y);
        ctx.lineTo(pEnd.x, pEnd.y);
        ctx.stroke();

        // Grid lines along Y
        const pStart2 = toIso(-gridExtent * gridSize, i * gridSize, 0, originX, originY, scale);
        const pEnd2 = toIso(gridExtent * gridSize, i * gridSize, 0, originX, originY, scale);
        ctx.beginPath();
        ctx.moveTo(pStart2.x, pStart2.y);
        ctx.lineTo(pEnd2.x, pEnd2.y);
        ctx.stroke();

        // Technical crosshair tick marks at major intersections
        if (i % 3 === 0) {
          const pt = toIso(i * gridSize, 0, 0, originX, originY, scale);
          ctx.strokeStyle = "rgba(180, 83, 9, 0.18)"; // Warm champagne tick
          ctx.beginPath();
          ctx.moveTo(pt.x - 3, pt.y);
          ctx.lineTo(pt.x + 3, pt.y);
          ctx.moveTo(pt.x, pt.y - 3);
          ctx.lineTo(pt.x, pt.y + 3);
          ctx.stroke();
          ctx.strokeStyle = "rgba(124, 58, 237, 0.045)";
        }
      }

      // 2. Architectural Isometric Wireframe Modules
      ARCH_MODULES.forEach((mod) => {
        // Wireframe box with translucent lavender fills and champagne borders
        const p0 = toIso(mod.x, mod.y, mod.z, originX, originY, scale);
        const p1 = toIso(mod.x + mod.w, mod.y, mod.z, originX, originY, scale);
        const p2 = toIso(mod.x + mod.w, mod.y + mod.d, mod.z, originX, originY, scale);
        const p3 = toIso(mod.x, mod.y + mod.d, mod.z, originX, originY, scale);

        const t0 = toIso(mod.x, mod.y, mod.z + mod.h, originX, originY, scale);
        const t1 = toIso(mod.x + mod.w, mod.y, mod.z + mod.h, originX, originY, scale);
        const t2 = toIso(mod.x + mod.w, mod.y + mod.d, mod.z + mod.h, originX, originY, scale);
        const t3 = toIso(mod.x, mod.y + mod.d, mod.z + mod.h, originX, originY, scale);

        // Ground footprint
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fillStyle = "rgba(245, 242, 235, 0.7)";
        ctx.fill();
        ctx.strokeStyle = "rgba(180, 83, 9, 0.16)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Top wireframe plane
        ctx.beginPath();
        ctx.moveTo(t0.x, t0.y);
        ctx.lineTo(t1.x, t1.y);
        ctx.lineTo(t2.x, t2.y);
        ctx.lineTo(t3.x, t3.y);
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.fill();
        ctx.strokeStyle = "rgba(124, 58, 237, 0.28)"; // Delicate lavender wireframe
        ctx.stroke();

        // Vertical pillar edges
        ctx.strokeStyle = "rgba(124, 58, 237, 0.22)";
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

        // Technical dimension / elevation annotation
        if (width > 600) {
          ctx.font = "500 8.5px 'JetBrains Mono', monospace";
          ctx.fillStyle = "rgba(120, 113, 108, 0.75)";
          ctx.textAlign = "left";
          ctx.fillText(`${mod.label} [${mod.elev}]`, t0.x + 4, t0.y - 2);
        }
      });

      // 3. Vertical Measurement Rays & Floating Warm Copper Beacon Beads (Reference Image 1 signature)
      ARCH_BEACONS.forEach((b) => {
        const base = toIso(b.x, b.y, 0, originX, originY, scale);
        const top = toIso(b.x, b.y, b.height, originX, originY, scale);

        // Vertical measurement line
        ctx.save();
        ctx.strokeStyle = "rgba(217, 119, 6, 0.25)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(base.x, base.y);
        ctx.lineTo(top.x, top.y);
        ctx.stroke();
        ctx.restore();

        // Pulsing Warm Copper/Champagne Beacon Bead at Top
        const timeVal = now * 0.002 + b.phase;
        const breath = prefersReducedMotion ? 1 : 1 + Math.sin(timeVal) * 0.25;
        const beadRadius = 3.2 * breath;

        // Soft outer lavender aura
        const aura = ctx.createRadialGradient(top.x, top.y, 0, top.x, top.y, 16);
        aura.addColorStop(0, "rgba(245, 158, 11, 0.45)"); // Warm amber
        aura.addColorStop(0.5, "rgba(139, 92, 246, 0.15)"); // Lavender
        aura.addColorStop(1, "rgba(124, 58, 237, 0)");
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(top.x, top.y, 16, 0, Math.PI * 2);
        ctx.fill();

        // Copper center core
        ctx.fillStyle = "#d97706";
        ctx.beginPath();
        ctx.arc(top.x, top.y, beadRadius, 0, Math.PI * 2);
        ctx.fill();

        // Pinpoint highlight
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(top.x, top.y, beadRadius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Moving Blueprint Light Pulses
      if (!prefersReducedMotion) {
        ARCH_PULSES.forEach((pulse) => {
          pulse.progress += pulse.speed;
          if (pulse.progress >= 1) pulse.progress = 0;

          const pStart = toIso(pulse.from.x, pulse.from.y, pulse.from.z, originX, originY, scale);
          const pEnd = toIso(pulse.to.x, pulse.to.y, pulse.to.z, originX, originY, scale);

          const px = pStart.x + (pEnd.x - pStart.x) * pulse.progress;
          const py = pStart.y + (pEnd.y - pStart.y) * pulse.progress;

          // Copper / lavender traveling packet
          const pGrad = ctx.createRadialGradient(px, py, 0, px, py, 8);
          pGrad.addColorStop(0, "#d97706");
          pGrad.addColorStop(0.5, "rgba(124, 58, 237, 0.4)");
          pGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(px, py, 8, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.restore();
    };

    // -------------------------------------------------------------
    // RENDERER 2: PURPLE TECHNOLOGY NETWORK (DARK MODE)
    // Inspired by Reference Image 2 (Deep Charcoal, Glowing Purple Circuits, 3D Blocks)
    // -------------------------------------------------------------
    const renderPurpleTechNetwork = (now, originX, originY, scale, alpha) => {
      if (alpha <= 0.001) return;

      ctx.save();
      ctx.globalAlpha = alpha;

      // 1. Isometric Circuit Board Grid
      const gridSize = 36;
      const gridExtent = 10;
      ctx.strokeStyle = "rgba(148, 163, 184, 0.05)";
      ctx.lineWidth = 0.8;

      for (let i = -gridExtent; i <= gridExtent; i++) {
        const pStart = toIso(i * gridSize, -gridExtent * gridSize, 0, originX, originY, scale);
        const pEnd = toIso(i * gridSize, gridExtent * gridSize, 0, originX, originY, scale);
        ctx.beginPath();
        ctx.moveTo(pStart.x, pStart.y);
        ctx.lineTo(pEnd.x, pEnd.y);
        ctx.stroke();

        const pStart2 = toIso(-gridExtent * gridSize, i * gridSize, 0, originX, originY, scale);
        const pEnd2 = toIso(gridExtent * gridSize, i * gridSize, 0, originX, originY, scale);
        ctx.beginPath();
        ctx.moveTo(pStart2.x, pStart2.y);
        ctx.lineTo(pEnd2.x, pEnd2.y);
        ctx.stroke();
      }

      // 2. Glowing Purple Circuit Bus Paths (with right-angle bends)
      TECH_CIRCUITS.forEach((c) => {
        const p1 = toIso(c.from.x, c.from.y, 0, originX, originY, scale);
        const p2 = toIso(c.to.x, c.to.y, 0, originX, originY, scale);

        ctx.strokeStyle = "rgba(139, 92, 246, 0.22)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        if (c.branch) {
          const pb = toIso(c.branch.x, c.branch.y, 0, originX, originY, scale);
          ctx.lineTo(pb.x, pb.y);
        }
        ctx.stroke();
      });

      // 3. 3D Isometric Server & Processing Blocks (Reference Image 2 cubes)
      TECH_BLOCKS.forEach((blk) => {
        const p0 = toIso(blk.x, blk.y, blk.z, originX, originY, scale);
        const p1 = toIso(blk.x + blk.w, blk.y, blk.z, originX, originY, scale);
        const p2 = toIso(blk.x + blk.w, blk.y + blk.d, blk.z, originX, originY, scale);
        const p3 = toIso(blk.x, blk.y + blk.d, blk.z, originX, originY, scale);

        const t0 = toIso(blk.x, blk.y, blk.z + blk.h, originX, originY, scale);
        const t1 = toIso(blk.x + blk.w, blk.y, blk.z + blk.h, originX, originY, scale);
        const t2 = toIso(blk.x + blk.w, blk.y + blk.d, blk.z + blk.h, originX, originY, scale);
        const t3 = toIso(blk.x, blk.y + blk.d, blk.z + blk.h, originX, originY, scale);

        // Left Face (Dark Charcoal)
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(t0.x, t0.y);
        ctx.lineTo(t3.x, t3.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fillStyle = "#0e101b";
        ctx.fill();
        ctx.strokeStyle = "rgba(139, 92, 246, 0.18)";
        ctx.stroke();

        // Right Face (Deep Charcoal)
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(t1.x, t1.y);
        ctx.lineTo(t2.x, t2.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.fillStyle = "#141726";
        ctx.fill();
        ctx.strokeStyle = "rgba(139, 92, 246, 0.22)";
        ctx.stroke();

        // Top Face (Illuminated Technology Plate with Bevel)
        ctx.beginPath();
        ctx.moveTo(t0.x, t0.y);
        ctx.lineTo(t1.x, t1.y);
        ctx.lineTo(t2.x, t2.y);
        ctx.lineTo(t3.x, t3.y);
        ctx.closePath();

        if (blk.active) {
          ctx.fillStyle = "#1b1933";
          ctx.fill();
          ctx.strokeStyle = blk.color;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Glowing Top Accent Plate (Reference Image 2 signature)
          const inset = 6;
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
          ctx.shadowBlur = 0; // reset
        } else {
          ctx.fillStyle = "#181a2b";
          ctx.fill();
          ctx.strokeStyle = "rgba(139, 92, 246, 0.3)";
          ctx.stroke();
        }
      });

      // 4. Moving Purple / Cyan Data Pulses along Circuits
      if (!prefersReducedMotion) {
        TECH_PULSES.forEach((pulse) => {
          pulse.progress += pulse.speed;
          if (pulse.progress >= 1) pulse.progress = 0;

          const p1 = toIso(pulse.from.x, pulse.from.y, 0, originX, originY, scale);
          const p2 = toIso(pulse.to.x, pulse.to.y, 0, originX, originY, scale);

          let px = p1.x + (p2.x - p1.x) * pulse.progress;
          let py = p1.y + (p2.y - p1.y) * pulse.progress;

          // Glowing data packet with bright cyan/purple trail
          const pulseGrad = ctx.createRadialGradient(px, py, 0, px, py, 10);
          pulseGrad.addColorStop(0, "#ffffff");
          pulseGrad.addColorStop(0.3, pulse.color);
          pulseGrad.addColorStop(0.7, "rgba(139, 92, 246, 0.4)");
          pulseGrad.addColorStop(1, "rgba(124, 58, 237, 0)");

          ctx.fillStyle = pulseGrad;
          ctx.beginPath();
          ctx.arc(px, py, 10, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.restore();
    };

    // -------------------------------------------------------------
    // MAIN CONTINUOUS ANIMATION LOOP WITH SMOOTH THEME CROSSFADE
    // -------------------------------------------------------------
    const render = (now) => {
      const dt = Math.min(now - lastTime, 64);
      lastTime = now;

      // Parallax smooth interpolation
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;

      // Smooth crossfade between Light (transitionVal -> 1) and Dark (transitionVal -> 0)
      const targetTransition = currentMode === "light" ? 1 : 0;
      transitionVal += (targetTransition - transitionVal) * 0.08;

      ctx.clearRect(0, 0, width, heightPx);

      // Dynamic isometric camera origin and scale
      const originX = width * 0.5 + currentParallaxX;
      const originY = heightPx * 0.45 + currentParallaxY;
      const baseScale = width < 768 ? 0.72 : width < 1200 ? 0.88 : 1.05;

      // Render Architectural Blueprint (Light Mode aesthetic)
      if (transitionVal > 0.01) {
        renderArchitecturalBlueprint(now, originX, originY, baseScale, transitionVal);
      }

      // Render Purple Technology Network (Dark Mode aesthetic)
      if (transitionVal < 0.99) {
        renderPurpleTechNetwork(now, originX, originY, baseScale, 1 - transitionVal);
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
  }, [theme, height]);

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
