'use client'

import { motion } from 'framer-motion'
import type { SpreadDefinition } from '../data/spreads'
import { DIFFICULTY_STYLES } from '../data/spreads'

interface SpreadCardProps {
  spread: SpreadDefinition
  index:  number
}

export function SpreadCard({ spread, index }: SpreadCardProps) {
  const badge = DIFFICULTY_STYLES[spread.difficulty]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col rounded-2xl border overflow-hidden group"
      style={{
        borderColor: 'rgba(198,168,91,0.14)',
        backgroundColor: 'rgba(14,14,14,0.75)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Spread image */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '3 / 4', backgroundColor: '#0d0d0d' }}
      >
        <img
          src={spread.image}
          alt={spread.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ opacity: 0.92 }}
          loading="lazy"
        />
        {/* Subtle inner shadow to ground the image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 -40px 40px rgba(14,14,14,0.6)',
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[11px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
            style={{ color: badge.color, border: `1px solid ${badge.border}`, backgroundColor: badge.bg }}
          >
            {spread.difficulty}
          </span>
          <span
            className="text-[11px] tracking-[0.1em] px-2.5 py-1 rounded-full"
            style={{ color: '#7A7A7A', border: '1px solid rgba(198,168,91,0.1)', backgroundColor: 'rgba(255,255,255,0.02)' }}
          >
            {spread.cardCount} cards
          </span>
        </div>

        {/* Name + subtitle */}
        <div>
          <h3
            className="text-lg font-light leading-snug mb-0.5"
            style={{ fontFamily: 'var(--font-cinzel), serif', color: '#F2F2F2' }}
          >
            {spread.name}
          </h3>
          <p
            className="text-xs tracking-[0.06em]"
            style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
          >
            {spread.subtitle}
          </p>
        </div>

        {/* Description */}
        <p
          className="leading-relaxed mt-auto"
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: '1rem',
            lineHeight: '1.72',
            color: '#B3B3B3',
            fontStyle: 'italic',
          }}
        >
          {spread.description}
        </p>

      </div>
    </motion.div>
  )
}
