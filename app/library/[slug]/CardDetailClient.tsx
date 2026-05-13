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
        borderColor: 'rgba(98,129,65,0.22)',
        backgroundColor: 'rgba(26,36,32,0.65)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color: '#628141', fontSize: '0.85rem' }}>{glyph}</span>
        <h2
          className="text-[10px] tracking-[0.22em] uppercase"
          style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}
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
    <div className="max-w-xl mx-auto px-4 py-12">

      {/* Back link */}
      <div className="mb-10">
        <Link
          href="/library"
          className="text-[10px] tracking-[0.15em] uppercase transition-colors hover:text-[#8BAE66]"
          style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}
        >
          ← Library
        </Link>
      </div>

      {/* ── Hero card image ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="flex justify-center mb-10"
        style={{ filter: 'drop-shadow(0 0 36px rgba(98,129,65,0.38))' }}
      >
        <CardArt card={card} size="lg" priority />
      </motion.div>

      {/* ── Title block ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        className="text-center mb-8"
      >
        <p
          className="text-[10px] tracking-[0.32em] uppercase mb-3"
          style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}
        >
          {arcanaLabel}
        </p>

        <h1
          className="text-5xl font-bold mb-2 text-glow leading-tight"
          style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#EBD5AB' }}
        >
          {card.name}
        </h1>

        <p
          className="text-2xl mb-6"
          style={{ color: '#4a5e40' }}
          aria-hidden
        >
          {card.symbol}
        </p>

        {/* Keyword / theme tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {card.keywords.map((kw) => (
            <span
              key={kw}
              className="px-3 py-1 rounded-full text-xs tracking-wide"
              style={{
                backgroundColor: 'rgba(34,48,40,0.8)',
                border: '1px solid rgba(98,129,65,0.25)',
                color: '#8BAE66',
              }}
            >
              {kw}
            </span>
          ))}
        </div>

        {/* Short description */}
        <p
          className="leading-relaxed max-w-sm mx-auto"
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontStyle: 'italic',
            fontSize: '1.1rem',
            color: '#8BAE66',
          }}
        >
          {card.description}
        </p>
      </motion.div>

      {/* ── Ornament ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.28 }}
        className="ornament my-8"
      >
        <span style={{ color: '#3a5228', fontSize: '0.6rem' }}>✦</span>
      </motion.div>

      {/* ── Content sections ── */}
      <div className="space-y-4">

        {/* Upright */}
        <SectionCard label="Upright Meaning" glyph="☀" delay={0.32}>
          <p
            className="leading-relaxed"
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: '1.05rem',
              color: '#EBD5AB',
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
              color: '#c8b89a',
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
              color: '#8BAE66',
            }}
          >
            {card.symbolism}
          </p>
        </SectionCard>

        {/* Numerology + Element grid */}
        <div className="grid grid-cols-2 gap-4">

          {/* Numerology */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="rounded-2xl p-5 border flex flex-col"
            style={{
              borderColor: 'rgba(98,129,65,0.22)',
              backgroundColor: 'rgba(26,36,32,0.65)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: '#628141', fontSize: '0.85rem' }}>#</span>
              <h2
                className="text-[10px] tracking-[0.22em] uppercase"
                style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}
              >
                Numerology
              </h2>
            </div>
            <div
              className="text-4xl font-bold mb-1"
              style={{ fontFamily: 'var(--font-cinzel), serif', color: '#EBD5AB' }}
            >
              {card.number}
            </div>
            <div
              className="text-xs mb-3 tracking-wide"
              style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.65rem' }}
            >
              {numerology.title}
            </div>
            <p
              className="text-sm leading-relaxed mt-auto"
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                color: '#8BAE66',
                fontSize: '0.95rem',
              }}
            >
              {numerology.meaning}
            </p>
          </motion.div>

          {/* Element */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            className="rounded-2xl p-5 border flex flex-col"
            style={{
              borderColor: 'rgba(98,129,65,0.22)',
              backgroundColor: 'rgba(26,36,32,0.65)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: '#628141', fontSize: '0.85rem' }}>◇</span>
              <h2
                className="text-[10px] tracking-[0.22em] uppercase"
                style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}
              >
                Element
              </h2>
            </div>
            <div className="text-3xl mb-1" aria-label={element.name}>
              {element.glyph}
            </div>
            <div
              className="text-xs mb-1 tracking-wide"
              style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.65rem' }}
            >
              {element.name}
              {element.ruler ? ` · ${element.ruler}` : ''}
            </div>
            <p
              className="text-sm leading-relaxed mt-auto"
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                color: '#8BAE66',
                fontSize: '0.95rem',
              }}
            >
              {element.quality}
            </p>
          </motion.div>

        </div>
      </div>

      {/* Bottom back link */}
      <div className="mt-12 text-center">
        <Link
          href="/library"
          className="text-[10px] tracking-[0.15em] uppercase transition-colors hover:text-[#8BAE66]"
          style={{ color: '#4a5e40', fontFamily: 'var(--font-cinzel), serif' }}
        >
          ← Back to Library
        </Link>
      </div>
    </div>
  )
}
