'use client'

import dynamic from 'next/dynamic'
import { TarotCard } from '@/lib/tarot-data'
import { useHeroAnimation } from './hooks/useHeroAnimation'
import DailyCardDisplay from './DailyCardDisplay'

const FloatingCards3D = dynamic(() => import('./FloatingCards3D'), { ssr: false })

export default function HeroSection({ card }: { card: TarotCard }) {
  const { labelRef, titleRef, subRef, dividerRef, cardRef } = useHeroAnimation()

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#0A0A0A' }}
    >
      {/* Layer 0: 3D floating cards canvas */}
      <div className="absolute inset-0 z-0">
        <FloatingCards3D />
      </div>

      {/* Layer 1: gradient vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 70% at 50% 48%,
              rgba(10,10,10,0.08) 0%,
              rgba(10,10,10,0.70) 52%,
              rgba(10,10,10,0.97) 100%
            ),
            linear-gradient(to bottom,
              rgba(10,10,10,0.55) 0%,
              transparent        22%,
              transparent        72%,
              rgba(10,10,10,1)   100%
            )
          `,
        }}
      />

      {/* Layer 2: content */}
      <div className="relative z-20 w-full max-w-2xl mx-auto px-4 sm:px-6 py-24 sm:py-32 flex flex-col items-center text-center">

        <p
          ref={labelRef}
          className="text-[11px] tracking-[0.38em] uppercase mb-5"
          style={{ opacity: 0, transform: 'translateY(22px)', color: 'rgba(198,168,91,0.75)', fontFamily: 'var(--font-cinzel), serif' }}
        >
          Tarot · Learning · Reflection
        </p>

        <h1
          ref={titleRef}
          className="text-outline-anim text-7xl sm:text-[8rem] lg:text-[11rem] leading-[1.02] tracking-[0.14em] mb-6"
          style={{
            opacity: 0,
            transform: 'translateY(50px)',
            fontFamily: 'var(--font-title), serif',
            fontWeight: 400,
            background: 'linear-gradient(135deg, #9A7B2E 0%, #C6A85B 28%, #F0CC6C 52%, #D4A843 72%, #9A7B2E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Arcana Garden
        </h1>

        <p
          ref={subRef}
          className="text-lg sm:text-xl md:text-2xl mb-10 max-w-md leading-relaxed"
          style={{
            opacity: 0,
            transform: 'translateY(26px)',
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            color: 'rgba(178,178,178,0.82)',
            fontStyle: 'italic',
            textShadow: '0 1px 10px rgba(0,0,0,0.9)',
          }}
        >
          Step into the grove where the cards remember what you forget.
        </p>

        <div ref={dividerRef} className="ornament mb-10 w-full max-w-xs" style={{ opacity: 0 }}>
          <span
            className="text-[11px] tracking-[0.3em] uppercase"
            style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
          >
            Card of the Day
          </span>
        </div>

        <div ref={cardRef} className="w-full" style={{ opacity: 0, transform: 'translateY(32px)' }}>
          <DailyCardDisplay card={card} />
        </div>

      </div>
    </section>
  )
}
