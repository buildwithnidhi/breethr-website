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
const GRADIENT_TOP: RGB = [228, 150, 70]; // #E49646
const GRADIENT_BOT: RGB = [160, 81, 32]; // #A05120
const TEXT_DARK: RGB = [52, 44, 28];
const TEXT_LIGHT: RGB = [255, 255, 255];

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

  // Background: cream → vertical orange gradient (progress 0.2 → 0.55)
  const colorT = easeOutCubic(
    Math.max(0, Math.min(1, (progress - 0.2) / 0.35)),
  );
  const bgTop = lerpRgb(CREAM, GRADIENT_TOP, colorT);
  const bgBot = lerpRgb(CREAM, GRADIENT_BOT, colorT);
  const background =
    colorT < 0.01
      ? `rgb(${CREAM.join(",")})`
      : `linear-gradient(180deg, ${bgTop} 0%, ${bgBot} 100%)`;

  // Text + label color: dark brown → white
  const textColor = lerpRgb(TEXT_DARK, TEXT_LIGHT, colorT);

  // Text 1 exits: progress 0.3 → 0.5
  const t1 = easeOutCubic(
    Math.max(0, Math.min(1, (progress - 0.3) / 0.2)),
  );

  // Text 2 enters: progress 0.48 → 0.68
  const t2 = easeOutCubic(
    Math.max(0, Math.min(1, (progress - 0.48) / 0.2)),
  );

  const isAnimating = progress > 0.05 && progress < 0.95;
  const wc = isAnimating
    ? ("opacity, filter, transform" as const)
    : undefined;

  return (
    <div
      ref={containerRef}
      data-section="era"
      className="relative"
      style={{ height: "300vh" }}
    >
      <div
        className="sticky top-0 flex h-screen w-full flex-col items-center justify-center px-6"
        style={{ background }}
      >
        {/* Shared label — stays in place, only color shifts */}
        <p
          className="mb-[10px] font-mono text-[14px] uppercase"
          style={{ color: textColor, letterSpacing: "-0.14px" }}
        >
          A new era of air intelligence
        </p>

        {/* Grid stacks both texts in the same cell */}
        <div className="grid max-w-xl" style={{ gridTemplateColumns: "1fr" }}>
          <h2
            className="text-center font-sans font-normal"
            style={{
              gridArea: "1/1",
              fontSize: "28px",
              lineHeight: "32.2px",
              letterSpacing: "-0.84px",
              color: textColor,
              opacity: 1 - t1,
              filter: `blur(${8 * t1}px)`,
              transform: `translateY(${-20 * t1}px)`,
              willChange: wc,
            }}
          >
            Air technology hasn&apos;t changed in 50 years. We think about what
            we eat. What we drink. But not what we breathe.
          </h2>

          <h2
            className="text-center font-sans font-normal"
            style={{
              gridArea: "1/1",
              fontSize: "28px",
              lineHeight: "32.2px",
              letterSpacing: "-0.84px",
              color: textColor,
              opacity: t2,
              filter: `blur(${8 * (1 - t2)}px)`,
              transform: `translateY(${12 * (1 - t2)}px)`,
              willChange: wc,
            }}
          >
            We spent a decade developing a system that makes this possible. The
            air you breathe should be the air you choose.
          </h2>
        </div>
      </div>
    </div>
  );
}
