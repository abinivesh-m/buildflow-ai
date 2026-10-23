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
 * Supports two display variants:
 * - variant="hero": Renders the rich 3D isometric structures inside the hero container (scrolls with hero, never overlaps FAQs or other pages)
 * - variant="ambient": Renders ultra-subtle ambient technical coordinate grid lines and micro-pulses for the global app shell
 */

const COS30 = 0.8660254; // Math.cos(Math.PI / 6)
const SIN30 = 0.5;       // Math.sin(Math.PI / 6)

function toIso(x, y, z, originX, originY, scale = 1) {
  const sx = originX + (x - y) * COS30 * scale;
  const sy = originY + (x + y) * SIN30 * scale - z * scale;
  return { x: sx, y: sy };
}

export default function LivingBlueprintCanvas({
  theme = "dark",
  variant = "hero", // "hero" | "ambient"
  height = "100%",
}) {
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
    const ARCH_MODULES = [
      { x: -140, y: -60, z: 0, w: 120, d: 70, h: 22, label: "01 BRIEF", elev: "+0.00" },
      { x: 0, y: -60, z: 0, w: 140, d: 80, h: 36, label: "02 REQUIREMENTS", elev: "+3.20" },
      { x: 160, y: -40, z: 0, w: 100, d: 90, h: 28, label: "03 ARCHITECTURE", elev: "+2.40" },
      { x: -100, y: 30, z: 0, w: 90, d: 80, h: 18, label: "04 SPRINT", elev: "+1.20" },
      { x: 10, y: 40, z: 0, w: 120, d: 70, h: 26, label: "05 VERIFY", elev: "+2.80" },
      { x: 150, y: 70, z: 0, w: 90, d: 60, h: 20, label: "06 DELIVER", elev: "+1.80" },
      { x: -30, y: -130, z: 0, w: 180, d: 50, h: 14, label: "TRACEABILITY", elev: "+0.80" },
    ];

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
    const TECH_BLOCKS = [
      { x: -160, y: -70, z: 0, w: 45, d: 45, h: 42, color: "#8b5cf6", active: true },
      { x: -90, y: -80, z: 0, w: 50, d: 50, h: 60, color: "#a855f7", active: true },
      { x: -20, y: -65, z: 0, w: 40, d: 40, h: 32, color: "#6366f1", active: false },
      { x: 50, y: -80, z: 0, w: 55, d: 55, h: 75, color: "#c084fc", active: true },
      { x: 130, y: -70, z: 0, w: 45, d: 45, h: 48, color: "#a855f7", active: true },
      { x: 200, y: -60, z: 0, w: 40, d: 40, h: 35, color: "#8b5cf6", active: false },

      { x: -130, y: 0, z: 0, w: 40, d: 40, h: 36, color: "#8b5cf6", active: false },
      { x: -60, y: 10, z: 0, w: 60, d: 60, h: 80, color: "#e879f9", active: true },
      { x: 20, y: 0, z: 0, w: 50, d: 50, h: 52, color: "#a855f7", active: true },
      { x: 90, y: 15, z: 0, w: 45, d: 45, h: 40, color: "#06b6d4", active: true },
      { x: 160, y: 5, z: 0, w: 45, d: 45, h: 44, color: "#8b5cf6", active: false },

      { x: -100, y: 80, z: 0, w: 45, d: 45, h: 38, color: "#8b5cf6", active: false },
      { x: -30, y: 90, z: 0, w: 50, d: 50, h: 58, color: "#a855f7", active: true },
      { x: 40, y: 80, z: 0, w: 45, d: 45, h: 42, color: "#c084fc", active: true },
      { x: 120, y: 90, z: 0, w: 55, d: 55, h: 68, color: "#a855f7", active: true },
    ];

    const TECH_CIRCUITS = [
      { from: { x: -160, y: -50 }, to: { x: -90, y: -50 }, branch: { x: -90, y: 10 } },
      { from: { x: -90, y: -50 }, to: { x: 50, y: -50 }, branch: { x: 50, y: 0 } },
      { from: { x: 50, y: -50 }, to: { x: 130, y: -50 }, branch: { x: 130, y: 10 } },
      { from: { x: -60, y: 40 }, to: { x: 20, y: 40 }, branch: { x: 20, y: 90 } },
      { from: { x: 20, y: 40 }, to: { x: 90, y: 40 }, branch: { x: 90, y: 90 } },
      { from: { x: 90, y: 40 }, to: { x: 160, y: 40 }, branch: null },
      { from: { x: -30, y: 110 }, to: { x: 40, y: 110 }, branch: { x: 40, y: 80 } },
      { from: { x: 40, y: 110 }, to: { x: 120, y: 110 }, branch: null },
      { from: { x: -60, y: -80 }, to: { x: -60, y: 10 }, branch: null },
      { from: { x: 50, y: -80 }, to: { x: 50, y: 80 }, branch: null },
    ];

    const TECH_PULSES = TECH_CIRCUITS.map((c, i) => ({
      ...c,
      progress: (i * 0.19) % 1,
      speed: 0.0035 + (i % 4) * 0.0007,
      color: i % 3 === 2 ? "#06b6d4" : "#c084fc",
    }));

    // Ambient floating particles (for variant="ambient")
    const AMBIENT_PARTICLES = Array.from({ length: 24 }).map((_, i) => ({
      x: (i * 137.5) % 100,
      y: (i * 83.3) % 100,
      radius: 1 + (i % 3) * 0.6,
      speed: 0.02 + (i % 4) * 0.015,
      phase: i * 0.7,
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

    const handleMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetParallaxX = ((e.clientX - cx) / cx) * 12;
      targetParallaxY = ((e.clientY - cy) / cy) * 8;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const observer = new MutationObserver(() => {
      currentMode = document.documentElement.getAttribute("data-theme") || "dark";
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // -------------------------------------------------------------
    // RENDERER: AMBIENT GLOBAL GRID (FOR APP-SHELL BACKGROUND)
    // Pure, subtle, unobtrusive engineering blueprint atmosphere
    // -------------------------------------------------------------
    const renderAmbientGlobal = (now, isLight) => {
      ctx.clearRect(0, 0, width, heightPx);

      // Fine millimeter grid
      const gridSize = 48;
      ctx.strokeStyle = isLight ? "rgba(124, 58, 237, 0.04)" : "rgba(148, 163, 184, 0.035)";
      ctx.lineWidth = 0.8;

      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, heightPx);
      }
      for (let y = 0; y < heightPx; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Tiny crosshair coordinate ticks
      ctx.strokeStyle = isLight ? "rgba(217, 119, 6, 0.12)" : "rgba(139, 92, 246, 0.15)";
      for (let x = gridSize * 2; x < width; x += gridSize * 4) {
        for (let y = gridSize * 2; y < heightPx; y += gridSize * 4) {
          ctx.beginPath();
          ctx.moveTo(x - 3, y);
          ctx.lineTo(x + 3, y);
          ctx.moveTo(x, y - 3);
          ctx.lineTo(x, y + 3);
          ctx.stroke();
        }
      }

      // Slow floating micro-pulses
      if (!prefersReducedMotion) {
        AMBIENT_PARTICLES.forEach((p) => {
          const px = ((p.x + Math.sin(now * 0.0005 + p.phase) * 5) / 100) * width;
          const py = ((p.y + (now * 0.001 * p.speed * 15) % 100) / 100) * heightPx;

          const alpha = 0.25 + Math.sin(now * 0.002 + p.phase) * 0.15;
          ctx.fillStyle = isLight
            ? `rgba(124, 58, 237, ${alpha * 0.5})`
            : `rgba(168, 85, 247, ${alpha * 0.7})`;
          ctx.beginPath();
          ctx.arc(px, py, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    };

    // -------------------------------------------------------------
    // RENDERER: 3D ISOMETRIC BLUEPRINT (FOR HERO SECTION SHOWCASE)
    // -------------------------------------------------------------
    const renderHero3D = (now) => {
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;

      const targetTransition = currentMode === "light" ? 1 : 0;
      transitionVal += (targetTransition - transitionVal) * 0.08;

      ctx.clearRect(0, 0, width, heightPx);

      // Centered cleanly inside the hero container
      const originX = width * 0.5 + currentParallaxX;
      const originY = heightPx * 0.48 + currentParallaxY;
      const baseScale = width < 600 ? 0.65 : width < 1000 ? 0.82 : 0.98;

      // 1. Light Mode: Architectural Blueprint
      if (transitionVal > 0.01) {
        ctx.save();
        ctx.globalAlpha = transitionVal * 0.88; // Balanced opacity so hero text is crisp

        // Technical Grid
        const gridSize = 32;
        const gridExtent = 8;
        ctx.strokeStyle = "rgba(124, 58, 237, 0.06)";
        ctx.lineWidth = 0.8;

        for (let i = -gridExtent; i <= gridExtent; i++) {
          const pStart = toIso(i * gridSize, -gridExtent * gridSize, 0, originX, originY, baseScale);
          const pEnd = toIso(i * gridSize, gridExtent * gridSize, 0, originX, originY, baseScale);
          ctx.beginPath();
          ctx.moveTo(pStart.x, pStart.y);
          ctx.lineTo(pEnd.x, pEnd.y);
          ctx.stroke();

          const pStart2 = toIso(-gridExtent * gridSize, i * gridSize, 0, originX, originY, baseScale);
          const pEnd2 = toIso(gridExtent * gridSize, i * gridSize, 0, originX, originY, baseScale);
          ctx.beginPath();
          ctx.moveTo(pStart2.x, pStart2.y);
          ctx.lineTo(pEnd2.x, pEnd2.y);
          ctx.stroke();
        }

        // Architectural Wireframe Modules
        ARCH_MODULES.forEach((mod) => {
          const p0 = toIso(mod.x, mod.y, mod.z, originX, originY, baseScale);
          const p1 = toIso(mod.x + mod.w, mod.y, mod.z, originX, originY, baseScale);
          const p2 = toIso(mod.x + mod.w, mod.y + mod.d, mod.z, originX, originY, baseScale);
          const p3 = toIso(mod.x, mod.y + mod.d, mod.z, originX, originY, baseScale);

          const t0 = toIso(mod.x, mod.y, mod.z + mod.h, originX, originY, baseScale);
          const t1 = toIso(mod.x + mod.w, mod.y, mod.z + mod.h, originX, originY, baseScale);
          const t2 = toIso(mod.x + mod.w, mod.y + mod.d, mod.z + mod.h, originX, originY, baseScale);
          const t3 = toIso(mod.x, mod.y + mod.d, mod.z + mod.h, originX, originY, baseScale);

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.closePath();
          ctx.fillStyle = "rgba(244, 240, 232, 0.45)";
          ctx.fill();
          ctx.strokeStyle = "rgba(217, 119, 6, 0.22)";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(t0.x, t0.y);
          ctx.lineTo(t1.x, t1.y);
          ctx.lineTo(t2.x, t2.y);
          ctx.lineTo(t3.x, t3.y);
          ctx.closePath();
          ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
          ctx.fill();
          ctx.strokeStyle = "rgba(124, 58, 237, 0.35)";
          ctx.stroke();

          ctx.strokeStyle = "rgba(124, 58, 237, 0.25)";
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

        // Vertical Beacons & Copper Beads
        ARCH_BEACONS.forEach((b) => {
          const base = toIso(b.x, b.y, 0, originX, originY, baseScale);
          const top = toIso(b.x, b.y, b.height, originX, originY, baseScale);

          ctx.save();
          ctx.strokeStyle = "rgba(217, 119, 6, 0.3)";
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          ctx.moveTo(base.x, base.y);
          ctx.lineTo(top.x, top.y);
          ctx.stroke();
          ctx.restore();

          const breath = prefersReducedMotion ? 1 : 1 + Math.sin(now * 0.002 + b.phase) * 0.2;
          const beadRadius = 3 * breath;

          ctx.fillStyle = "#d97706";
          ctx.beginPath();
          ctx.arc(top.x, top.y, beadRadius, 0, Math.PI * 2);
          ctx.fill();
        });

        // Moving Pulses
        if (!prefersReducedMotion) {
          ARCH_PULSES.forEach((pulse) => {
            pulse.progress += pulse.speed;
            if (pulse.progress >= 1) pulse.progress = 0;

            const pStart = toIso(pulse.from.x, pulse.from.y, pulse.from.z, originX, originY, baseScale);
            const pEnd = toIso(pulse.to.x, pulse.to.y, pulse.to.z, originX, originY, baseScale);

            const px = pStart.x + (pEnd.x - pStart.x) * pulse.progress;
            const py = pStart.y + (pEnd.y - pStart.y) * pulse.progress;

            ctx.fillStyle = "#d97706";
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        ctx.restore();
      }

      // 2. Dark Mode: Purple Technology Network
      if (transitionVal < 0.99) {
        ctx.save();
        ctx.globalAlpha = (1 - transitionVal) * 0.85;

        // Circuit paths
        TECH_CIRCUITS.forEach((c) => {
          const p1 = toIso(c.from.x, c.from.y, 0, originX, originY, baseScale);
          const p2 = toIso(c.to.x, c.to.y, 0, originX, originY, baseScale);

          ctx.strokeStyle = "rgba(139, 92, 246, 0.25)";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          if (c.branch) {
            const pb = toIso(c.branch.x, c.branch.y, 0, originX, originY, baseScale);
            ctx.lineTo(pb.x, pb.y);
          }
          ctx.stroke();
        });

        // 3D Blocks with Illuminated Top Plates
        TECH_BLOCKS.forEach((blk) => {
          const p0 = toIso(blk.x, blk.y, blk.z, originX, originY, baseScale);
          const p1 = toIso(blk.x + blk.w, blk.y, blk.z, originX, originY, baseScale);
          const p2 = toIso(blk.x + blk.w, blk.y + blk.d, blk.z, originX, originY, baseScale);
          const p3 = toIso(blk.x, blk.y + blk.d, blk.z, originX, originY, baseScale);

          const t0 = toIso(blk.x, blk.y, blk.z + blk.h, originX, originY, baseScale);
          const t1 = toIso(blk.x + blk.w, blk.y, blk.z + blk.h, originX, originY, baseScale);
          const t2 = toIso(blk.x + blk.w, blk.y + blk.d, blk.z + blk.h, originX, originY, baseScale);
          const t3 = toIso(blk.x, blk.y + blk.d, blk.z + blk.h, originX, originY, baseScale);

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(t0.x, t0.y);
          ctx.lineTo(t3.x, t3.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.closePath();
          ctx.fillStyle = "#0e101b";
          ctx.fill();
          ctx.strokeStyle = "rgba(139, 92, 246, 0.2)";
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(t1.x, t1.y);
          ctx.lineTo(t2.x, t2.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.closePath();
          ctx.fillStyle = "#141726";
          ctx.fill();
          ctx.strokeStyle = "rgba(139, 92, 246, 0.25)";
          ctx.stroke();

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

            const inset = 5;
            const it0 = toIso(blk.x + inset, blk.y + inset, blk.z + blk.h + 2, originX, originY, baseScale);
            const it1 = toIso(blk.x + blk.w - inset, blk.y + inset, blk.z + blk.h + 2, originX, originY, baseScale);
            const it2 = toIso(blk.x + blk.w - inset, blk.y + blk.d - inset, blk.z + blk.h + 2, originX, originY, baseScale);
            const it3 = toIso(blk.x + inset, blk.y + blk.d - inset, blk.z + blk.h + 2, originX, originY, baseScale);

            ctx.beginPath();
            ctx.moveTo(it0.x, it0.y);
            ctx.lineTo(it1.x, it1.y);
            ctx.lineTo(it2.x, it2.y);
            ctx.lineTo(it3.x, it3.y);
            ctx.closePath();
            ctx.fillStyle = blk.color;
            ctx.shadowColor = blk.color;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = "#161828";
            ctx.fill();
            ctx.strokeStyle = "rgba(139, 92, 246, 0.2)";
            ctx.stroke();
          }
        });

        // Moving Pulses
        if (!prefersReducedMotion) {
          TECH_PULSES.forEach((pulse) => {
            pulse.progress += pulse.speed;
            if (pulse.progress >= 1) pulse.progress = 0;

            const p1 = toIso(pulse.from.x, pulse.from.y, 0, originX, originY, baseScale);
            const p2 = toIso(pulse.to.x, pulse.to.y, 0, originX, originY, baseScale);

            const px = p1.x + (p2.x - p1.x) * pulse.progress;
            const py = p1.y + (p2.y - p1.y) * pulse.progress;

            ctx.fillStyle = pulse.color;
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        ctx.restore();
      }
    };

    // -------------------------------------------------------------
    // ANIMATION TICK
    // -------------------------------------------------------------
    const tick = (now) => {
      if (variant === "ambient") {
        renderAmbientGlobal(now, currentMode === "light");
      } else {
        renderHero3D(now);
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(tick);
      }
    };

    if (prefersReducedMotion) {
      tick(performance.now());
    } else {
      animId = requestAnimationFrame(tick);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
    };
  }, [theme, variant, height]);

  const isHero = variant === "hero";

  return (
    <canvas
      ref={canvasRef}
      className={`living-blueprint-canvas ${isHero ? "canvas-hero" : "canvas-ambient"}`}
      aria-hidden="true"
      style={{
        position: isHero ? "absolute" : "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: isHero ? height : "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
