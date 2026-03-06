"use client";

import { useEffect, useRef, useState } from "react";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type RGB = [number, number, number];

function lerpRgb(from: RGB, to: RGB, t: number): string {
  return `rgb(${lerp(from[0], to[0], t)}, ${lerp(from[1], to[1], t)}, ${lerp(from[2], to[2], t)})`;
}

const CREAM: RGB = [252, 246, 243];
const GRADIENT_START: RGB = [155, 75, 28]; // #9B4B1C
const GRADIENT_MID: RGB = [200, 116, 51]; // #C87433
const GRADIENT_END: RGB = [223, 155, 75]; // #DF9B4B
const TEXT_DARK: RGB = [105, 97, 84];
const TEXT_LIGHT: RGB = [255, 255, 255];

const PREVIEW_DATA = [
  {
    bg: "rgb(252, 246, 243)",
    textColor: "rgb(105, 97, 84)",
    text: "Air technology hasn\u2019t changed in 50 years. We think about what we eat. What we drink. But not what we breathe.",
  },
  {
    bg: "linear-gradient(180deg, rgb(228,150,70) 0%, rgb(160,81,32) 100%)",
    textColor: "rgb(255, 255, 255)",
    text: "We spent a decade developing a system that makes this possible. The air you breathe should be the air you choose.",
  },
  {
    bg: "linear-gradient(180deg, rgb(160,81,32) 0%, rgb(228,150,70) 100%)",
    textColor: "rgb(255, 255, 255)",
    text: "With Breethr, we have engineered the future of air.",
    image: "/breethr-device.png",
  },
] as const;

const SECTIONS = [
  { label: "01", id: "era-section" },
  { label: "02", id: "era-section" },
  { label: "03", id: "footer-section" },
] as const;

function getActiveIndex(progress: number): number {
  if (progress < 0.25) return 0;
  if (progress < 0.62) return 1;
  return 2;
}

