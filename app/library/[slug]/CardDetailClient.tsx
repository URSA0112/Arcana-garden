'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { TarotCard, getElement, getNumerology } from '@/lib/tarot-data'
import CardArt from '../../components/CardArt'

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function SectionCard({
  label,
  glyph,
  children,
  delay = 0,
}: {
  label: string
  glyph: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-2xl p-6 border"
      style={{
        borderColor: 'rgba(198,168,91,0.18)',
        backgroundColor: 'rgba(14,14,14,0.7)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color: '#C6A85B', fontSize: '0.85rem' }}>{glyph}</span>
        <h2
          className="text-[10px] tracking-[0.22em] uppercase"
          style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
        >
          {label}
        </h2>
      </div>
      {children}
    </motion.div>
  )
}

export default function CardDetailClient({ card }: { card: TarotCard }) {
  const element = getElement(card)
  const numerology = getNumerology(card.number)

  const arcanaLabel =
    card.arcana === 'major'
      ? 'Major Arcana'
      : `${capitalize(card.suit ?? '')} · Minor Arcana`

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Back link */}
        <div className="mb-10">
          <Link
            href="/library"
            className="text-[10px] tracking-[0.15em] uppercase transition-colors hover:text-[#C6A85B]"
            style={{ color: '#7A7A7A', fontFamily: 'var(--font-cinzel), serif' }}
          >
            ← Library
          </Link>
        </div>

        {/* ── 2-col layout: text above on mobile, image left on desktop ── */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-14 items-start">

          {/* Image — below text on mobile (order-2), left on desktop (order-1, sticky) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="order-2 md:order-1 flex justify-center md:sticky md:top-24"
            style={{ filter: 'drop-shadow(0 0 36px rgba(198,168,91,0.28))' }}
          >
            <CardArt card={card} size="lg" priority />
          </motion.div>

          {/* Text — above image on mobile (order-1), right on desktop (order-2) */}
          <div className="order-1 md:order-2 flex flex-col gap-4">

            {/* Title block */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.45 }}
              className="mb-2"
            >
              <p
                className="text-[10px] tracking-[0.32em] uppercase mb-3"
                style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
              >
                {arcanaLabel}
              </p>

              <h1
                className="text-4xl md:text-5xl font-light mb-2 text-glow leading-tight"
                style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#F2F2F2' }}
              >
                {card.name}
              </h1>

              <p
                className="text-2xl mb-4"
                style={{ color: '#7A7A7A' }}
                aria-hidden
              >
                {card.symbol}
              </p>

              {/* Keywords */}
              <div className="flex flex-wrap gap-2 mb-4">
                {card.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1 rounded-full text-xs tracking-wide"
                    style={{
                      backgroundColor: 'rgba(20,20,20,0.8)',
                      border: '1px solid rgba(198,168,91,0.18)',
                      color: '#B3B3B3',
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>

              {/* Short description */}
              <p
                className="leading-relaxed"
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: '1.1rem',
                  color: '#B3B3B3',
                }}
              >
                {card.description}
              </p>
            </motion.div>

            {/* Ornament */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
              className="ornament"
            >
              <span style={{ color: 'rgba(198,168,91,0.4)', fontSize: '0.6rem' }}>✦</span>
            </motion.div>

            {/* Upright */}
            <SectionCard label="Upright Meaning" glyph="☀" delay={0.32}>
              <p
                className="leading-relaxed"
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: '1.05rem',
                  color: '#F2F2F2',
                }}
              >
                {card.upright}
              </p>
            </SectionCard>

            {/* Reversed */}
            <SectionCard label="Reversed Meaning" glyph="↕" delay={0.38}>
              <p
                className="leading-relaxed"
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: '1.05rem',
                  color: '#B3B3B3',
                }}
              >
                {card.reversed}
              </p>
            </SectionCard>

            {/* Symbolism */}
            <SectionCard label="Symbolism" glyph="◈" delay={0.44}>
              <p
                className="leading-relaxed"
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: '1.05rem',
                  color: '#B3B3B3',
                }}
              >
                {card.symbolism}
              </p>
            </SectionCard>

            {/* Numerology + Element grid */}
            <div className="grid grid-cols-2 gap-4">

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="rounded-2xl p-5 border flex flex-col"
                style={{
                  borderColor: 'rgba(198,168,91,0.18)',
                  backgroundColor: 'rgba(14,14,14,0.7)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ color: '#C6A85B', fontSize: '0.85rem' }}>#</span>
                  <h2
                    className="text-[10px] tracking-[0.22em] uppercase"
                    style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
                  >
                    Numerology
                  </h2>
                </div>
                <div
                  className="text-4xl font-light mb-1"
                  style={{ fontFamily: 'var(--font-cinzel), serif', color: '#F2F2F2' }}
                >
                  {card.number}
                </div>
                <div
                  className="mb-3 tracking-wide"
                  style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.65rem' }}
                >
                  {numerology.title}
                </div>
                <p
                  className="leading-relaxed mt-auto"
                  style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    color: '#B3B3B3',
                    fontSize: '0.95rem',
                  }}
                >
                  {numerology.meaning}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.4 }}
                className="rounded-2xl p-5 border flex flex-col"
                style={{
                  borderColor: 'rgba(198,168,91,0.18)',
                  backgroundColor: 'rgba(14,14,14,0.7)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ color: '#C6A85B', fontSize: '0.85rem' }}>◇</span>
                  <h2
                    className="text-[10px] tracking-[0.22em] uppercase"
                    style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
                  >
                    Element
                  </h2>
                </div>
                <div className="text-3xl mb-1" aria-label={element.name}>
                  {element.glyph}
                </div>
                <div
                  className="mb-1 tracking-wide"
                  style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.65rem' }}
                >
                  {element.name}
                  {element.ruler ? ` · ${element.ruler}` : ''}
                </div>
                <p
                  className="leading-relaxed mt-auto"
                  style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    color: '#B3B3B3',
                    fontSize: '0.95rem',
                  }}
                >
                  {element.quality}
                </p>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Bottom back link */}
        <div className="mt-12 text-center">
          <Link
            href="/library"
            className="text-[10px] tracking-[0.15em] uppercase transition-colors hover:text-[#C6A85B]"
            style={{ color: '#7A7A7A', fontFamily: 'var(--font-cinzel), serif' }}
          >
            ← Back to Library
          </Link>
        </div>
      </div>
    </div>
  )
}
