import { Suspense } from "react";
import { AudioManager } from "@/app/_components/audio-manager";
import { ColorShiftSection } from "@/app/_components/color-shift-section";
import { Navbar } from "@/app/_components/navbar";
import { PageLoader } from "@/app/_components/page-loader";
import { ScrollVideo } from "@/app/_components/scroll-video";

export default function Home() {
  return (
    <main style={{ backgroundColor: "rgb(252, 246, 243)" }}>
      {/* ── Full-screen page loader (plays once on mount) ── */}
      <PageLoader />

      {/* ── Ambient audio + section whoosh ── */}
      <AudioManager />

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Scroll-based video section ── */}
      <Suspense>
        <ScrollVideo />
      </Suspense>

      {/* ── Scroll-locked section: era text → decade text → footer (all in one sticky scroll) ── */}
      <ColorShiftSection />
    </main>
  );
}
