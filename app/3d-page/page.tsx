// ─────────────────────────────────────────────
// page.tsx — entry point for /3d-page
//
// This is a Server Component (no 'use client').
// It does zero work — it just assembles sections.
//
// Importing a 'use client' component from a
// Server Component is perfectly fine in App Router.
// Next.js handles the client/server boundary.
//
// Hero is wrapped in dynamic() with { ssr: false }
// because it contains the R3F Scene, which uses
// WebGL — a browser-only API. Skipping SSR for it
// avoids the "document is not defined" crash.
// ─────────────────────────────────────────────

import Hero from './components/Hero'
import Features from './components/Features'

// Hero is 'use client' — Next.js renders it on the client automatically.
// Inside Hero.tsx, Scene is dynamically imported with { ssr: false }.
// In Next.js 16, ssr:false is only allowed inside Client Components —
// that's why the dynamic() call lives in Hero, not here.

export default function ThreeDPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#080808' }}
    >
      {/* ── 1. Hero — 3D scene + GSAP entrance text ── */}
      <Hero />

      {/* ── 2. Features — GSAP ScrollTrigger cards ── */}
      <Features />

      {/* ── 3. Footer ── */}
      <footer
        className="border-t text-center py-10 text-[10px] tracking-[0.28em] uppercase"
        style={{
          borderColor: 'rgba(255,255,255,0.05)',
          color: '#374151',
        }}
      >
        Built with R3F · Drei · GSAP · Next.js 16
      </footer>
    </div>
  )
}
