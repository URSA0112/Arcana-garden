'use client'

import { motion } from 'framer-motion'
import { SPREAD_DEFINITIONS } from '../data/spreads'
import { SpreadCard } from './SpreadCard'

export function SpreadShowcase() {
  return (
    <section
      id="spreads"
      className="relative overflow-hidden"
      style={{ backgroundColor: '#0A0A0A' }}
    >
      {/* Top separator fade */}
      <div
        className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{ height: 120, background: 'linear-gradient(to bottom, #0A0A0A 0%, transparent 100%)' }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none z-0"
        style={{
          height: '50%',
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(198,168,91,0.05) 0%, transparent 100%)',
        }}
      />

      <div className="relative z-20 max-w-6xl mx-auto px-5 sm:px-8 pt-24 pb-32">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <p
            className="text-[11px] tracking-[0.44em] uppercase mb-4"
            style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
          >
            Tarot Spreads
          </p>
          <h2
            className="text-4xl sm:text-5xl font-light mb-6"
            style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#F2F2F2' }}
          >
            How Spreads Work
          </h2>

          {/* What is a spread */}
          <div className="max-w-2xl mx-auto space-y-3">
            <p
              className="text-lg sm:text-xl leading-relaxed"
              style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: '#B3B3B3', fontStyle: 'italic' }}
            >
              A tarot spread is a pattern of card positions, where each position carries
              a specific question or theme. Instead of reading one card in isolation, a
              spread creates a structured conversation between the cards.
            </p>
            <p
              className="text-base leading-relaxed"
              style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: 'rgba(179,179,179,0.65)', fontStyle: 'italic' }}
            >
              The layout does not change what the cards mean — it changes what question
              each card is answering. A three-card spread asks "past, present, future."
              A six-card spread might ask "what is hidden, what is helping, what to release."
            </p>
          </div>

          {/* Ornament */}
          <div className="ornament mt-8">
            <span style={{ color: 'rgba(198,168,91,0.35)', fontSize: '0.5rem' }}>✦</span>
          </div>
        </motion.div>

        {/* Spread cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SPREAD_DEFINITIONS.map((spread, i) => (
            <SpreadCard key={spread.name} spread={spread} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-12 text-sm"
          style={{ color: '#7A7A7A', fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic' }}
        >
          Start with the 1·2·3 Method. Add complexity only when a simpler spread feels limiting.
        </motion.p>

      </div>
    </section>
  )
}
