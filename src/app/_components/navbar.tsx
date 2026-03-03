"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Text / icon color — always teal, never changes with scroll
const TEAL = "rgb(84, 106, 113)";
const LOGO_FILL = "rgb(85, 106, 113)";

const BreethrLogoSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 69 20"
    style={{ imageRendering: "pixelated", flexShrink: 0 }}
    className="h-5 w-[69px]"
    fill={LOGO_FILL}
  >
    <path d="M 4.239 1.135 C 2.714 1.135 1.836 3.313 1.49 5.12 C 2.622 3.846 4.192 2.896 5.509 2.294 C 5.324 1.807 4.839 1.135 4.239 1.135 Z M 0.035 10.727 C 1.398 13.553 5.763 16.704 8.304 16.704 C 9.505 16.704 10.382 15.916 10.382 14.851 C 10.382 13.553 9.204 11.908 7.657 10.704 C 6.363 11.514 4.908 11.978 3.546 11.978 C 1.929 11.978 0.774 11.352 0.774 9.893 C 0.774 8.433 1.883 7.808 3.569 7.808 C 4.931 7.808 6.34 8.294 7.657 9.105 C 8.973 8.132 10.405 6.348 10.405 4.958 C 10.405 3.915 9.505 3.151 8.373 3.151 C 5.878 3.151 1.536 5.769 0.035 9.082 C -0.196 4.749 0.866 0 4.146 0 C 5.278 0 6.294 0.927 6.687 2.085 C 7.31 1.923 7.842 1.83 8.373 1.83 C 10.29 1.83 11.699 3.151 11.699 4.981 C 11.699 6.811 10.29 8.665 8.766 9.916 C 10.429 11.19 11.653 13.182 11.653 14.92 C 11.653 16.773 10.244 18.024 8.211 18.024 C 7.703 18.024 7.172 17.932 6.664 17.793 C 6.156 18.974 5.278 19.808 4.146 19.808 C 0.89 19.808 -0.219 15.129 0.035 10.727 Z M 2.067 9.893 C 2.067 10.518 2.899 10.657 3.592 10.657 C 4.562 10.657 5.509 10.31 6.387 9.893 C 5.509 9.452 4.493 9.128 3.569 9.128 C 2.83 9.128 2.067 9.267 2.067 9.893 Z M 4.146 18.488 C 4.747 18.488 5.232 17.816 5.417 17.329 C 4.1 16.727 2.529 15.777 1.398 14.503 C 1.744 16.31 2.622 18.488 4.146 18.488 Z" />
    <path d="M 64.049 7.015 C 64.049 6.863 64.172 6.739 64.325 6.739 L 65.416 6.739 C 65.569 6.739 65.693 6.863 65.693 7.015 L 65.693 8.91 C 66.163 7.55 67.209 6.72 68.72 6.631 C 68.873 6.622 68.997 6.747 68.997 6.899 L 68.997 8.028 C 68.997 8.19 68.858 8.315 68.695 8.305 C 68.62 8.3 68.544 8.297 68.466 8.297 C 66.789 8.297 65.709 9.341 65.709 11.446 L 65.709 15.744 C 65.709 15.897 65.585 16.02 65.432 16.02 L 64.325 16.02 C 64.172 16.02 64.049 15.897 64.049 15.744 Z" />
    <path d="M 60.858 10.369 C 60.858 8.943 60.177 7.982 58.732 7.982 C 57.188 7.982 56.457 9.092 56.457 10.617 L 56.457 15.744 C 56.457 15.897 56.333 16.02 56.18 16.02 L 55.073 16.02 C 54.92 16.02 54.796 15.897 54.796 15.744 L 54.796 3.866 C 54.796 3.714 54.92 3.59 55.073 3.59 L 56.18 3.59 C 56.333 3.59 56.457 3.714 56.457 3.866 L 56.457 8.463 C 56.922 7.17 57.985 6.54 59.28 6.54 C 61.04 6.54 62.518 7.733 62.518 10.236 L 62.518 15.744 C 62.518 15.897 62.394 16.02 62.242 16.02 L 61.134 16.02 C 60.982 16.02 60.858 15.897 60.858 15.744 Z" />
    <path d="M 52.197 16.12 C 50.337 16.12 49.54 15.241 49.54 13.468 L 49.54 8.231 L 48.405 8.231 C 48.252 8.231 48.128 8.107 48.128 7.954 L 48.128 7.015 C 48.128 6.863 48.252 6.739 48.405 6.739 L 49.54 6.739 L 49.54 5.074 C 49.54 4.951 49.621 4.843 49.739 4.808 L 50.846 4.488 C 51.024 4.437 51.2 4.569 51.2 4.753 L 51.2 6.739 L 53.348 6.739 C 53.501 6.739 53.625 6.863 53.625 7.015 L 53.625 7.954 C 53.625 8.107 53.501 8.231 53.348 8.231 L 51.2 8.231 L 51.2 13.219 C 51.2 14.346 51.549 14.595 52.429 14.595 C 52.725 14.595 53.02 14.57 53.298 14.532 C 53.469 14.508 53.625 14.638 53.625 14.81 L 53.625 15.755 C 53.625 15.889 53.528 16.004 53.395 16.024 C 52.994 16.085 52.601 16.12 52.197 16.12 Z" />
    <path d="M 43.73 16.219 C 40.575 16.219 38.715 14.148 38.715 11.38 C 38.715 8.628 40.508 6.54 43.298 6.54 C 46.055 6.54 47.632 8.628 47.632 11.048 C 47.632 11.329 47.614 11.575 47.585 11.797 C 47.567 11.93 47.451 12.026 47.317 12.026 L 40.425 12.026 C 40.575 13.501 41.737 14.728 43.829 14.728 C 44.691 14.728 45.591 14.517 46.506 14.041 C 46.697 13.942 46.935 14.076 46.935 14.291 L 46.935 15.3 C 46.935 15.406 46.874 15.503 46.778 15.547 C 45.764 16.01 44.724 16.219 43.73 16.219 Z M 40.425 10.717 L 45.955 10.717 C 45.855 9.126 44.975 7.999 43.281 7.999 C 41.521 7.999 40.558 9.225 40.425 10.717 Z" />
    <path d="M 34.088 16.219 C 30.933 16.219 29.073 14.148 29.073 11.38 C 29.073 8.628 30.866 6.54 33.656 6.54 C 36.413 6.54 37.99 8.628 37.99 11.048 C 37.99 11.329 37.972 11.575 37.943 11.797 C 37.925 11.93 37.81 12.026 37.675 12.026 L 30.783 12.026 C 30.933 13.501 32.095 14.728 34.188 14.728 C 35.05 14.728 35.949 14.517 36.864 14.041 C 37.056 13.942 37.293 14.076 37.293 14.291 L 37.293 15.3 C 37.293 15.406 37.233 15.503 37.136 15.547 C 36.123 16.01 35.083 16.219 34.088 16.219 Z M 30.783 10.717 L 36.313 10.717 C 36.214 9.126 35.334 7.999 33.64 7.999 C 31.879 7.999 30.916 9.225 30.783 10.717 Z" />
    <path d="M 24.112 7.015 C 24.112 6.863 24.235 6.739 24.388 6.739 L 25.479 6.739 C 25.632 6.739 25.756 6.863 25.756 7.015 L 25.756 8.91 C 26.226 7.55 27.272 6.72 28.784 6.631 C 28.936 6.622 29.06 6.747 29.06 6.899 L 29.06 8.028 C 29.06 8.19 28.921 8.315 28.758 8.305 C 28.683 8.3 28.608 8.297 28.529 8.297 C 26.852 8.297 25.772 9.341 25.772 11.446 L 25.772 15.744 C 25.772 15.897 25.648 16.02 25.495 16.02 L 24.388 16.02 C 24.235 16.02 24.112 15.897 24.112 15.744 Z" />
    <path d="M 15.964 16.02 C 15.811 16.02 15.688 15.897 15.688 15.744 L 15.688 4.695 C 15.688 4.542 15.811 4.419 15.964 4.419 L 18.909 4.419 C 21.051 4.419 22.48 5.562 22.48 7.402 C 22.48 8.827 21.649 9.673 20.503 10.004 C 21.782 10.352 22.729 11.363 22.729 12.938 C 22.729 14.893 21.234 16.02 19.009 16.02 Z M 17.348 14.579 L 18.976 14.579 C 20.055 14.579 21.051 13.982 21.051 12.639 C 21.051 11.33 20.055 10.733 18.976 10.733 L 17.348 10.733 Z M 17.348 9.341 L 18.876 9.341 C 19.872 9.341 20.819 8.894 20.819 7.617 C 20.819 6.341 19.872 5.86 18.876 5.86 L 17.348 5.86 Z" />
  </svg>
);

