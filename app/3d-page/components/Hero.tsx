// ─────────────────────────────────────────────
// Hero.tsx — full-viewport hero section
//
// What lives here:
//   • Scene (3D canvas, ssr:false) as background
//   • Gradient overlay so text stays readable
//   • GSAP timeline animates text in on mount
//
// GSAP pattern:
//   gsap.timeline() chains multiple `.from()`
//   calls with overlapping timing via '-=0.3'.
//   This is the standard entrance animation recipe.
//
// Why dynamic import with { ssr: false }?
//   Scene.tsx uses WebGL which only exists in the
//   browser. ssr:false tells Next.js: skip this
//   on the server entirely, render only on client.
// ─────────────────────────────────────────────
'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'

const Scene = dynamic(() => import('./Scene'), { ssr: false })

export default function Hero() {
  // Refs give GSAP direct DOM access without re-renders
  const labelRef  = useRef<HTMLParagraphElement>(null)
  const headRef   = useRef<HTMLHeadingElement>(null)
  const subRef    = useRef<HTMLParagraphElement>(null)
  const btnRef    = useRef<HTMLAnchorElement>(null)
  const lineRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // gsap.timeline: run multiple animations in sequence (with overlap)
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.75 } })

    tl.from(lineRef.current,  { scaleX: 0, duration: 0.5, ease: 'power2.inOut' })
      .from(labelRef.current, { y: 18, opacity: 0, duration: 0.55 }, '-=0.1')
      .from(headRef.current,  { y: 45, opacity: 0 }, '-=0.35')
      .from(subRef.current,   { y: 25, opacity: 0, duration: 0.6 }, '-=0.45')
      .from(btnRef.current,   { y: 20, opacity: 0, duration: 0.5 }, '-=0.35')

    // Cleanup: kill timeline if component unmounts
    return () => { tl.kill() }
  }, [])

  return (
    <section className="relative h-screen flex items-center overflow-hidden">

      {/* ── 3D Canvas layer (absolute, behind everything) ── */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* ── Gradient: dark on left (text), fades right (shows 3D) ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              to right,
              rgba(8,8,8,0.97) 0%,
              rgba(8,8,8,0.85) 42%,
              rgba(8,8,8,0.35) 72%,
              transparent      100%
            ),
            linear-gradient(
              to top,
              rgba(8,8,8,0.6) 0%,
              transparent 35%
            )
          `,
        }}
      />

      {/* ── Text content (above both layers) ── */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 sm:px-10 w-full">

        {/* Decorative horizontal line — GSAP scaleX reveal */}
        <div
          ref={lineRef}
          className="mb-6 origin-left"
          style={{
            height: 1,
            width: 48,
            backgroundColor: '#a3e635',
            transformOrigin: 'left center',
          }}
        />

        {/* Label */}
        <p
          ref={labelRef}
          className="text-[11px] tracking-[0.32em] uppercase font-medium mb-5"
          style={{ color: '#a3e635' }}
        >
          React Three Fiber · Drei · GSAP · Next.js
        </p>

        {/* Heading */}
        <h1
          ref={headRef}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-[1.06] text-white mb-7"
        >
          Build Stunning
          <br />
          <span style={{ color: '#a3e635' }}>3D Experiences</span>
        </h1>

        {/* Sub */}
        <p
          ref={subRef}
          className="text-base sm:text-lg mb-10 max-w-sm leading-relaxed"
          style={{ color: '#6b7280' }}
        >
          A minimal, well-annotated demo. Real Three.js in React, GSAP scroll
          animations, and clean Next.js App Router patterns — all in one place.
        </p>

        {/* CTA */}
        <a
          ref={btnRef}
          href="#features"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-95"
          style={{ backgroundColor: '#a3e635', color: '#080808' }}
        >
          Explore the Stack
          <span className="text-base">↓</span>
        </a>
      </div>

      {/* ── Scroll hint ── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        style={{ color: '#374151' }}
      >
        <span className="text-[10px] tracking-[0.25em] uppercase">Scroll</span>
        <div className="h-8 w-[1px]" style={{ backgroundColor: 'rgba(55,65,81,0.6)' }} />
      </div>
    </section>
  )
}