export function ColorShiftSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const scrollable = el.offsetHeight - window.innerHeight;
        if (scrollable <= 0) return;
        const scrolled = -rect.top;
        setProgress(Math.max(0, Math.min(1, scrolled / scrollable)));
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Phase 1→2: Background cream → orange gradient (progress 0.15→0.42) ──
  const colorT = easeOutCubic(
    Math.max(0, Math.min(1, (progress - 0.15) / 0.27)),
  );
  const bgStart = lerpRgb(CREAM, GRADIENT_START, colorT);
  const bgMid = lerpRgb(CREAM, GRADIENT_MID, colorT);
  const bgEnd = lerpRgb(CREAM, GRADIENT_END, colorT);
  const background =
    colorT < 0.01
      ? `rgb(${CREAM.join(",")})`
      : `linear-gradient(135deg, ${bgStart} 0%, ${bgMid} 45%, ${bgEnd} 100%)`;

  // Text + label color: dark brown → white (0.9 opacity)
  const textAlpha = lerp(1, 0.9, colorT);
  const textColor = `rgba(${lerp(TEXT_DARK[0], TEXT_LIGHT[0], colorT)}, ${lerp(TEXT_DARK[1], TEXT_LIGHT[1], colorT)}, ${lerp(TEXT_DARK[2], TEXT_LIGHT[2], colorT)}, ${textAlpha})`;

  // ── Text 1 exits: progress 0.2→0.36 ──
  const t1 = easeOutCubic(
    Math.max(0, Math.min(1, (progress - 0.2) / 0.16)),
  );

  // ── Text 2 enters: progress 0.32→0.48 ──
  const t2Enter = easeOutCubic(
    Math.max(0, Math.min(1, (progress - 0.32) / 0.16)),
  );

  // ── Text 2 exits: progress 0.56→0.7 ──
  const t2Exit = easeOutCubic(
    Math.max(0, Math.min(1, (progress - 0.56) / 0.14)),
  );

  const t2 = t2Enter * (1 - t2Exit);

  // ── Phase 3: Footer content enters (progress 0.62→0.8) ──
  const footerT = easeOutCubic(
    Math.max(0, Math.min(1, (progress - 0.62) / 0.18)),
  );

  // ── Footer copyright bar (progress 0.75→0.88) ──
  const copyrightT = easeOutCubic(
    Math.max(0, Math.min(1, (progress - 0.75) / 0.13)),
  );

  const isAnimating = progress > 0.05 && progress < 0.95;
  const wc = isAnimating
    ? ("opacity, filter, transform" as const)
    : undefined;

  const activeIndex = getActiveIndex(progress);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleIndicatorClick = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const scrollable = el.offsetHeight - window.innerHeight;
    const targets = [0, 0.4, 0.85];
    const targetScroll = el.offsetTop + scrollable * (targets[index] ?? 0);
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      data-section="era"
      className="relative"
      style={{ height: "400vh" }}
    >
      <div
        className="sticky top-0 flex h-screen w-full flex-col items-center justify-center px-6"
        style={{ background }}
      >
        {/* ── Phase 1 & 2: Text content ── */}
        <div className="grid" style={{ gridTemplateColumns: "1fr", maxWidth: "480px", width: "100%", transform: `translateY(${-30 * progress}px)`, willChange: isAnimating ? "transform" : undefined }}>
          <h2
            className="text-center font-normal"
            style={{
              gridArea: "1/1",
              fontFamily: '"GT Standard L Regular", "GT Standard L Regular Placeholder", sans-serif',
              fontSize: "24px",
              fontWeight: 400,
              lineHeight: "26.4px",
              letterSpacing: "-0.48px",
              color: textColor,
              opacity: 1 - t1,
              transform: `translateY(${-20 * t1}px)`,
              willChange: wc,
            }}
          >
            Air technology hasn&apos;t changed in 50
            <br />
            years. We think about what we eat. What
            <br />
            we drink. But not what we breathe.
          </h2>

          <h2
            className="text-center font-normal"
            style={{
              gridArea: "1/1",
              fontFamily: '"GT Standard L Regular", "GT Standard L Regular Placeholder", sans-serif',
              fontSize: "24px",
              fontWeight: 400,
              lineHeight: "26.4px",
              letterSpacing: "-0.48px",
              color: textColor,
              opacity: t2,
              filter: `blur(${t2Exit > 0 ? 0 : 8 * (1 - t2Enter)}px)`,
              transform: `translateY(${t2Exit > 0 ? -20 * t2Exit : 12 * (1 - t2Enter)}px)`,
              willChange: wc,
            }}
          >
            We spent a decade developing a system
            <br />
            that makes this possible. The air you breathe
            <br />
            should be the air you choose.
          </h2>
        </div>

        {/* ── Phase 3: Footer content (product image + heading + CTA) ── */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: footerT,
          }}
        >
          {/* Product image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/breethr-device.png"
            alt="Breethr device"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition: "center 35%",
              filter: "saturate(1.08)",
              transform: `translateY(${20 * (1 - footerT)}px) scale(${1 + 0.03 * (1 - footerT)})`,
              willChange: isAnimating ? "transform" : undefined,
            }}
          />
          {/* Top gradient overlay — warm orange fade for seamless section transition */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(200, 116, 51, 0.92) 0%, rgba(178, 96, 40, 0.45) 20%, rgba(155, 75, 28, 0.15) 38%, transparent 52%)",
            }}
          />
        </div>

        {/* Footer heading + CTA — fades in with phase 3 */}
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
          style={{
            opacity: footerT,
            transform: `translateY(${24 * (1 - footerT)}px)`,
            willChange: isAnimating ? "transform, opacity" : undefined,
            pointerEvents: footerT > 0.5 ? "auto" : "none",
          }}
        >
          <h1
            className="max-w-[580px] text-center font-sans font-normal text-white"
            style={{
              fontSize: "32px",
              lineHeight: "36.8px",
              letterSpacing: "-0.96px",
            }}
          >
            With Breethr, we have engineered
            <br />
            the future of air.
          </h1>
          <a
            href="#"
            className="relative mt-6 overflow-hidden transition-opacity hover:opacity-90"
            style={{ borderRadius: "1000px" }}
          >
            <span
              className="absolute inset-0"
              style={{
                backgroundColor: "rgb(255, 255, 255)",
                filter: "blur(2px)",
                borderRadius: "1000px",
              }}
            />
            <span
              className="relative block font-sans text-[13px]"
              style={{
                color: "rgb(84, 106, 113)",
                letterSpacing: "-0.13px",
                padding: "10px 14px",
              }}
            >
              Let&apos;s chat
            </span>
          </a>
        </div>

        {/* ── 01 / 02 / 03 scroll indicators ── */}
        <div
          className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 items-center"
          style={{ gap: "25px" }}
        >
          {SECTIONS.map((section, i) => {
            const preview = PREVIEW_DATA[i] ?? PREVIEW_DATA[0];
            return (
              <div
                key={section.label}
                className="relative flex flex-col items-center"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Preview card */}
                <div
                  className="pointer-events-none absolute bottom-full mb-3 flex items-center justify-center overflow-hidden"
                  style={{
                    width: 120,
                    height: 80,
                    borderRadius: 12,
                    background: preview.bg,
                    opacity: hoveredIndex === i ? 1 : 0,
                    transform: `translateY(${hoveredIndex === i ? 0 : 6}px) scale(${hoveredIndex === i ? 1 : 0.95})`,
                    transition: "opacity 250ms ease, transform 250ms ease",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  }}
                >
                  {"image" in preview && preview.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={preview.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{
                        objectPosition: "center 60%",
                        filter: "brightness(0.7)",
                      }}
                    />
                  )}
                  <p
                    className="relative px-2 text-center font-sans leading-tight"
                    style={{
                      fontSize: "5.5px",
                      color: preview.textColor,
                      letterSpacing: "-0.2px",
                    }}
                  >
                    {preview.text}
                  </p>
                </div>

                <button
                  onClick={() => handleIndicatorClick(i)}
                  className="cursor-pointer border-none bg-transparent p-0 font-sans transition-opacity duration-300"
                  style={{
                    fontSize: "14px",
                    letterSpacing: "-0.14px",
                    color: activeIndex >= 2 ? "white" : textColor,
                    opacity: i === activeIndex ? 1 : 0.5,
                    fontWeight: i === activeIndex ? 600 : 400,
                  }}
                >
                  {section.label}
                </button>
              </div>
            );
          })}
        </div>

        {/* ── Copyright bar — fades in with phase 3 ── */}
        <div
          className="absolute bottom-6 z-10 flex w-full items-center justify-between px-6"
          style={{
            opacity: copyrightT,
          }}
        >
          <p
            className="font-mono uppercase text-white"
            style={{ fontSize: "14px", letterSpacing: "-0.14px" }}
          >
            &copy; 2026 Breethr
          </p>
          <p
            className="font-mono uppercase text-white"
            style={{ fontSize: "14px", letterSpacing: "-0.14px" }}
          >
            Privacy Policy | Terms &amp; Conditions
          </p>
        </div>
      </div>
    </div>
  );
}