const navLinks = ["Beethr P1", "Technology", "Team", "Learn"];

// Dead-zone in px before toggling visibility — prevents twitchy behavior
const SCROLL_THRESHOLD = 30;

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // Refs for scroll tracking — avoids re-renders on every pixel
  const lastScrollYRef = useRef(0);
  const scrollAccumulatorRef = useRef(0);
  const directionRef = useRef<"up" | "down" | null>(null);
  const rafRef = useRef(0);
  const whooshRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    whooshRef.current = new Audio("/whoosh-impact.mp3");
    whooshRef.current.volume = 0.35;
  }, []);

  // ── Scroll direction detection — throttled via rAF ──────────────
  useEffect(() => {
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const prev = lastScrollYRef.current;
        const delta = currentY - prev;

        // Track if we've scrolled past the top
        setScrolled(currentY > 10);

        if (currentY <= 10) {
          // Always show at very top
          setVisible(true);
          scrollAccumulatorRef.current = 0;
          directionRef.current = null;
          lastScrollYRef.current = currentY;
          return;
        }

        // Determine direction
        const newDir = delta > 0 ? "down" : delta < 0 ? "up" : directionRef.current;

        // Reset accumulator on direction change
        if (newDir !== directionRef.current) {
          scrollAccumulatorRef.current = 0;
          directionRef.current = newDir;
        }

        scrollAccumulatorRef.current += Math.abs(delta);

        // Only toggle after accumulating enough movement in one direction
        if (scrollAccumulatorRef.current > SCROLL_THRESHOLD) {
          if (newDir === "down") {
            setVisible(false);
            setIsOpen(false);
          } else if (newDir === "up") {
            setVisible(true);
          }
        }

        lastScrollYRef.current = currentY;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const toggle = useCallback(() => {
    if (whooshRef.current) {
      whooshRef.current.currentTime = 0;
      void whooshRef.current.play().catch(() => null);
    }
    setIsOpen((v) => !v);
  }, []);


  // ── Navbar slide animation (translateY -100% to hide) ───────────
  const navTransform: React.CSSProperties = {
    transform: visible ? "translateY(0)" : "translateY(-100%)",
    transition: "transform 280ms ease",
    willChange: "transform",
  };

  const shadow = "none";

  // Navbar background: always fully transparent — no blur
  const navBg: React.CSSProperties = {
    backgroundColor: "rgba(0, 0, 0, 0)",
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
  };

  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          Desktop nav  (md and above)
          ════════════════════════════════════════════════════════════ */}
      <nav
        className="fixed left-0 right-0 top-0 z-[9] hidden md:block"
        style={{ ...navTransform, boxShadow: shadow }}
      >
        <div
          className="flex h-16 items-center justify-between"
          style={{ ...navBg, padding: "16px 24px" }}
        >
          {/* ── Left: Breethr logo + nav links ── */}
          <div
            className="flex shrink-0 items-center gap-8"
            style={{ borderRadius: "1000px" }}
          >
            <a
              href="#"
              className="flex items-center transition-opacity hover:opacity-70"
              aria-label="Breethr home"
            >
              <BreethrLogoSvg />
            </a>

            <div className="flex items-center gap-6">
              {navLinks.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="font-sans text-[13px] transition-opacity hover:opacity-70"
                  style={{ color: TEAL, letterSpacing: "-0.13px" }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* ── Right: Dataroom + Contact us + Logo ── */}
          <div
            className="flex shrink-0 items-center gap-2"
            style={{ borderRadius: "1000px" }}
          >
            <a
              href="#"
              className="flex items-center font-sans text-[13px] transition-opacity hover:opacity-70 active:scale-[0.97] active:transition-transform active:duration-100"
              style={{
                color: TEAL,
                letterSpacing: "-0.13px",
                padding: "10px 14px",
                borderRadius: "16px",
              }}
            >
              Dataroom
            </a>

            {/* Contact us — frosted white pill */}
            <a
              href="#"
              className="relative overflow-hidden font-sans text-[13px] transition-opacity hover:opacity-80 active:scale-[0.97] active:transition-transform active:duration-100"
              style={{ borderRadius: "1000px" }}
            >
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  backgroundColor: "rgb(255, 255, 255)",
                  filter: "blur(2px)",
                  borderRadius: "1000px",
                }}
              />
              <span
                className="relative block"
                style={{
                  color: TEAL,
                  letterSpacing: "-0.13px",
                  padding: "10px 14px",
                }}
              >
                Contact us
              </span>
            </a>

            {/* Breethr logo (top right) */}
            <a
              href="#"
              className="flex items-center transition-opacity hover:opacity-70"
              aria-label="Breethr home"
            >
              <BreethrLogoSvg />
            </a>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════
          Mobile nav  (below md)
          ════════════════════════════════════════════════════════════ */}
      <div
        className="fixed left-0 right-0 top-0 z-[9] overflow-hidden md:hidden"
        style={{
          ...navTransform,
          maxHeight: isOpen ? "400px" : "56px",
          transition:
            "max-height 420ms cubic-bezier(0.2, 0, 0, 1), transform 280ms ease",
          backgroundColor: isOpen ? "rgb(255, 255, 255)" : "rgba(0, 0, 0, 0)",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
        }}
      >
        {/* ── Top row: Breethr logo left + logo (top right) + hamburger ── */}
        <div className="flex h-14 items-center justify-between px-6">
          <a
            href="#"
            className="flex items-center transition-opacity hover:opacity-70"
            aria-label="Breethr home"
          >
            <BreethrLogoSvg />
          </a>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="flex items-center transition-opacity hover:opacity-70"
              aria-label="Breethr home"
            >
              <BreethrLogoSvg />
            </a>
            <button
              onClick={toggle}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="relative flex h-6 w-6 items-center justify-center"
          >
            {/* Hamburger */}
            <span
              className="absolute left-0 right-0"
              style={{
                transition: "opacity 200ms ease, transform 300ms cubic-bezier(0.2,0,0,1)",
                opacity: isOpen ? 0 : 1,
              }}
            >
              <svg
                width="22"
                height="14"
                viewBox="0 0 22 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="0" y1="1"  x2="22" y2="1"  stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="0" y1="7"  x2="22" y2="7"  stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="0" y1="13" x2="22" y2="13" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>

            {/* X icon */}
            <span
              className="absolute left-0 right-0"
              style={{
                transition: "opacity 200ms ease, transform 300ms cubic-bezier(0.2,0,0,1)",
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "rotate(0deg)" : "rotate(-45deg)",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="2"  y1="2"  x2="20" y2="20" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="20" y1="2"  x2="2"  y2="20" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            </button>
          </div>
        </div>

        {/* ── Expanded menu content ── */}
        <div
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateY(0)" : "translateY(-8px)",
            transition: "opacity 300ms ease 80ms, transform 350ms cubic-bezier(0.2,0,0,1) 60ms",
            pointerEvents: isOpen ? "auto" : "none",
          }}
        >
          {/* Nav links */}
          <div className="flex flex-col px-6 pb-2">
            {navLinks.map((item, i) => (
              <a
                key={item}
                href="#"
                className="py-[9px] text-[13px] hover:opacity-70"
                style={{
                  color: TEAL,
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateY(0)" : "translateY(-4px)",
                  transition: `opacity 280ms ease ${isOpen ? 80 + i * 40 : 0}ms, transform 300ms cubic-bezier(0.2,0,0,1) ${isOpen ? 80 + i * 40 : 0}ms`,
                }}
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Dataroom pill */}
          <div className="px-6 pb-3">
            <a
              href="#"
              className="flex h-10 w-full items-center justify-center rounded-2xl text-[13px] transition-colors hover:bg-[#546a71]/15"
              style={{
                color: TEAL,
                backgroundColor: "rgba(84, 106, 113, 0.08)",
              }}
              onClick={() => setIsOpen(false)}
            >
              Dataroom
            </a>
          </div>

          {/* Contact us */}
          <div className="px-6 pb-6">
            <a
              href="#"
              className="flex h-8 items-center text-[13px] hover:opacity-70"
              style={{ color: TEAL }}
              onClick={() => setIsOpen(false)}
            >
              Contact us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
