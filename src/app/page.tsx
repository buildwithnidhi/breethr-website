import { Suspense } from "react";
import { AudioManager } from "@/app/_components/audio-manager";
import { ColorShiftSection } from "@/app/_components/color-shift-section";
import { Navbar } from "@/app/_components/navbar";
import { ScrollVideo } from "@/app/_components/scroll-video";

export default function Home() {
  return (
    <main style={{ backgroundColor: "rgb(252, 246, 243)" }}>
      {/* ── Ambient audio + section whoosh ── */}
      <AudioManager />

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Scroll-based video section ── */}
      <Suspense>
        <ScrollVideo />
      </Suspense>

      {/* ── Scroll-locked color-shift section (era → decade) ── */}
      <ColorShiftSection />

      {/* ── Footer / CTA section ── */}
      {/* framer-1bi2ish gradient: rgb(160,80,31) → rgb(146,66,23) → rgb(234,168,82) */}
      <section
        data-section="footer"
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgb(160, 80, 31) 0%, rgb(146, 66, 23) 45.84%, rgb(234, 168, 82) 100%)",
        }}
      >
        {/* Product image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/breethr-device.png"
          alt="Breethr device"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center 60%", filter: "brightness(0.7)" }}
        />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-center px-6">
          {/* H1 in Framer: 32px, white, letter-spacing -0.96px, line-height 36.8px */}
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
          {/* Contact us pill: borderRadius 1000px, padding 10px 14px, color #546a71, bg white frosted */}
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
              Contact us
            </span>
          </a>
        </div>

        {/* Footer bottom — Geist Pixel / mono substitute, 14px, uppercase, white */}
        <div className="absolute bottom-6 z-10 flex w-full items-center justify-between px-6">
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
      </section>
    </main>
  );
}
