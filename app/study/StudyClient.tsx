'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TarotCard } from '@/lib/tarot-data'
import CardArt from '../components/CardArt'

type Mode = 'all' | 'major' | 'minor'

const modeLabels: Record<Mode, string> = {
  all: 'All 78',
  major: 'Major (22)',
  minor: 'Minor (56)',
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function StudyClient({ cards }: { cards: TarotCard[] }) {
  const [mode, setMode] = useState<Mode>('all')
  const [deck, setDeck] = useState<TarotCard[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [side, setSide] = useState<'upright' | 'reversed'>('upright')
  const [started, setStarted] = useState(false)

  const start = useCallback(() => {
    const pool = cards.filter((c) =>
      mode === 'all' ? true : mode === 'major' ? c.arcana === 'major' : c.arcana === 'minor'
    )
    setDeck(shuffle(pool))
    setIndex(0)
    setFlipped(false)
    setSide(Math.random() < 0.3 ? 'reversed' : 'upright')
    setStarted(true)
  }, [cards, mode])

  const next = () => {
    if (index + 1 >= deck.length) {
      setStarted(false)
      return
    }
    setFlipped(false)
    setSide(Math.random() < 0.3 ? 'reversed' : 'upright')
    setIndex((i) => i + 1)
  }

  const current = deck[index]
  const progress = deck.length ? ((index + 1) / deck.length) * 100 : 0

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p
          className="text-xs tracking-[0.3em] uppercase mb-4"
          style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}
        >
          Flashcard Mode
        </p>
        <h1
          className="text-5xl font-bold mb-3 text-glow"
          style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#EBD5AB' }}
        >
          Study Mode
        </h1>
        <p
          className="text-xl mb-10"
          style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: '#8BAE66', fontStyle: 'italic' }}
        >
          Tap each card to reveal its meaning. Build your arcana knowledge.
        </p>

        <div className="flex justify-center gap-3 mb-10">
          {(['all', 'major', 'minor'] as Mode[]).map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setMode(m)}
              className="px-5 py-2.5 rounded-xl text-sm transition-all duration-200 hover:scale-[1.03]"
              style={{
                border: `1px solid ${mode === m ? 'rgba(139,174,102,0.5)' : 'rgba(98,129,65,0.2)'}`,
                backgroundColor: mode === m ? 'rgba(98, 129, 65, 0.15)' : 'transparent',
                color: mode === m ? '#EBD5AB' : '#7DA55A',
                fontFamily: mode === m ? 'var(--font-cinzel), serif' : 'inherit',
                fontSize: mode === m ? '0.7rem' : '0.875rem',
                letterSpacing: mode === m ? '0.05em' : 0,
              }}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={start}
          className="relative group px-10 py-3.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:glow-primary overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #4a6632 0%, #628141 50%, #4a6632 100%)',
            color: '#EBD5AB',
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
          }}
        >
          <span className="relative z-10">Begin Study Session</span>
          <div className="absolute inset-0 shimmer" />
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      {/* Progress */}
      <div className="mb-8">
        <div
          className="flex justify-between text-xs mb-2"
          style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif', letterSpacing: '0.05em' }}
        >
          <span>Card {index + 1} / {deck.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: 'rgba(98, 129, 65, 0.15)', border: '1px solid rgba(98,129,65,0.1)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #4a6632, #8BAE66)',
              width: `${progress}%`,
            }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${current.id}-${index}`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="rounded-3xl border overflow-hidden cursor-pointer transition-shadow duration-300 hover:glow-sm"
          style={{
            borderColor: 'rgba(98, 129, 65, 0.25)',
            backgroundColor: 'rgba(26, 36, 32, 0.7)',
            backdropFilter: 'blur(14px)',
          }}
          onClick={() => setFlipped((f) => !f)}
        >
          {!flipped ? (
            <div className="flex flex-col items-center py-12 px-6 gap-5 select-none">
              <motion.div
                animate={{ rotate: side === 'reversed' ? 180 : 0 }}
                style={{ filter: 'drop-shadow(0 0 20px rgba(98,129,65,0.3))' }}
              >
                <CardArt card={current} size="md" />
              </motion.div>
              <p
                className="text-sm tracking-wide"
                style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.7rem', letterSpacing: '0.1em' }}
              >
                {side === 'reversed' ? '( reversed ) · ' : ''}Tap to reveal meaning
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 px-8"
            >
              <h2
                className="text-3xl font-bold mb-1 text-center"
                style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: '#EBD5AB', fontStyle: 'italic' }}
              >
                {current.name}
              </h2>
              <p
                className="text-xs text-center mb-5 tracking-[0.15em] uppercase"
                style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}
              >
                {side === 'reversed' ? 'Reversed' : 'Upright'}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {current.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-0.5 rounded-full text-xs"
                    style={{
                      backgroundColor: 'rgba(34, 48, 40, 0.8)',
                      border: '1px solid rgba(98,129,65,0.25)',
                      color: '#8BAE66',
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>

              <p
                className="leading-relaxed text-center"
                style={{ color: '#8BAE66', fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '1.1rem' }}
              >
                {side === 'reversed' ? current.reversed : current.upright}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex justify-between items-center mt-7">
        <button
          type="button"
          onClick={() => setStarted(false)}
          className="text-xs tracking-[0.1em] uppercase transition-colors hover:text-[#7DA55A]"
          style={{ color: '#4a5e40', fontFamily: 'var(--font-cinzel), serif' }}
        >
          ← End Session
        </button>

        {flipped && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={next}
            className="px-6 py-2.5 rounded-xl text-xs font-medium hover:scale-105 transition-all hover:glow-sm tracking-[0.08em] uppercase"
            style={{
              backgroundColor: '#628141',
              color: '#EBD5AB',
              fontFamily: 'var(--font-cinzel), serif',
            }}
          >
            {index + 1 >= deck.length ? 'Finish ✓' : 'Next Card →'}
          </motion.button>
        )}
      </div>
    </div>
  )
}
