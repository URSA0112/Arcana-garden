'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { READING_STEPS, BEGINNER_TIPS, CLOSING_QUOTE, TAROT_MYTHS } from './data/hero'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
})

export default function TarotStudyHero() {
  return (
    <div style={{ backgroundColor: '#0A0A0A' }}>

      {/* ── Hero section ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '100vh' }}>

        {/* Background image */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: 'url(https://res.cloudinary.com/dt43fy6cr/image/upload/v1779094347/37eeb6b0-367d-48ca-9860-6dc24e026103_hb8z9w.png)',
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
            opacity: 0.22, pointerEvents: 'none',
          }}
        />
        {/* Vignette */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'radial-gradient(ellipse 85% 80% at 50% 35%, rgba(10,10,10,0.25) 0%, rgba(10,10,10,0.7) 65%, rgba(10,10,10,0.92) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Decoration layer */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none z-[2]"
          style={{
            height: '65%',
            background: 'radial-gradient(ellipse 60% 50% at 65% 0%, rgba(198,168,91,0.06) 0%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(198,168,91,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Content */}
        <div className="relative z-[3] max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">

            {/* Left: headline + CTAs + tips */}
            <div className="flex flex-col">

              <motion.p {...fadeUp(0)} className="text-[11px] tracking-[0.44em] uppercase mb-6" style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}>
                Beginner Friendly Guide
              </motion.p>

              <motion.h1 {...fadeUp(0.08)} className="text-5xl sm:text-6xl font-light leading-tight mb-5" style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#F2F2F2' }}>
                Learn Tarot
                <span
                  className="block mt-1"
                  style={{
                    background: 'linear-gradient(135deg, #9A7B2E 0%, #C6A85B 40%, #F0CC6C 65%, #C6A85B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Step by Step
                </span>
              </motion.h1>

              <motion.p {...fadeUp(0.16)} className="text-lg sm:text-xl leading-relaxed mb-10 max-w-md" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: '#B3B3B3', fontStyle: 'italic' }}>
                Discover how to prepare for readings, understand tarot spreads,
                interpret symbolism, and build your intuition naturally.
              </motion.p>

              {/* CTAs */}
              <motion.div {...fadeUp(0.22)} className="flex flex-wrap gap-3 mb-12">
                <Link
                  href="/study/spreads"
                  className="relative px-7 py-3 rounded-full overflow-hidden hover:scale-105 transition-transform text-xs tracking-[0.1em] uppercase"
                  style={{
                    background: 'linear-gradient(135deg, rgba(198,168,91,0.85) 0%, #C6A85B 50%, rgba(198,168,91,0.85) 100%)',
                    color: '#0A0A0A',
                    fontFamily: 'var(--font-cinzel), serif',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span className="relative z-10">✦ &nbsp; Explore Spreads</span>
                  <div className="absolute inset-0 shimmer" />
                </Link>

                <Link
                  href="/study/quiz"
                  className="px-7 py-3 rounded-full text-xs tracking-[0.1em] uppercase hover:scale-105 transition-transform inline-flex items-center"
                  style={{
                    border: '1px solid rgba(198,168,91,0.3)',
                    color: '#C6A85B',
                    fontFamily: 'var(--font-cinzel), serif',
                  }}
                >
                  Test Your Knowledge →
                </Link>
              </motion.div>

              {/* Beginner tips */}
              <motion.div {...fadeUp(0.3)} className="flex flex-col gap-2.5">
                {BEGINNER_TIPS.map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl px-4 py-3 border"
                    style={{
                      borderColor: 'rgba(198,168,91,0.1)',
                      backgroundColor: 'rgba(14,14,14,0.6)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <span className="mt-0.5 shrink-0 text-xs" style={{ color: '#C6A85B' }}>✦</span>
                    <p style={{ color: 'rgba(179,179,179,0.85)', fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '1rem', lineHeight: '1.65' }}>
                      {tip}
                    </p>
                  </div>
                ))}
              </motion.div>

            </div>

            {/* Right: reading flow card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' as const }}
              className="relative"
            >
              {/* Decorative floating card — top left */}
              <div
                className="absolute -left-6 top-8 hidden lg:flex items-center justify-center rounded-2xl border"
                style={{ width: 64, height: 96, borderColor: 'rgba(198,168,91,0.2)', backgroundColor: 'rgba(14,14,14,0.8)', transform: 'rotate(-10deg)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
              >
                <span style={{ color: 'rgba(198,168,91,0.5)', fontSize: '1.4rem' }}>◇</span>
              </div>

              {/* Decorative floating card — bottom right */}
              <div
                className="absolute -right-5 bottom-12 hidden lg:flex items-center justify-center rounded-2xl border"
                style={{ width: 64, height: 96, borderColor: 'rgba(198,168,91,0.25)', backgroundColor: 'rgba(14,14,14,0.8)', transform: 'rotate(8deg)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
              >
                <span style={{ color: 'rgba(198,168,91,0.5)', fontSize: '1.4rem' }}>✦</span>
              </div>

              {/* Reading flow panel */}
              <div
                className="rounded-2xl border p-7"
                style={{ borderColor: 'rgba(198,168,91,0.18)', backgroundColor: 'rgba(14,14,14,0.75)', backdropFilter: 'blur(16px)' }}
              >
                <div className="flex items-start justify-between mb-7">
                  <div>
                    <p className="text-[11px] tracking-[0.3em] uppercase mb-2" style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}>
                      Tarot Reading Flow
                    </p>
                    <h2 className="text-2xl font-light" style={{ fontFamily: 'var(--font-cinzel), serif', color: '#F2F2F2' }}>
                      Your First Reading
                    </h2>
                  </div>
                  <div
                    className="flex items-center justify-center rounded-xl shrink-0"
                    style={{ width: 48, height: 48, background: 'linear-gradient(135deg, rgba(198,168,91,0.2) 0%, rgba(198,168,91,0.1) 100%)', border: '1px solid rgba(198,168,91,0.25)', fontSize: '1.3rem' }}
                  >
                    🃏
                  </div>
                </div>

                <div className="space-y-3">
                  {READING_STEPS.map((step, i) => (
                    <div
                      key={i}
                      className="rounded-xl border p-4"
                      style={{ borderColor: 'rgba(198,168,91,0.1)', backgroundColor: 'rgba(10,10,10,0.5)' }}
                    >
                      <div className="flex gap-4">
                        <div
                          className="flex items-center justify-center rounded-xl shrink-0"
                          style={{ width: 44, height: 44, border: '1px solid rgba(198,168,91,0.15)', backgroundColor: 'rgba(198,168,91,0.05)', fontSize: '1.35rem', lineHeight: 1 }}
                        >
                          {step.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2.5 mb-1">
                            <span className="text-[11px]" style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}>{step.number}</span>
                            <h3 className="text-sm font-light" style={{ fontFamily: 'var(--font-cinzel), serif', color: '#F2F2F2' }}>{step.title}</h3>
                          </div>
                          <p style={{ color: '#7A7A7A', fontFamily: 'var(--font-cormorant), serif', fontSize: '0.95rem', lineHeight: '1.65' }}>
                            {step.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl px-5 py-4 border" style={{ borderColor: 'rgba(198,168,91,0.12)', backgroundColor: 'rgba(198,168,91,0.04)' }}>
                  <p style={{ color: 'rgba(179,179,179,0.75)', fontFamily: 'var(--font-cormorant), Georgia, serif', fontStyle: 'italic', fontSize: '0.95rem', lineHeight: '1.7' }}>
                    {CLOSING_QUOTE}
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Myth Busting section ── */}
      <section className="relative" style={{ borderTop: '1px solid rgba(198,168,91,0.08)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }}
            className="text-center mb-14"
          >
            <p className="text-[11px] tracking-[0.44em] uppercase mb-4" style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}>
              Common Misconceptions
            </p>
            <h2 className="text-4xl sm:text-5xl font-light" style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#F2F2F2' }}>
              Myth Busting
            </h2>
            <p className="mt-4 max-w-md mx-auto" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '1.1rem', color: '#B3B3B3', fontStyle: 'italic' }}>
              The questions every beginner asks — answered honestly.
            </p>
          </motion.div>

          {/* Myth cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TAROT_MYTHS.map((myth, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const }}
                className="rounded-2xl border p-6"
                style={{
                  borderColor: 'rgba(198,168,91,0.13)',
                  backgroundColor: 'rgba(14,14,14,0.7)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {/* Myth question */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="shrink-0 mt-0.5" style={{ color: '#C6A85B', fontSize: '0.75rem' }}>◈</span>
                  <p
                    className="font-light leading-snug"
                    style={{ fontFamily: 'var(--font-cinzel), serif', color: '#EBD5AB', fontSize: '0.85rem', letterSpacing: '0.02em' }}
                  >
                    {myth.question}
                  </p>
                </div>

                {/* Divider */}
                <div className="mb-3 ml-6 h-px" style={{ background: 'rgba(198,168,91,0.1)' }} />

                {/* Truth */}
                <p
                  className="ml-6 leading-relaxed"
                  style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '1.02rem', lineHeight: '1.72', color: '#B3B3B3', fontStyle: 'italic' }}
                >
                  {myth.truth}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

    </div>
  )
}
