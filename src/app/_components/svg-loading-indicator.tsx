"use client";

const BRAND_BLUE = "rgb(219, 248, 255)";
const BRAND_TEAL = "rgb(77, 132, 149)";
const PAGE_BG = "rgb(252, 246, 243)";

const keyframes = `
@keyframes breatheOverlay {
  0%, 100% { opacity: 0; transform: scale(1); }
  50% { opacity: 0.55; transform: scale(1.02); }
}
@keyframes breatheRingOuter {
  0%, 100% { r: 38; opacity: 0.15; }
  50% { r: 44; opacity: 0.35; }
}
@keyframes breatheRingMiddle {
  0%, 100% { r: 24; opacity: 0.1; }
  50% { r: 30; opacity: 0.3; }
}
@keyframes breatheRingInner {
  0%, 100% { r: 10; opacity: 0.05; }
  50% { r: 16; opacity: 0.2; }
}
@keyframes breatheDot {
  0%, 100% { r: 3; opacity: 0.2; }
  50% { r: 5; opacity: 0.5; }
}
`;

export function SvgLoadingIndicator() {
  return (
    <div
      className="absolute inset-0"
      style={{ backgroundColor: PAGE_BG, opacity: 1 }}
    >
      <style>{keyframes}</style>

      {/* Pulsing light-blue overlay — replicates the Framer inner div */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: BRAND_BLUE,
          willChange: "transform",
          animation: "breatheOverlay 3s ease-in-out infinite",
        }}
      />

      {/* Centered SVG breathing rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="60"
            r="38"
            stroke={BRAND_TEAL}
            strokeWidth="0.75"
            style={{ animation: "breatheRingOuter 3s ease-in-out infinite" }}
          />
          <circle
            cx="60"
            cy="60"
            r="24"
            stroke={BRAND_TEAL}
            strokeWidth="0.5"
            style={{
              animation: "breatheRingMiddle 3s ease-in-out 0.3s infinite",
            }}
          />
          <circle
            cx="60"
            cy="60"
            r="10"
            stroke={BRAND_TEAL}
            strokeWidth="0.5"
            style={{
              animation: "breatheRingInner 3s ease-in-out 0.6s infinite",
            }}
          />
          <circle
            cx="60"
            cy="60"
            r="3"
            fill={BRAND_TEAL}
            style={{ animation: "breatheDot 3s ease-in-out 0.9s infinite" }}
          />
        </svg>
      </div>
    </div>
  );
}
