"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ── tiny fade util ────────────────────────────────────────────────
function fadeTo(
  audio: HTMLAudioElement,
  target: number,
  durationMs = 600,
  onDone?: () => void,
) {
  const steps = 30;
  const interval = durationMs / steps;
  const start = audio.volume;
  const delta = (target - start) / steps;
  let step = 0;
  const id = setInterval(() => {
    step++;
    audio.volume = Math.min(1, Math.max(0, start + delta * step));
    if (step >= steps) {
      clearInterval(id);
      audio.volume = target;
      onDone?.();
    }
  }, interval);
  return id;
}

export function AudioManager() {
  const windRef = useRef<HTMLAudioElement | null>(null);
  const whooshRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);
  const mutedRef = useRef(false);
  const hoverVolumeRef = useRef(0.25); // current "hover-on" target volume
  const lastSectionRef = useRef<string | null>(null);
  const fadeIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [muted, setMuted] = useState(false);

  // ── helpers ───────────────────────────────────────────────────────
  const cancelFade = () => {
    if (fadeIdRef.current) clearInterval(fadeIdRef.current);
  };

  const fadeWind = useCallback((target: number, ms = 600) => {
    const w = windRef.current;
    if (!w || mutedRef.current) return;
    cancelFade();
    fadeIdRef.current = fadeTo(w, target, ms);
  }, []);

  // ── initialise audio objects ──────────────────────────────────────
  useEffect(() => {
    const wind = new Audio("/forest-wind-birds.mp3");
    wind.loop = true;
    wind.volume = 0;
    windRef.current = wind;

    const whoosh = new Audio("/whoosh-impact.mp3");
    whoosh.volume = 0.3;
    whooshRef.current = whoosh;

    // ── kick off wind on first interaction ──────────────────────────
    const startWind = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      void wind.play().then(() => fadeWind(0.18)).catch(() => null);
    };

    // ── hover-in / hover-out handlers (desktop) ──────────────────────
    const onMouseEnter = () => {
      if (!startedRef.current) {
        startedRef.current = true;
        void wind.play().then(() => fadeWind(0.25)).catch(() => null);
        return;
      }
      hoverVolumeRef.current = 0.25;
      fadeWind(0.25, 500);
    };

    const onMouseLeave = () => {
      // fade down to a soft "outdoor" level, don't stop
      hoverVolumeRef.current = 0.07;
      fadeWind(0.07, 800);
    };

    // ── section transition whoosh ────────────────────────────────────
    const sections = document.querySelectorAll("section[data-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            entry.intersectionRatio >= 0.35 &&
            startedRef.current &&
            !mutedRef.current
          ) {
            const id =
              (entry.target as HTMLElement).dataset.section ?? "";
            if (id !== lastSectionRef.current) {
              lastSectionRef.current = id;
              const w = whooshRef.current;
              if (w) {
                w.currentTime = 0;
                void w.play().catch(() => null);
              }
            }
          }
        }
      },
      { threshold: 0.35 },
    );

    sections.forEach((s) => observer.observe(s));

    // attach events
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", startWind, { once: true });
    window.addEventListener("pointerdown", startWind, { once: true });

    return () => {
      cancelFade();
      observer.disconnect();
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", startWind);
      window.removeEventListener("pointerdown", startWind);
      wind.pause();
    };
  }, [fadeWind]);

  // ── mute toggle ───────────────────────────────────────────────────
  const toggleMute = () => {
    const w = windRef.current;
    const wh = whooshRef.current;
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);

    if (next) {
      // muting — fade wind to 0
      cancelFade();
      if (w) fadeIdRef.current = fadeTo(w, 0, 400);
      if (wh) wh.volume = 0;
    } else {
      // unmuting
      if (wh) wh.volume = 0.3;
      if (w) {
        void w.play().catch(() => null);
        fadeIdRef.current = fadeTo(w, hoverVolumeRef.current, 400);
      }
    }
  };

  // ── render mute button ────────────────────────────────────────────
  return (
    <button
      onClick={toggleMute}
      aria-label={muted ? "Unmute" : "Mute"}
      className="group fixed bottom-6 right-6 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-[#546a71]/20 bg-white/70 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/90 hover:shadow-md"
      style={{ WebkitBackdropFilter: "blur(8px)" }}
    >
      {muted ? (
        /* Speaker muted icon */
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#546a71"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        /* Speaker-with-waves icon */
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#546a71"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
}
