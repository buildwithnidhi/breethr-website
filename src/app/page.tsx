import { Suspense } from "react";
import { AudioManager } from "@/app/_components/audio-manager";
import { FadeInSection } from "@/app/_components/fade-in-section";
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

      {/* ── Text section: A New Era ── */}
      <section
        data-section="era"
        className="flex min-h-screen flex-col items-center justify-center px-6 py-32"
        style={{
          background:
            "linear-gradient(rgba(255,255,255,0.05) 0%, rgba(222,161,122,0.06) 8.84%, rgba(160,82,32,0.1) 100%), rgb(252, 246, 243)",
        }}
      >
        <FadeInSection className="flex flex-col items-center">
          {/* Label: Geist Pixel / mono substitute, 14px, uppercase, warm brown */}
          <p
            className="mb-[10px] font-mono text-[14px] uppercase"
            style={{ color: "rgb(52, 44, 28)", letterSpacing: "-0.14px" }}
          >
            A new era of air intelligence
          </p>
          {/* Body copy — combined into one block matching Framer H2 */}
          <h2
            className="max-w-xl text-center font-sans font-normal"
            style={{
              fontSize: "28px",
              lineHeight: "32.2px",
              letterSpacing: "-0.84px",
              color: "rgb(52, 44, 28)",
            }}
          >
            Air technology hasn&apos;t changed in 50 years. We think about what
            we eat. What we drink. But not what we breathe.
          </h2>
        </FadeInSection>
      </section>

      {/* ── Gradient section: Decade ── */}
      {/* framer-198evct: solid orange gradient — rgb(230,151,71) → rgb(146,66,23) */}
      {/* framer-edvb9y: sticky overlay with label + H2 text (white) */}
      <section
        data-section="decade"
        className="flex min-h-screen flex-col items-center justify-center px-6 py-32"
        style={{
          background:
            "linear-gradient(180deg, rgb(230, 151, 71) 0%, rgb(146, 66, 23) 120%)",
        }}
      >
        <FadeInSection className="flex flex-col items-center">
          {/* Label: Geist Pixel / mono, 14px, uppercase, white, letter-spacing -0.14px */}
          <p
            className="mb-[10px] font-mono text-[14px] uppercase text-white"
            style={{ letterSpacing: "-0.14px" }}
          >
            A new era of air intelligence
          </p>
          {/* Decade H2 — 28px, white, letter-spacing -0.84px, line-height 32.2px */}
          <h2
            className="max-w-xl text-center font-sans font-normal text-white"
            style={{
              fontSize: "28px",
              lineHeight: "32.2px",
              letterSpacing: "-0.84px",
            }}
          >
            We spent a decade developing a system that makes this possible. The
            air you breathe should be the air you choose.
          </h2>
        </FadeInSection>
      </section>

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
