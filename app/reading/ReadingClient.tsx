'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TarotCard } from '@/lib/tarot-data'
import CardArt from '../components/CardArt'
import CardBack from '../components/CardBack'

type Spread = '1' | '3'

interface DrawnCard {
  card: TarotCard
  reversed: boolean
  flipped: boolean
  label?: string
}

const spreadLabels: Record<Spread, string[]> = {
  '1': ['Your Message'],
  '3': ['Past', 'Present', 'Future'],
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ReadingClient({ cards }: { cards: TarotCard[] }) {
  const [spread, setSpread] = useState<Spread>('3')
  const [drawn, setDrawn] = useState<DrawnCard[]>([])
  const [shuffling, setShuffling] = useState(false)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)

  const draw = useCallback(async () => {
    setShuffling(true)
    setDrawn([])
    setSaved(false)
    setNote('')
    await new Promise((r) => setTimeout(r, 700))

    const count = spread === '1' ? 1 : 3
    const picked = shuffle(cards).slice(0, count)
    const labels = spreadLabels[spread]

    setDrawn(
      picked.map((card, i) => ({
        card,
        reversed: Math.random() < 0.3,
        flipped: false,
        label: labels[i],
      }))
    )
    setShuffling(false)

    for (let i = 0; i < count; i++) {
      await new Promise((r) => setTimeout(r, 300 + i * 400))
      setDrawn((prev) => prev.map((d, idx) => (idx === i ? { ...d, flipped: true } : d)))
    }
  }, [cards, spread])

  const saveToJournal = () => {
    if (!drawn.length) return
    const readings: object[] = JSON.parse(localStorage.getItem('arcana-journal') ?? '[]')
    readings.unshift({
      id: Date.now(),
      date: new Date().toISOString(),
      spread,
      cards: drawn.map((d) => ({
        id: d.card.id,
        name: d.card.name,
        reversed: d.reversed,
        label: d.label,
      })),
      note,
    })
    localStorage.setItem('arcana-journal', JSON.stringify(readings))
    setSaved(true)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <p
          className="text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}
        >
          Tarot Reading
        </p>
        <h1
          className="text-4xl md:text-5xl font-light mb-3 text-glow"
          style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#EBD5AB' }}
        >
          The Reading Room
        </h1>
        <p
          className="text-lg md:text-xl"
          style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: '#8BAE66', fontStyle: 'italic' }}
        >
          Shuffle the deck and let the cards speak.
        </p>
      </div>

      {/* Spread selector */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
        {(['1', '3'] as Spread[]).map((s) => (
          <button
            type="button"
            key={s}
            onClick={() => { setSpread(s); setDrawn([]); setSaved(false) }}
            className="px-6 py-2.5 rounded-xl text-sm transition-all duration-200 hover:scale-[1.03]"
            style={{
              border: `1px solid ${spread === s ? 'rgba(139,174,102,0.5)' : 'rgba(98,129,65,0.2)'}`,
              backgroundColor: spread === s ? 'rgba(98, 129, 65, 0.15)' : 'transparent',
              color: spread === s ? '#EBD5AB' : '#7DA55A',
              fontFamily: spread === s ? 'var(--font-cinzel), serif' : 'inherit',
              fontSize: spread === s ? '0.7rem' : '0.875rem',
              letterSpacing: spread === s ? '0.05em' : 0,
            }}
          >
            {s === '1' ? '◇  One Card — Daily Draw' : '✦  Three Cards — Past · Present · Future'}
          </button>
        ))}
      </div>

      {/* Draw button */}
      <div className="flex justify-center mb-12">
        <button
          type="button"
          onClick={draw}
          disabled={shuffling}
          className="relative group px-10 py-3.5 rounded-full transition-all duration-300 hover:scale-105 hover:glow-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #4a6632 0%, #628141 50%, #4a6632 100%)',
            color: '#EBD5AB',
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
          }}
        >
          <span className="relative z-10">
            {shuffling ? '✦  Shuffling…' : drawn.length ? '↺  Draw Again' : '✦  Shuffle & Draw'}
          </span>
          {!shuffling && <div className="absolute inset-0 shimmer" />}
        </button>
      </div>

      {/* Cards */}
      <AnimatePresence mode="wait">
        {drawn.length > 0 && (
          <motion.div
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12"
          >
            {drawn.map((d, i) => (
              <div key={`${d.card.id}-${i}`} className="flex flex-col items-center gap-3">
                {d.label && (
                  <span
                    className="text-[10px] tracking-[0.25em] uppercase"
                    style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}
                  >
                    {d.label}
                  </span>
                )}

                <div
                  className="card-flip-container"
                  style={{ filter: d.flipped ? 'drop-shadow(0 0 16px rgba(98,129,65,0.3))' : 'none', transition: 'filter 0.5s ease' }}
                >
                  <div
                    className={`card-inner ${d.flipped ? 'flipped' : ''}`}
                    style={{ width: 140, height: 245 }}
                  >
                    <div className="card-face absolute inset-0">
                      <CardBack size="sm" />
                    </div>
                    <div className="card-face card-back absolute inset-0">
                      <motion.div
                        animate={{ rotate: d.reversed ? 180 : 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <CardArt card={d.card} size="sm" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {d.flipped && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center max-w-[140px]"
                  >
                    <p
                      className="text-xs font-light mb-1 leading-tight"
                      style={{ color: '#EBD5AB', fontFamily: 'var(--font-cinzel), serif' }}
                    >
                      {d.card.name}
                    </p>
                    {d.reversed && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full tracking-wide"
                        style={{ backgroundColor: 'rgba(34,48,40,0.8)', border: '1px solid rgba(98,129,65,0.25)', color: '#7DA55A' }}
                      >
                        Reversed
                      </span>
                    )}
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meanings */}
      {drawn.every((d) => d.flipped) && drawn.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mb-8"
        >
          {drawn.map((d, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 border"
              style={{
                borderColor: 'rgba(98, 129, 65, 0.22)',
                backgroundColor: 'rgba(26, 36, 32, 0.65)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3
                    className="font-light text-lg"
                    style={{ color: '#EBD5AB', fontFamily: 'var(--font-cormorant), Georgia, serif', fontStyle: 'italic' }}
                  >
                    {d.card.name}
                  </h3>
                  {d.reversed && (
                    <span className="text-xs" style={{ color: '#628141' }}>Reversed</span>
                  )}
                </div>
                {d.label && (
                  <span
                    className="text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: '#4a5e40', fontFamily: 'var(--font-cinzel), serif' }}
                  >
                    {d.label}
                  </span>
                )}
              </div>
              <p
                className="leading-relaxed"
                style={{ color: '#8BAE66', fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '1.05rem' }}
              >
                {d.reversed ? d.card.reversed : d.card.upright}
              </p>
            </div>
          ))}

          {/* Journal note */}
          <div
            className="rounded-2xl p-6 border"
            style={{
              borderColor: 'rgba(98, 129, 65, 0.22)',
              backgroundColor: 'rgba(26, 36, 32, 0.65)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <label
              className="block text-xs tracking-[0.15em] uppercase mb-3"
              style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}
            >
              Journal Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="What does this reading reveal to you?"
              className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
              style={{
                backgroundColor: 'rgba(16, 23, 20, 0.7)',
                border: '1px solid rgba(98, 129, 65, 0.2)',
                color: '#EBD5AB',
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: '1rem',
              }}
            />
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={saveToJournal}
                disabled={saved}
                className="px-5 py-2 rounded-xl text-xs transition-all hover:scale-105 disabled:opacity-60 tracking-[0.08em] uppercase"
                style={{
                  backgroundColor: saved ? 'rgba(98,129,65,0.15)' : '#628141',
                  color: '#EBD5AB',
                  fontFamily: 'var(--font-cinzel), serif',
                  border: saved ? '1px solid rgba(98,129,65,0.3)' : 'none',
                }}
              >
                {saved ? '✓  Saved' : 'Save Reading'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
