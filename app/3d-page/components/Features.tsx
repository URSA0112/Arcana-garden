// ─────────────────────────────────────────────
// Features.tsx — scroll-animated feature cards
//
// GSAP ScrollTrigger pattern:
//   1. Register the plugin (must happen client-side)
//   2. In useEffect, loop over card refs
//   3. gsap.from(el, { ..., scrollTrigger: { trigger: el } })
//      → animation fires when the element scrolls into view
//   4. Cleanup: kill all ScrollTrigger instances on unmount
//
// Each card has a live code snippet so you can
// see exactly what the tech looks like in practice.
// ─────────────────────────────────────────────
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Must register before using — GSAP plugins are opt-in
gsap.registerPlugin(ScrollTrigger)

// ── Data ─────────────────────────────────────
const FEATURES = [
  {
    icon: '⬡',
    tag: 'r3f',
    name: 'React Three Fiber',
    desc: 'Three.js as JSX. Canvas, meshes, lights, and cameras are React components. useFrame() is your render loop.',
    code: `<Canvas camera={{ fov: 50 }}>
  <ambientLight />
  <mesh>
    <boxGeometry />
    <meshStandardMaterial />
  </mesh>
</Canvas>`,
  },
  {
    icon: '◈',
    tag: 'drei',
    name: 'Drei Helpers',
    desc: 'Ready-made abstractions on top of R3F. Stars, Float, OrbitControls, MeshDistortMaterial — no boilerplate.',
    code: `import { Stars, Float, MeshDistortMaterial }
  from '@react-three/drei'

<Float speed={1.6} floatIntensity={1}>
  <Stars radius={90} count={3000} fade />
</Float>`,
  },
  {
    icon: '→',
    tag: 'gsap',
    name: 'GSAP Animations',
    desc: 'Industry-standard JS animation. gsap.timeline() chains entrances; ScrollTrigger fires them on scroll.',
    code: `// Entrance timeline
const tl = gsap.timeline()
tl.from(el, { y: 40, opacity: 0 })

// Scroll reveal
gsap.from(card, {
  y: 50, opacity: 0,
  scrollTrigger: { trigger: card }
})`,
  },
  {
    icon: '▲',
    tag: 'next.js',
    name: 'Next.js App Router',
    desc: "Server Components by default. 'use client' for interactivity. dynamic() with ssr:false keeps WebGL off the server.",
    code: `// Server component can import client components.
// Use dynamic + ssr:false for anything
// that touches WebGL / window.

const Scene = dynamic(
  () => import('./Scene'),
  { ssr: false }
)`,
  },
]

// ── Component ────────────────────────────────
export default function Features() {
  // Array of refs — one per card
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return

      gsap.from(card, {
        y: 55,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
        delay: i * 0.07,       // stagger: each card slightly later
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',    // fire when card top = 88% down the viewport
          toggleActions: 'play none none none',
        },
      })
    })

    // Cleanup prevents memory leaks on unmount
    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  return (
    <section
      id="features"
      className="max-w-5xl mx-auto px-6 sm:px-10 pt-24 pb-32"
    >
      {/* ── Section header ── */}
      <div className="mb-14">
        <div
          className="mb-5"
          style={{ height: 1, width: 36, backgroundColor: '#a3e635' }}
        />
        <p
          className="text-[11px] tracking-[0.3em] uppercase font-medium mb-4"
          style={{ color: '#a3e635' }}
        >
          What this page teaches
        </p>
        <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
          The Stack,
          <br />
          <span style={{ color: '#374151' }}>explained simply.</span>
        </h2>
      </div>

      {/* ── 2-column card grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FEATURES.map((f, i) => (
          <div
            key={f.tag}
            // Callback ref stores each div in our array
            ref={(el) => { cardsRef.current[i] = el }}
            className="rounded-2xl p-7 border transition-all duration-300
                       hover:border-[rgba(163,230,53,0.3)]
                       hover:bg-[rgba(163,230,53,0.03)]
                       group cursor-default"
            style={{
              backgroundColor: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {/* Icon + tag badge */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ color: '#a3e635' }}
              >
                {f.icon}
              </span>
              <span
                className="text-[10px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: 'rgba(163,230,53,0.08)',
                  border: '1px solid rgba(163,230,53,0.18)',
                  color: '#84cc16',
                }}
              >
                {f.tag}
              </span>
            </div>

            {/* Title + description */}
            <h3 className="text-base font-semibold text-white mb-2">{f.name}</h3>
            <p className="text-sm leading-relaxed mb-5" style={{ color: '#6b7280' }}>
              {f.desc}
            </p>

            {/* Live code snippet */}
            <pre
              className="text-xs rounded-xl px-4 py-3.5 leading-relaxed font-mono
                         overflow-x-auto whitespace-pre"
              style={{
                backgroundColor: 'rgba(0,0,0,0.55)',
                border: '1px solid rgba(255,255,255,0.05)',
                color: '#86efac',
              }}
            >
              {f.code}
            </pre>
          </div>
        ))}
      </div>
    </section>
  )
}
