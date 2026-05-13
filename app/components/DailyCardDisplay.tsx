'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TarotCard } from '@/lib/tarot-data'
import CardArt from './CardArt'
import CardBack from './CardBack'
import Link from 'next/link'

export default function DailyCardDisplay({ card }: { card: TarotCard }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="flex flex-col items-center">
      <div
        className="card-flip-container mb-8 cursor-pointer"
        onClick={() => setRevealed(true)}
        style={{ filter: revealed ? 'drop-shadow(0 0 28px rgba(98,129,65,0.35))' : 'none', transition: 'filter 0.6s ease' }}
      >
        <div className={`card-inner ${revealed ? 'flipped' : ''}`} style={{ width: 180, height: 315 }}>
          <div className="card-face absolute inset-0">
            <CardBack size="md" />
          </div>
          <div className="card-face card-back absolute inset-0">
            <CardArt card={card} size="md" priority />
          </div>
        </div>
      </div>

      {!revealed && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setRevealed(true)}
          className="relative group px-8 py-3 rounded-full text-sm font-medium overflow-hidden transition-all duration-300 hover:scale-105 pulse-ring"
          style={{
            border: '1px solid rgba(98, 129, 65, 0.6)',
            backgroundColor: 'rgba(26, 36, 32, 0.7)',
            color: '#EBD5AB',
            fontFamily: 'var(--font-cinzel), serif',
            letterSpacing: '0.08em',
          }}
        >
          <span className="relative z-10">Reveal Today&apos;s Card</span>
          <div className="absolute inset-0 shimmer" />
        </motion.button>
      )}

      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="text-center max-w-sm w-full"
        >
          <h3
            className="text-3xl font-semibold mb-3 text-glow"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: '#EBD5AB', fontStyle: 'italic' }}
          >
            {card.name}
          </h3>

          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {card.keywords.map((kw) => (
              <span
                key={kw}
                className="px-3 py-0.5 rounded-full text-xs tracking-wide"
                style={{
                  backgroundColor: 'rgba(34, 48, 40, 0.8)',
                  border: '1px solid rgba(98, 129, 65, 0.25)',
                  color: '#8BAE66',
                }}
              >
                {kw}
              </span>
            ))}
          </div>

          <p
            className="leading-relaxed mb-6"
            style={{ color: '#8BAE66', fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '1.05rem' }}
          >
            {card.upright}
          </p>

          <Link
            href={`/library/${card.id}`}
            className="text-xs tracking-[0.15em] uppercase transition-colors hover:text-[#EBD5AB]"
            style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}
          >
            View Full Details →
          </Link>
        </motion.div>
      )}
    </div>
  )
}
