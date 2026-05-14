'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TarotCard } from '@/lib/tarot-data'
import CardArt from './CardArt'
import CardBack from './CardBack'
import Link from 'next/link'

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function DailyCardDisplay({ card }: { card: TarotCard }) {
  const [revealed, setRevealed] = useState(false)

  const arcanaLabel =
    card.arcana === 'major'
      ? 'Major Arcana'
      : `${cap(card.suit ?? '')} · Minor Arcana`

  return (
    <AnimatePresence mode="wait">

      {/* ── Pre-reveal ── */}
      {!revealed && (
        <motion.div
          key="hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
          className="flex flex-col items-center gap-6"
        >
          <div
            className="card-flip-container cursor-pointer"
            style={{
              filter: 'drop-shadow(0 0 28px rgba(198,168,91,0.28))',
              transition: 'filter 0.5s ease',
            }}
            onClick={() => setRevealed(true)}
          >
            <div className="card-inner" style={{ width: 180, height: 315 }}>
              <div className="card-face absolute inset-0">
                <CardBack size="md" />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="relative group px-8 py-3 rounded-full text-sm overflow-hidden transition-all duration-300 hover:scale-105 pulse-ring"
            style={{
              border: '1px solid rgba(198,168,91,0.5)',
              backgroundColor: 'rgba(14,14,14,0.8)',
              color: '#F2F2F2',
              fontFamily: 'var(--font-cinzel), serif',
              letterSpacing: '0.08em',
            }}
          >
            <span className="relative z-10">Reveal Today&apos;s Card</span>
            <div className="absolute inset-0 shimmer" />
          </button>

          <p
            className="text-[10px] tracking-[0.15em]"
            style={{ color: '#7A7A7A', fontFamily: 'var(--font-cinzel), serif' }}
          >
            Tap the card or button to begin
          </p>
        </motion.div>
      )}

      {/* ── Post-reveal ── */}
      {revealed && (
        <motion.div
          key="revealed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10 text-center md:text-left"
        >
          {/* Card image */}
          <motion.div
            initial={{ opacity: 0, rotateY: -75, scale: 0.88 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="shrink-0"
            style={{
              filter: 'drop-shadow(0 0 24px rgba(198,168,91,0.25))',
              transformStyle: 'preserve-3d',
            }}
          >
            <CardArt card={card} size="md" priority />
          </motion.div>

          {/* Reading panel */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.28, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            className="flex flex-col gap-4 flex-1 min-w-0"
          >
            <p
              className="text-[10px] tracking-[0.28em] uppercase"
              style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
            >
              {arcanaLabel}
            </p>

            <h3
              className="text-3xl sm:text-4xl font-light leading-tight"
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                color: '#F2F2F2',
                fontStyle: 'italic',
              }}
            >
              {card.name}
              <span className="ml-2 not-italic" style={{ color: '#7A7A7A' }}>{card.symbol}</span>
            </h3>

            {/* Keywords */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {card.keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-0.5 rounded-full text-xs tracking-wide"
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

            {/* Upright meaning */}
            <p
              className="leading-relaxed"
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: '1.07rem',
                color: 'rgba(242,242,242,0.78)',
                fontStyle: 'italic',
              }}
            >
              {card.upright}
            </p>

            {/* Reflection prompt */}
            <div
              className="rounded-xl px-4 py-3"
              style={{
                backgroundColor: 'rgba(14,14,14,0.65)',
                border: '1px solid #222222',
              }}
            >
              <p
                className="text-[10px] tracking-[0.22em] uppercase mb-1.5"
                style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
              >
                Today&apos;s Reflection
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: '#B3B3B3',
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontStyle: 'italic',
                }}
              >
                How does <em style={{ color: '#C6A85B' }}>{card.keywords[0]}</em> show up
                in your life right now?
              </p>
            </div>

            <Link
              href={`/library/${card.id}`}
              className="inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase
                         transition-colors hover:text-[#F2F2F2] self-center md:self-start mt-1"
              style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
            >
              View Full Card Details →
            </Link>
          </motion.div>
        </motion.div>
      )}

    </AnimatePresence>
  )
}
