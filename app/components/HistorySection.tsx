'use client'
import { DECORATION_RAYS, TIMELINE, type RayDecor } from './data/timeline'
import { useHistoryAnimations } from './hooks/useHistoryAnimations'
import { TimelineEntry } from './TimelineEntry'

function DecorRay({ ray }: { ray: RayDecor }) {
  return (
    <div
      className="absolute pointer-events-none z-0 h-px"
      style={{
        top:    ray.top,
        left:   ray.left,
        right:  ray.right,
        width:  ray.w,
        background: 'linear-gradient(to right, transparent, rgba(198,168,91,1), transparent)',
        opacity: ray.opacity,
        transform: `rotate(${ray.rotate})`,
        transformOrigin: ray.left ? 'left center' : 'right center',
      }}
    />
  )
}

export default function HistorySection() {
  const { sectionRef, headRef, setImgRef, setTxtRef } = useHistoryAnimations()

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: '#0A0A0A' }}
    >
      {/* ── Decoration layer ── */}
      <div className="absolute inset-x-0 top-0 z-10 pointer-events-none" style={{ height: 200, background: 'linear-gradient(to bottom, #0A0A0A 0%, transparent 100%)' }} />
      <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: 160, background: 'linear-gradient(to top, #0A0A0A 0%, transparent 100%)' }} />
      <div className="absolute inset-x-0 top-0 pointer-events-none z-0" style={{ height: '55%', background: 'radial-gradient(ellipse 55% 45% at 50% 0%, rgba(198,168,91,0.06) 0%, transparent 100%)' }} />
      <div className="absolute inset-x-0 bottom-0 pointer-events-none z-0" style={{ height: '35%', background: 'radial-gradient(ellipse 40% 40% at 50% 100%, rgba(198,168,91,0.04) 0%, transparent 100%)' }} />
      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(198,168,91,0.055) 1px, transparent 1px)', backgroundSize: '52px 52px' }} />

      {DECORATION_RAYS.map((ray, i) => (
        <DecorRay key={i} ray={ray} />
      ))}

      <div className="absolute inset-x-0 bottom-0 z-0 pointer-events-none overflow-hidden" style={{ height: '28%' }}>
        <div style={{ position: 'absolute', bottom: 0, left: '-10%', right: '-10%', height: '200%', backgroundImage: 'linear-gradient(rgba(198,168,91,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(198,168,91,0.045) 1px, transparent 1px)', backgroundSize: '72px 72px', transform: 'perspective(550px) rotateX(58deg)', transformOrigin: 'bottom center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #0A0A0A 0%, transparent 50%)' }} />
      </div>

      {/* ── Content layer ── */}
      <div className="relative z-20 max-w-5xl mx-auto px-5 sm:px-8 pt-40 pb-36">

        {/* Section header */}
        <div ref={headRef} className="text-center mb-24">
          <p className="text-[12px] tracking-[0.44em] uppercase mb-5" style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}>
            A History of the Cards
          </p>
          <h2 className="text-4xl sm:text-5xl font-light leading-tight" style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#F2F2F2', textShadow: '0 2px 32px rgba(198,168,91,0.12)' }}>
            Six Centuries of Tarot
          </h2>
          <p className="mt-5 text-lg sm:text-xl leading-relaxed max-w-sm mx-auto" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: '#B3B3B3', fontStyle: 'italic' }}>
            From courtly game to sacred compass — the long, strange journey of 78 cards.
          </p>
          <div className="mt-10 mx-auto w-px" style={{ height: 60, background: 'linear-gradient(to bottom, rgba(198,168,91,0.45), transparent)' }} />
        </div>

        {/* Timeline entries */}
        <div className="flex flex-col">
          {TIMELINE.map((entry, i) => (
            <TimelineEntry
              key={entry.era}
              entry={entry}
              index={i}
              imgRef={setImgRef(i)}
              txtRef={setTxtRef(i)}
              isLast={i === TIMELINE.length - 1}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
