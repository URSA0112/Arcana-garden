'use client'

import { motion } from 'framer-motion'
import { Spread, BTN } from '../reading-types'

interface ReadingIntroProps {
  spread: Spread
  setSpread: (s: Spread) => void
  onBegin: () => void
}

const SPREAD_OPTIONS = [
  {
    value: '1' as Spread,
    icon: '◇',
    title: 'One Card',
    subtitle: 'Daily Draw',
    desc: 'A single message for the present moment. Clear, direct, immediate.',
  },
  {
    value: '3' as Spread,
    icon: '✦',
    title: 'Three Cards',
    subtitle: 'Past · Present · Future',
    desc: "A fuller arc — where you've been, where you stand, what's ahead.",
  },
]

export function ReadingIntro({ spread, setSpread, onBegin }: ReadingIntroProps) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto px-5 py-20 flex flex-col items-center"
    >
      {/* Eyebrow */}
      <p
        style={{
          fontFamily: 'var(--font-cinzel), serif',
          fontSize: '0.6rem',
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: 'rgba(198,168,91,0.55)',
          marginBottom: '1.75rem',
        }}
      >
        Arcana Garden
      </p>

      {/* Title */}
      <h1
        className="text-glow text-center"
        style={{
          fontFamily: 'var(--font-cinzel), Georgia, serif',
          fontSize: 'clamp(2.2rem, 6vw, 3.2rem)',
          fontWeight: 300,
          color: '#EBD5AB',
          letterSpacing: '0.06em',
          lineHeight: 1.15,
          marginBottom: '0.5rem',
        }}
      >
        The Reading Room
      </h1>

      {/* Ornament */}
      <div className="ornament" style={{ width: '100%', maxWidth: 280, margin: '1.25rem 0' }}>
        <span style={{ color: 'rgba(198,168,91,0.35)', fontSize: '0.42rem' }}>✦</span>
      </div>

      {/* Tagline */}
      <p
        className="text-center"
        style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontSize: '1.15rem',
          color: '#B3B3B3',
          fontStyle: 'italic',
          lineHeight: 1.65,
          marginBottom: '2.75rem',
          maxWidth: 340,
        }}
      >
        Set your intention. The cards will do the rest.
      </p>

      {/* Spread label */}
      <p
        style={{
          fontFamily: 'var(--font-cinzel), serif',
          fontSize: '0.58rem',
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: 'rgba(198,168,91,0.5)',
          marginBottom: '0.9rem',
        }}
      >
        Choose your spread
      </p>

      {/* Spread cards */}
      <div className="grid grid-cols-2 gap-3 w-full mb-9">
        {SPREAD_OPTIONS.map((opt) => {
          const active = spread === opt.value
          return (
            <motion.button
              key={opt.value}
              type="button"
              onClick={() => setSpread(opt.value)}
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              style={{
                padding: '1.5rem 1rem 1.35rem',
                borderRadius: 14,
                border: active
                  ? '1px solid rgba(198,168,91,0.45)'
                  : '1px solid rgba(198,168,91,0.1)',
                background: active
                  ? 'rgba(198,168,91,0.08)'
                  : 'rgba(14,14,14,0.55)',
                boxShadow: active
                  ? '0 0 32px rgba(198,168,91,0.1), inset 0 1px 0 rgba(198,168,91,0.06)'
                  : 'none',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
              }}
            >
              <div
                style={{
                  fontSize: '1.45rem',
                  marginBottom: '0.7rem',
                  color: active ? '#C6A85B' : 'rgba(198,168,91,0.25)',
                  transition: 'color 0.25s',
                }}
              >
                {opt.icon}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-cinzel), serif',
                  fontSize: '0.6rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: active ? '#EBD5AB' : '#555',
                  marginBottom: '0.35rem',
                  transition: 'color 0.25s',
                }}
              >
                {opt.title}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontSize: '0.9rem',
                  color: active ? '#C6A85B' : '#444',
                  fontStyle: 'italic',
                  marginBottom: '0.6rem',
                  transition: 'color 0.25s',
                }}
              >
                {opt.subtitle}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontSize: '0.85rem',
                  color: '#555',
                  lineHeight: 1.6,
                }}
              >
                {opt.desc}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onBegin}
        className="relative px-10 py-3 rounded-full overflow-hidden hover:scale-105 transition-transform pulse-ring"
        style={BTN}
      >
        <span className="relative z-10">✦ &nbsp; Begin the Reading</span>
        <div className="absolute inset-0 shimmer" />
      </button>

      {/* Privacy note */}
      <p
        style={{
          marginTop: '2rem',
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: '0.82rem',
          color: '#444',
          fontStyle: 'italic',
          textAlign: 'center',
        }}
      >
        Your reading stays private — nothing leaves your browser.
      </p>
    </motion.div>
  )
}
