"use client";

import { parseAsFloat, useQueryState } from "nuqs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DustOverlay } from "./dust-overlay";
import { SvgLoadingIndicator } from "./svg-loading-indicator";

const TOTAL_FRAMES = 150;

// ── Grain config ───────────────────────────────────────────────────
/** First frame (1-based) where the grain overlay activates. */
const GRAIN_START_FRAME = 77;
/** Opacity of the grain layer (0 = invisible, 1 = full noise). */
const GRAIN_OPACITY = 0.045;
/** Scale of the noise texture — higher = coarser grain. */
const GRAIN_SCALE = 2;

function getFrameSrc(index: number): string {
  const padded = String(index).padStart(4, "0");
  return `/frames/frame_${padded}.jpg`;
}

/**
 * Creates a reusable offscreen canvas filled with random greyscale noise.
 */
function createGrainTexture(w: number, h: number): HTMLCanvasElement {
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const ctx = off.getContext("2d")!;
  const imageData = ctx.createImageData(w, h);
  const d = imageData.data;

  for (let i = 0; i < d.length; i += 4) {
    const v = Math.random() * 255;
    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v;
    d[i + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
  return off;
}

// ── Stats counter config ─────────────────────────────────────────
const STATS_DATA = [
  { label: "Oxygen levels", target: 5.9, suffix: "" },
  { label: "Chemical pollutants (1)", target: 2.1, suffix: "" },
  { label: "Humidity (2)", target: 52.0, suffix: "%" },
  { label: "Particle pollution (3)", target: 10.0, suffix: "" },
  { label: "Pollen (4)", target: 0.2, suffix: "" },
] as const;

const COUNTER_DURATION = 2300; // ms
const HERO_LINE1_DELAY = 0; // ms after mount
const HERO_LINE2_DELAY = 300; // ms after mount (300ms stagger)
const HERO_FADE_DURATION = 700; // ms

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// ── Scroll-driven line animation ──────────────────────────────────
/**
 * Returns per-line inline style props (opacity, filter, transform) derived
 * entirely from scroll progress — no GSAP needed. Reversible by design.
 *
 * @param progress    Global scroll 0-1
 * @param enterStart  Progress at which this line begins entering
 * @param fullStart   Progress at which line is fully visible
 * @param fullEnd     Progress at which line begins exiting
 * @param exitEnd     Progress at which line is fully gone
 * @param lineIndex   0-based line index within the block
 * @param _totalLines Reserved for future stagger variants
 */
function getScrollLineStyle(
  progress: number,
  enterStart: number,
  fullStart: number,
  fullEnd: number,
  exitEnd: number,
  lineIndex: number,
  _totalLines: number,
): React.CSSProperties {
  // Enter stagger: each subsequent line starts slightly later
  const enterStagger = lineIndex * 0.015;
  const lineEnterStart = enterStart + enterStagger;
  const lineFullStart = Math.min(fullStart + enterStagger, fullStart + 0.03);

  // Exit stagger: top line exits first (same order as enter)
  const exitStagger = lineIndex * 0.01;
  const lineFullEnd = fullEnd + exitStagger;
  const lineExitEnd = exitEnd + exitStagger;

  // ── Before enter ──
  if (progress <= lineEnterStart) {
    return {
      opacity: 0,
      filter: "blur(6px)",
      transform: "translateY(12px)",
      willChange: "opacity, filter, transform",
    };
  }

  // ── Entering ──
  if (progress < lineFullStart) {
    const t = (progress - lineEnterStart) / (lineFullStart - lineEnterStart);
    const e = easeOutCubic(t);
    return {
      opacity: e,
      filter: `blur(${6 * (1 - e)}px)`,
      transform: `translateY(${12 * (1 - e)}px)`,
      willChange: "opacity, filter, transform",
    };
  }

  // ── Fully visible ──
  if (progress <= lineFullEnd) {
    return {
      opacity: 1,
      filter: "blur(0px)",
      transform: "translateY(0px)",
    };
  }

  // ── Exiting ──
  if (progress < lineExitEnd) {
    const t = (progress - lineFullEnd) / (lineExitEnd - lineFullEnd);
    const e = easeOutCubic(t);
    return {
      opacity: 1 - e,
      filter: `blur(${8 * e}px)`,
      transform: `translateY(${-20 * e}px)`,
      willChange: "opacity, filter, transform",
    };
  }

  // ── After exit ──
  return {
    opacity: 0,
    filter: "blur(8px)",
    transform: "translateY(-20px)",
  };
}

// ── Hero text exit only (entry is CSS-animated on mount) ──────────
function getHeroLineExitStyle(
  progress: number,
  lineIndex: number,
): React.CSSProperties {
  // Exit window: 0.18 – 0.26, with slight stagger per line
  const exitStart = 0.18 + lineIndex * 0.01;
  const exitEnd = 0.26 + lineIndex * 0.01;

  if (progress <= exitStart) {
    // Still in CSS-animation territory — let heroFadeIn handle opacity
    return {};
  }

  if (progress < exitEnd) {
    const t = (progress - exitStart) / (exitEnd - exitStart);
    const e = easeOutCubic(t);
    return {
      opacity: 1 - e,
      filter: `blur(${8 * e}px)`,
      transform: `translateY(${-20 * e}px)`,
      // Override the CSS animation so JS takes over
      animation: "none",
    };
  }

  return {
    opacity: 0,
    filter: "blur(8px)",
    transform: "translateY(-20px)",
    animation: "none",
  };
}

export function ScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const grainRef = useRef<HTMLCanvasElement | null>(null);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [loaded, setLoaded] = useState(false);

  // ── Counter animation state ──
  const [counterValues, setCounterValues] = useState<number[]>(
    () => STATS_DATA.map(() => 0),
  );
  const counterRafRef = useRef<number>(0);
  const counterStartRef = useRef<number | null>(null);

  // Start counter animation on mount
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (counterStartRef.current === null) counterStartRef.current = timestamp;
      const elapsed = timestamp - counterStartRef.current;
      const t = Math.min(1, elapsed / COUNTER_DURATION);
      const eased = easeOutCubic(t);

      setCounterValues(STATS_DATA.map((s) => eased * s.target));

      if (t < 1) {
        counterRafRef.current = requestAnimationFrame(animate);
      }
    };

    counterRafRef.current = requestAnimationFrame(animate);
    return () => {
      if (counterRafRef.current) cancelAnimationFrame(counterRafRef.current);
    };
  }, []);

  // ?scrollProgress=0.5 overrides scroll-derived progress
  const [urlProgress] = useQueryState("scrollProgress", parseAsFloat);
  const hasUrlProgress =
    urlProgress !== null && urlProgress >= 0 && urlProgress <= 1;
  const [scrollProgress, setScrollProgress] = useState(0);
  const progress = hasUrlProgress ? urlProgress : scrollProgress;

  // Preload all frame images
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setLoaded(true);
          drawFrame(0);
        }
      };
      images.push(img);
    }

    imagesRef.current = images;
  }, []);

  const getGrain = useCallback((w: number, h: number) => {
    const gw = Math.ceil(w / GRAIN_SCALE);
    const gh = Math.ceil(h / GRAIN_SCALE);
    grainRef.current = createGrainTexture(gw, gh);
    return grainRef.current;
  }, []);

  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const img = imagesRef.current[frameIndex];
      if (!canvas || !ctx || !img) return;

      const dpr = window.devicePixelRatio;
      const cw = canvas.offsetWidth * dpr;
      const ch = canvas.offsetHeight * dpr;
      canvas.width = cw;
      canvas.height = ch;

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;
      let sw = img.naturalWidth;
      let sh = img.naturalHeight;
      let sx = 0;
      let sy = 0;

      if (imgRatio > canvasRatio) {
        sw = img.naturalHeight * canvasRatio;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / canvasRatio;
        sy = (img.naturalHeight - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);

      if (frameIndex >= GRAIN_START_FRAME - 1) {
        const grain = getGrain(cw, ch);
        ctx.save();
        ctx.globalAlpha = GRAIN_OPACITY;
        ctx.drawImage(grain, 0, 0, cw, ch);
        ctx.restore();
      }
    },
    [getGrain],
  );

  // Update canvas frame on scroll
  useEffect(() => {
    if (!loaded) return;
    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 1))),
    );
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      drawFrame(frameIndex);
    }
  }, [progress, loaded, drawFrame]);

  // Draw first frame once loaded
  useEffect(() => {
    if (loaded) drawFrame(currentFrameRef.current);
  }, [loaded, drawFrame]);

  // Scroll handler (disabled when URL provides progress)
  useEffect(() => {
    if (hasUrlProgress) return;

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const scrollableHeight = container.offsetHeight - window.innerHeight;
        const scrolled = -rect.top;
        setScrollProgress(
          Math.max(0, Math.min(1, scrolled / scrollableHeight)),
        );
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hasUrlProgress]);

  // ── Derived animation values ──────────────────────────────────────

  const scrollIndicatorOpacity =
    progress < 0.05 ? 1 : Math.max(0, 1 - (progress - 0.05) / 0.05);
  const sidebarOpacity = 1;

  // Rounded corners only appear near the end of the video section
  const cornerRadius =
    progress < 0.85 ? 0 : Math.min(40, ((progress - 0.85) / 0.1) * 40);

  // ── Background color blend: video → cream (next section) ──────
  // Start blending at 75% scroll, fully cream by 95%
  const blendStart = 0.75;
  const blendEnd = 0.95;
  const blendT = progress <= blendStart ? 0
    : progress >= blendEnd ? 1
    : easeOutCubic((progress - blendStart) / (blendEnd - blendStart));
  const blendOpacity = blendT;

  // Text 1 hero lines — entry via CSS, exit via scroll
  const heroLine1Style = getHeroLineExitStyle(progress, 0);
  const heroLine2Style = getHeroLineExitStyle(progress, 1);

  // Text 2 lines — "You spend 90%..." — enters 0.24, full 0.32, exits 0.52–0.58
  const text2Lines = [
    "You spend 90% of your life indoors. Your",
    "home. Your office. Your car. Your gym.",
    "Breathing 15,000 litres of air. Every day.",
  ].map((_line, i) =>
    getScrollLineStyle(progress, 0.24, 0.32, 0.52, 0.58, i, 3),
  );

  // Text 3 lines — "Air isn't neutral..." — enters 0.60, full 0.66, stays until end
  const text3Lines = [
    "Air isn\u2019t neutral. When it stagnates, mold and",
    "dust multiply, clouding your mind, draining",
    "your body, and affecting your health.",
  ].map((_line, i) =>
    getScrollLineStyle(progress, 0.6, 0.66, 1.1, 1.2, i, 3),
  );

  // Text 2 visible at all if any line has opacity > 0
  const text2Visible = text2Lines.some((s) => (s.opacity as number) > 0);
  const text3Visible = text3Lines.some((s) => (s.opacity as number) > 0);

  return (
    <div ref={containerRef} className="relative" style={{ height: "800vh" }}>
      {/* Keyframe injected inline to avoid Turbopack/Windows nul-device CSS bug */}
      <style>{`@keyframes heroFadeIn{from{opacity:0}to{opacity:1}}`}</style>
      {/* Sticky viewport */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ borderRadius: `0 0 ${cornerRadius}px ${cornerRadius}px` }}
      >
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ objectFit: "cover" }}
        />

        {/* Dust haze overlay */}
        <DustOverlay
          active={
            loaded &&
            Math.floor(progress * (TOTAL_FRAMES - 1)) >= GRAIN_START_FRAME - 1
          }
        />

        {/* Loading indicator */}
        {!loaded && <SvgLoadingIndicator />}

        {/* ── Text overlay 1: Hero tagline ─────────────────────────────
            Entry: CSS animation on mount (heroFadeIn keyframes)
            Exit:  scroll-driven blur + fade + translateY           */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          <p
            className="text-center font-sans font-normal"
            style={{
              fontSize: "28px",
              lineHeight: "32.2px",
              letterSpacing: "-0.84px",
              color: "rgb(77, 132, 149)",
              maxWidth: "540px",
            }}
          >
            <span
              style={{
                display: "block",
                opacity: 0,
                animation: `heroFadeIn ${HERO_FADE_DURATION}ms ease-out ${HERO_LINE1_DELAY}ms forwards`,
                ...heroLine1Style,
              }}
            >
              Optimizing every breath for better health
            </span>
            <span
              style={{
                display: "block",
                opacity: 0,
                animation: `heroFadeIn ${HERO_FADE_DURATION}ms ease-out ${HERO_LINE2_DELAY}ms forwards`,
                ...heroLine2Style,
              }}
            >
              and longer life
            </span>
          </p>
        </div>

        {/* ── Text overlay 2: Indoors / 90% ────────────────────────────
            Fully scroll-driven: blur(8px)+opacity(0)+y(30px) → sharp  */}
        {text2Visible && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
            <p
              className="text-center font-sans font-normal"
              style={{
                fontSize: "28px",
                lineHeight: "32.2px",
                letterSpacing: "-0.84px",
                color: "rgb(77, 132, 149)",
              }}
            >
              {[
                "You spend 90% of your life indoors. Your",
                "home. Your office. Your car. Your gym.",
                "Breathing 15,000 litres of air. Every day.",
              ].map((line, i) => (
                <span
                  key={i}
                  style={{
                    display: "block",
                    transition:
                      "opacity 0.05s linear, filter 0.05s linear, transform 0.05s linear",
                    ...text2Lines[i],
                  }}
                >
                  {line}
                </span>
              ))}
            </p>
          </div>
        )}

        {/* ── Text overlay 3: Air stagnation ───────────────────────────
            Fully scroll-driven: same blur+fade+translateY pattern     */}
        {text3Visible && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
            <p
              className="text-center font-sans font-normal"
              style={{
                fontSize: "28px",
                lineHeight: "32.2px",
                letterSpacing: "-0.84px",
                color: "rgb(77, 132, 149)",
                maxWidth: "560px",
              }}
            >
              {[
                "Air isn\u2019t neutral. When it stagnates, mold and",
                "dust multiply, clouding your mind, draining",
                "your body, and affecting your health.",
              ].map((line, i) => (
                <span
                  key={i}
                  style={{
                    display: "block",
                    transition:
                      "opacity 0.05s linear, filter 0.05s linear, transform 0.05s linear",
                    ...text3Lines[i],
                  }}
                >
                  {line}
                </span>
              ))}
            </p>
          </div>
        )}

        {/* Air quality sidebar */}
        <div
          className="absolute bottom-10 left-6 md:left-8"
          style={{ opacity: sidebarOpacity }}
        >
          <div
            className="grid items-baseline"
            style={{
              gridTemplateColumns: "auto 50px",
              gap: "10px 16px",
            }}
          >
            {STATS_DATA.map((item, i) => (
              <React.Fragment key={item.label}>
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: "12px",
                    lineHeight: "14.4px",
                    letterSpacing: "-0.12px",
                    color: "rgb(247, 248, 247)",
                  }}
                >
                  {item.label}
                </span>
                <span
                  className="font-sans"
                  style={{
                    fontSize: "12px",
                    lineHeight: "14.4px",
                    letterSpacing: "-0.24px",
                    color: "rgba(255, 251, 235, 0.7)",
                    fontWeight: "500",
                  }}
                >
                  {(counterValues[i] ?? 0).toFixed(1)}
                  {item.suffix}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <p
            className="font-mono uppercase text-white"
            style={{ fontSize: "14px", letterSpacing: "-0.14px" }}
          >
            SCROLL
          </p>
        </div>

        {/* ── Color blend overlay: smooth transition to next section ── */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(255,255,255,0.05) 0%, rgba(222,161,122,0.06) 8.84%, rgba(160,82,32,0.1) 100%), rgb(252, 246, 243)",
            opacity: blendOpacity,
            willChange: "opacity",
          }}
        />
      </div>
    </div>
  );
}
