"use client";

import { useCallback, useEffect, useRef } from "react";

// ── Config ─────────────────────────────────────────────────────────
/** Base opacity of the dust haze layer. */
const DUST_OPACITY = 0.5;
/** Dust tint colour (warm sand). */
const DUST_R = 175;
const DUST_G = 152;
const DUST_B = 118;
/** Radius of the mouse clearing area (CSS px). */
const CLEAR_RADIUS = 40;
/** Per-frame decay multiplier for clearing strength (closer to 1 = slower return). */
const CLEAR_DECAY = 0.955;
/** Max trail positions kept. */
const TRAIL_LENGTH = 20;
/** Size of the generated noise texture (px). Bigger = less repetition. */
const NOISE_SIZE = 512;
/** Speed of the dust drift – multiplied by elapsed time. */
const DRIFT_SPEED_X = 12;
const DRIFT_SPEED_Y = 8;

// ── Noise texture ──────────────────────────────────────────────────

/** Build a tileable noise sprite at NOISE_SIZE² in the dust colour. */
function buildNoiseTexture(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = NOISE_SIZE;
  c.height = NOISE_SIZE;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(NOISE_SIZE, NOISE_SIZE);
  const d = img.data;

  for (let i = 0; i < d.length; i += 4) {
    // Random alpha gives organic patchiness; colour is constant.
    const a = Math.random();
    d[i] = DUST_R;
    d[i + 1] = DUST_G;
    d[i + 2] = DUST_B;
    d[i + 3] = Math.floor(a * a * 255); // squared for bias toward transparency
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

// ── Trail point ────────────────────────────────────────────────────

interface Pt {
  x: number;
  y: number;
  s: number; // strength 0-1
}

// ── Component ──────────────────────────────────────────────────────

export function DustOverlay({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noiseRef = useRef<HTMLCanvasElement | null>(null);
  const trailRef = useRef<Pt[]>([]);
  const mouseRef = useRef({ x: -1, y: -1, inside: false });
  const animRef = useRef(0);
  const t0Ref = useRef(0);

  // ── Mouse handlers (attached to parent) ──
  const onMove = useCallback((e: MouseEvent) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      inside: true,
    };
  }, []);

  const onLeave = useCallback(() => {
    mouseRef.current.inside = false;
  }, []);

  // ── Main loop ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    // Build noise once
    if (!noiseRef.current) noiseRef.current = buildNoiseTexture();

    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);

    t0Ref.current = performance.now();

    const tick = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const dpr = window.devicePixelRatio;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const elapsed = (performance.now() - t0Ref.current) / 1000;
      const noise = noiseRef.current!;

      // ── 1. Draw drifting dust ──
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = DUST_OPACITY;
      ctx.imageSmoothingEnabled = true;

      // Tile the noise with a slow drift so it feels alive
      const ox = (elapsed * DRIFT_SPEED_X) % NOISE_SIZE;
      const oy = (elapsed * DRIFT_SPEED_Y) % NOISE_SIZE;

      // Draw 2×2 tiles offset by drift, covering viewport
      const pat = ctx.createPattern(noise, "repeat");
      if (pat) {
        ctx.save();
        ctx.translate(-ox, -oy);
        ctx.fillStyle = pat;
        ctx.fillRect(ox, oy, w, h);
        ctx.restore();
      }

      ctx.globalAlpha = 1;

      // ── 2. Update trail ──
      const trail = trailRef.current;
      const mouse = mouseRef.current;

      if (mouse.inside) {
        // Only push if cursor actually moved
        const last = trail[0];
        if (
          !last ||
          Math.abs(last.x - mouse.x) > 2 ||
          Math.abs(last.y - mouse.y) > 2
        ) {
          trail.unshift({ x: mouse.x, y: mouse.y, s: 1 });
        }
      }

      // Decay + prune
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i]!.s *= CLEAR_DECAY;
        if (trail[i]!.s < 0.005) trail.splice(i, 1);
      }
      while (trail.length > TRAIL_LENGTH) trail.pop();

      // ── 3. Erase dust along trail ──
      if (trail.length > 0) {
        ctx.globalCompositeOperation = "destination-out";

        for (const p of trail) {
          const r = CLEAR_RADIUS * (0.6 + p.s * 0.4);
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
          g.addColorStop(0, `rgba(255,255,255,${(p.s * 0.85).toFixed(3)})`);
          g.addColorStop(0.45, `rgba(255,255,255,${(p.s * 0.35).toFixed(3)})`);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalCompositeOperation = "source-over";
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animRef.current);
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [active, onMove, onLeave]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
