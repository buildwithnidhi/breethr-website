"use client";

import { useState } from "react";

const PREVIEW_DATA = [
  {
    bg: "rgb(252, 246, 243)",
    textColor: "rgb(52, 44, 28)",
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

const LABELS = ["01", "02", "03"] as const;

export function FooterIndicators() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    if (index === 2) return; // Already on section 03
    const era = document.querySelector('[data-section="era"]');
    if (!era || !(era instanceof HTMLElement)) return;
    const scrollable = era.offsetHeight - window.innerHeight;
    const targetProgress = index === 0 ? 0 : 0.55;
    const targetScroll = era.offsetTop + scrollable * targetProgress;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <div
      className="absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 items-center"
      style={{ gap: "25px" }}
    >
      {LABELS.map((label, i) => {
        const preview = PREVIEW_DATA[i] ?? PREVIEW_DATA[0];
        return (
          <div
            key={label}
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
              onClick={() => handleClick(i)}
              className="cursor-pointer border-none bg-transparent p-0 font-sans transition-opacity duration-300"
              style={{
                fontSize: "14px",
                letterSpacing: "-0.14px",
                color: "white",
                opacity: i === 2 ? 1 : 0.5,
                fontWeight: i === 2 ? 600 : 400,
              }}
            >
              {label}
            </button>
          </div>
        );
      })}
    </div>
  );
}
