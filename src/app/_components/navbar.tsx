"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Text / icon color — always teal, never changes with scroll
const TEAL = "rgb(84, 106, 113)";

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
          {/* ── Left: Logo + nav links ── */}
          <div
            className="flex items-center gap-8"
            style={{ borderRadius: "1000px" }}
          >
            <a
              href="#"
              className="flex items-center gap-1 font-sans text-[13px] font-normal transition-opacity hover:opacity-70"
              style={{ color: TEAL, letterSpacing: "-0.13px" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 69 20"
                style={{ flexShrink: 0 }}
                fill={TEAL}
              >
                <path d="M 4.239 1.135 C 2.714 1.135 1.836 3.313 1.49 5.12 C 2.622 3.846 4.192 2.896 5.509 2.294 C 5.324 1.807 4.839 1.135 4.239 1.135 Z M 0.035 10.727 C 1.398 13.553 5.763 16.704 8.304 16.704 C 9.505 16.704 10.382 15.916 10.382 14.741 C 10.382 12.26 6.978 9.903 3.714 8.728 C 1.351 9.117 -0.405 9.977 0.035 10.727 Z M 1.351 7.127 C 4.607 7.994 9.157 10.085 11.29 12.698 L 11.29 5.237 C 10.959 4.557 10.427 3.907 9.913 3.4 C 8.89 2.357 7.412 1.549 5.835 1.094 C 4.765 1.565 3.705 2.194 2.877 2.964 C 2.13 3.661 1.621 4.377 1.351 5.12 L 1.351 7.127 Z" />
              </svg>
              Breethr
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

          {/* ── Right: Dataroom + Contact us ── */}
          <div
            className="flex items-center gap-2"
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
        {/* ── Top row: Logo + hamburger ── */}
        <div className="flex h-14 items-center justify-between px-6">
          <a
            href="#"
            className="flex items-center gap-1 font-sans text-[13px] font-normal"
            style={{ color: TEAL, letterSpacing: "-0.13px" }}
          >
            <span className="inline-block translate-y-[-1px] text-[15px] leading-none">
              &#x25cf;
            </span>
            Breethr
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
