"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TEAL = "rgb(84, 106, 113)";
const LIGHT = "rgb(255, 255, 255)";

// Dead-zone in px before toggling visibility — prevents twitchy behavior
const SCROLL_THRESHOLD = 30;

export function Navbar() {
  const [visible, setVisible] = useState(true);
  const [isDarkBg, setIsDarkBg] = useState(false);

  const lastScrollYRef = useRef(0);
  const scrollAccumulatorRef = useRef(0);
  const directionRef = useRef<"up" | "down" | null>(null);
  const rafRef = useRef(0);

  // ── Sample background luminance behind the navbar ───────────────
  const sampleBackground = useCallback(() => {
    const x = window.innerWidth / 2;
    const y = 32;
    const elements = document.elementsFromPoint(x, y);

    for (const el of elements) {
      const htmlEl = el as HTMLElement;
      if (htmlEl.dataset?.navbar !== undefined) continue;
      if (htmlEl.closest?.("[data-navbar]")) continue;

      // Canvas (scroll-video frames) → always dark
      if (el.tagName === "CANVAS") {
        setIsDarkBg(true);
        return;
      }

      // Check inline background style (handles ColorShiftSection gradients)
      const inlineBg = htmlEl.style.background || htmlEl.style.backgroundColor;
      if (inlineBg) {
        const rgbMatch = inlineBg.match(/rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
        if (rgbMatch) {
          const r = parseFloat(rgbMatch[1]!);
          const g = parseFloat(rgbMatch[2]!);
          const b = parseFloat(rgbMatch[3]!);
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          setIsDarkBg(luminance < 0.5);
          return;
        }
      }

      // Fallback: computed backgroundColor (solid backgrounds like <main>)
      const bg = getComputedStyle(el).backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
        const match = bg.match(/[\d.]+/g);
        if (match && match.length >= 3) {
          const r = parseFloat(match[0]!);
          const g = parseFloat(match[1]!);
          const b = parseFloat(match[2]!);
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          setIsDarkBg(luminance < 0.5);
          return;
        }
      }
    }
    setIsDarkBg(false);
  }, []);

  // ── Scroll direction detection — throttled via rAF ──────────────
  useEffect(() => {
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const prev = lastScrollYRef.current;
        const delta = currentY - prev;

        if (currentY <= 10) {
          setVisible(true);
          scrollAccumulatorRef.current = 0;
          directionRef.current = null;
          lastScrollYRef.current = currentY;
          sampleBackground();
          return;
        }

        const newDir =
          delta > 0 ? "down" : delta < 0 ? "up" : directionRef.current;

        if (newDir !== directionRef.current) {
          scrollAccumulatorRef.current = 0;
          directionRef.current = newDir;
        }

        scrollAccumulatorRef.current += Math.abs(delta);

        if (scrollAccumulatorRef.current > SCROLL_THRESHOLD) {
          if (newDir === "down") {
            setVisible(false);
          } else if (newDir === "up") {
            setVisible(true);
          }
        }

        lastScrollYRef.current = currentY;
        sampleBackground();
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    sampleBackground();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [sampleBackground]);

  const navColor = isDarkBg ? LIGHT : TEAL;

  const navStyle: React.CSSProperties = {
    transform: visible ? "translateY(0)" : "translateY(-100%)",
    transition: "transform 280ms ease",
    willChange: "transform",
  };

  return (
    <nav
      data-navbar
      className="fixed top-0 right-0 left-0 z-[1000]"
      style={navStyle}
    >
      <div className="flex h-16 items-center px-6">
        <a
          href="#"
          className="flex items-center transition-opacity hover:opacity-70"
          aria-label="Breethr"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 69 20"
            className="h-5 w-auto"
            style={{ flexShrink: 0, transition: "fill 300ms ease" }}
            fill={navColor}
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
        </a>
      </div>
    </nav>
  );
}
