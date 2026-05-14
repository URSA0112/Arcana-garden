'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { TarotCard } from '@/lib/tarot-data'
import CardArt from '../components/CardArt'
import CardBack from '../components/CardBack'

type Spread = '1' | '3'
type Phase = 'intro' | 'selecting' | 'context' | 'reading'

interface SelectedCard {
  card: TarotCard
  reversed: boolean
  label: string
  deckIndex: number
}

// Slot array: null = empty, SelectedCard = occupied
type SlotArray = (SelectedCard | null)[]

const SPREAD_LABELS: Record<Spread, string[]> = {
  '1': ['Your Message'],
  '3': ['Past', 'Present', 'Future'],
}

const ZODIAC_SIGNS = [
  '', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

// CardBack size="sm" renders at exactly 120×210px
const CARD_W = 68
const CARD_H = Math.round(CARD_W * 1.75) // 119
const SCALE  = CARD_W / 120              // 0.5667

const BG_URL = 'https://res.cloudinary.com/dt43fy6cr/image/upload/v1778685421/moonsun-cropforme.com_1_pi39hi.jpg'

function strongShuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  const randoms = new Uint32Array(a.length * 3)
  crypto.getRandomValues(randoms)
  for (let pass = 0; pass < 3; pass++) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = randoms[pass * a.length + i] % (i + 1)
      ;[a[i], a[j]] = [a[j], a[i]]
    }
  }
  return a
}

function playSound(type: 'pick' | 'unpick' | 'done') {
  try {
    const ctx = new AudioContext()
    const t = ctx.currentTime
    const tone = (freq: number, vol: number, start: number, dur: number, freqEnd?: number) => {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t + start)
      if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t + start + dur * 0.45)
      gain.gain.setValueAtTime(0, t + start)
      gain.gain.linearRampToValueAtTime(vol, t + start + 0.014)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + start + dur)
      osc.start(t + start); osc.stop(t + start + dur + 0.05)
    }
    if (type === 'pick') {
      tone(523.25, 0.09, 0, 0.4, 659.25); tone(1046.5, 0.035, 0.01, 0.22)
    } else if (type === 'unpick') {
      tone(440, 0.065, 0, 0.22, 349.23)
    } else {
      tone(261.63,0.07,0,0.65); tone(329.63,0.055,0.055,0.58)
      tone(392,0.045,0.11,0.52); tone(523.25,0.035,0.17,0.45)
    }
    setTimeout(() => ctx.close(), 1200)
  } catch { /* AudioContext unavailable */ }
}

const BTN = {
  background: 'linear-gradient(135deg, #4a6632 0%, #628141 50%, #4a6632 100%)',
  color: '#EBD5AB' as const,
  fontFamily: 'var(--font-cinzel), serif',
  fontSize: '0.75rem',
  letterSpacing: '0.1em',
}

export default function ReadingClient({ cards }: { cards: TarotCard[] }) {
  const [phase, setPhase]               = useState<Phase>('intro')
  const [spread, setSpread]             = useState<Spread>('3')
  const [question, setQuestion]         = useState('')
  const [emotionalContext, setEmotionalContext] = useState('')
  const [zodiacSign, setZodiacSign]     = useState('')

  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([])
  // slots: fixed-length array matching requiredCount — null means empty
  const [slots, setSlots]               = useState<SlotArray>([])

  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set())
  const [aiReading, setAiReading]       = useState('')
  const [aiLoading, setAiLoading]       = useState(false)
  const [note, setNote]                 = useState('')
  const [saved, setSaved]               = useState(false)

  const requiredCount   = spread === '1' ? 1 : 3
  const selectedCards   = slots.filter((s): s is SelectedCard => s !== null)
  const selectedCount   = selectedCards.length
  const selectionComplete = slots.length > 0 && slots.every(s => s !== null)

  // ── API ──────────────────────────────────────────────────────────────

  const fetchReading = useCallback(async (selCards: SelectedCard[]) => {
    setAiLoading(true)
    setAiReading('')
    try {
      const res = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cards: selCards.map((d) => ({
            name: d.card.name,
            reversed: d.reversed,
            label: d.label,
            keywords: d.card.keywords,
            upright: d.card.upright,
            reversed_meaning: d.card.reversed,
          })),
          spread, question, emotionalContext, zodiacSign,
        }),
      })
      if (!res.ok || !res.body) throw new Error()
      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let text = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        setAiReading(text)
      }
    } catch {
      setAiReading('The cards are speaking softly today. Please try again in a moment.')
    } finally {
      setAiLoading(false)
    }
  }, [spread, question, emotionalContext, zodiacSign])

  // ── PHASE TRANSITIONS ────────────────────────────────────────────────

  const beginSelecting = useCallback(() => {
    setShuffledDeck(strongShuffle(cards))
    setSlots(Array.from({ length: spread === '1' ? 1 : 3 }, () => null))
    setPhase('selecting')
  }, [cards, spread])

  const handleCardClick = useCallback((card: TarotCard, deckIndex: number) => {
    const existingSlotIdx = slots.findIndex(s => s?.deckIndex === deckIndex)

    if (existingSlotIdx !== -1) {
      // Deselect — clear only this slot, leave others untouched
      playSound('unpick')
      setSlots(prev => {
        const next = [...prev]
        next[existingSlotIdx] = null
        return next
      })
      return
    }

    if (selectionComplete) return

    const firstEmpty = slots.findIndex(s => s === null)
    if (firstEmpty === -1) return

    playSound('pick')
    setSlots(prev => {
      const next = [...prev]
      next[firstEmpty] = {
        card,
        reversed: Math.random() < 0.3,
        label: SPREAD_LABELS[spread][firstEmpty],
        deckIndex,
      }
      return next
    })
  }, [slots, selectionComplete, spread])

  const confirmSelection = useCallback(() => {
    playSound('done')
    setPhase('context')
  }, [])

  const beginReading = useCallback(() => {
    setRevealedCards(new Set())
    setPhase('reading')
    const readingCards = slots.filter((s): s is SelectedCard => s !== null)
    readingCards.forEach((_, i) => {
      setTimeout(() => {
        setRevealedCards((prev) => new Set([...prev, i]))
      }, i * 650 + 500)
    })
    fetchReading(readingCards)
  }, [slots, fetchReading])

  const reset = useCallback(() => {
    setPhase('intro')
    setSlots([])
    setRevealedCards(new Set())
    setAiReading('')
    setSaved(false)
    setNote('')
    setQuestion('')
    setEmotionalContext('')
    setZodiacSign('')
  }, [])

  const saveToJournal = () => {
    const readingCards = slots.filter((s): s is SelectedCard => s !== null)
    if (!readingCards.length) return
    const readings: object[] = JSON.parse(localStorage.getItem('arcana-journal') ?? '[]')
    readings.unshift({
      id: Date.now(),
      date: new Date().toISOString(),
      spread, question,
      cards: readingCards.map((s) => ({
        id: s.card.id, name: s.card.name, reversed: s.reversed, label: s.label,
      })),
      aiReading, note,
    })
    localStorage.setItem('arcana-journal', JSON.stringify(readings))
    setSaved(true)
  }

  // ── RENDER ───────────────────────────────────────────────────────────

  return (
    <>
      {/* Background image — fixed, positive z-index so it sits above body bg */}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, zIndex: 0,
          backgroundImage: `url('${BG_URL}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.28,
          pointerEvents: 'none',
        }}
      />
      {/* Vignette overlay */}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse 85% 80% at 50% 35%, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.78) 65%, rgba(10,10,10,0.96) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* All page content — above the backgrounds */}
      <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh' }}>
        <AnimatePresence mode="wait">

          {/* ─── INTRO ─── */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45 }}
              className="max-w-2xl mx-auto px-4 py-16"
            >
              <div className="text-center mb-12">
                <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}>
                  Tarot Reading
                </p>
                <h1 className="text-4xl md:text-5xl font-light mb-4 text-glow" style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#EBD5AB' }}>
                  The Reading Room
                </h1>
                <p className="text-xl" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: '#8BAE66', fontStyle: 'italic' }}>
                  Set your intention. The cards will do the rest.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 mb-12">
                {(['1', '3'] as Spread[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpread(s)}
                    className="px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.03]"
                    style={{
                      border: `1px solid ${spread === s ? 'rgba(139,174,102,0.55)' : 'rgba(98,129,65,0.2)'}`,
                      backgroundColor: spread === s ? 'rgba(98,129,65,0.15)' : 'transparent',
                      color: spread === s ? '#EBD5AB' : '#7DA55A',
                      fontFamily: spread === s ? 'var(--font-cinzel), serif' : 'inherit',
                      fontSize: spread === s ? '0.7rem' : '0.875rem',
                      letterSpacing: spread === s ? '0.06em' : 0,
                    }}
                  >
                    {s === '1' ? '◇  One Card — Daily Draw' : '✦  Three Cards — Past · Present · Future'}
                  </button>
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={beginSelecting}
                  className="relative px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 overflow-hidden"
                  style={BTN}
                >
                  <span className="relative z-10">✦  Lay the Cards</span>
                  <div className="absolute inset-0 shimmer" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── SELECTING ─── */}
          {phase === 'selecting' && (
            <motion.div
              key="selecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              {/* Minimal sticky header */}
              <div
                className="sticky top-0 z-30 px-6 py-3"
                style={{ backgroundColor: 'rgba(10,10,10,0.93)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(98,129,65,0.07)' }}
              >
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                  <button
                    type="button"
                    onClick={reset}
                    className="text-xs tracking-[0.1em] uppercase opacity-40 hover:opacity-70 transition-opacity"
                    style={{ color: '#8BAE66', fontFamily: 'var(--font-cinzel), serif' }}
                  >
                    ← Back
                  </button>
                  <span className="text-[11px] tabular-nums" style={{ color: '#3a4e35', fontFamily: 'var(--font-cinzel), serif' }}>
                    {selectedCount}&thinsp;/&thinsp;{requiredCount}
                  </span>
                </div>
              </div>

              <LayoutGroup>
                <div className="max-w-6xl mx-auto px-4 pt-8 pb-20">

                  {/* Instruction */}
                  <p className="text-center mb-8" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: '#4a6642', fontStyle: 'italic', fontSize: '1.05rem' }}>
                    {selectionComplete
                      ? 'All cards placed — tap a placed card to return it, or confirm when ready.'
                      : 'Trust your intuition. Tap a card to place it. Tap a placed card to return it.'}
                  </p>

                  {/* Slot zone — each slot keeps its position on deselect */}
                  <div className="flex justify-center gap-6 sm:gap-10 mb-5">
                    {SPREAD_LABELS[spread].map((label, slotIdx) => {
                      const selCard = slots[slotIdx] ?? null
                      return (
                        <div key={slotIdx} className="flex flex-col items-center gap-2">
                          <span className="text-[10px] tracking-[0.22em] uppercase" style={{ color: '#507040', fontFamily: 'var(--font-cinzel), serif' }}>
                            {label}
                          </span>
                          <div style={{ width: CARD_W, height: CARD_H, position: 'relative' }}>
                            {/* Dashed placeholder — always visible */}
                            <div style={{
                              position: 'absolute', inset: 0,
                              borderRadius: 6,
                              border: '1px dashed rgba(98,129,65,0.22)',
                              backgroundColor: 'rgba(98,129,65,0.03)',
                            }} />
                            {/* Card — key by deckIndex so React mounts a fresh element
                                per card identity, enabling Framer Motion FLIP */}
                            {selCard && (
                              <motion.div
                                key={selCard.deckIndex}
                                layoutId={`card-${selCard.deckIndex}`}
                                style={{
                                  position: 'absolute', inset: 0,
                                  borderRadius: 6,
                                  overflow: 'hidden',
                                  cursor: 'pointer',
                                  backgroundColor: '#100E07',
                                  boxShadow: '0 0 22px rgba(198,168,91,0.45), 0 4px 16px rgba(0,0,0,0.55)',
                                  border: '1px solid rgba(198,168,91,0.5)',
                                }}
                                onClick={() => handleCardClick(selCard.card, selCard.deckIndex)}
                              >
                                <div style={{
                                  position: 'absolute', top: 0, left: 0,
                                  transformOrigin: 'top left',
                                  transform: `scale(${SCALE})`,
                                  width: 120, height: 210,
                                  pointerEvents: 'none',
                                }}>
                                  <CardBack size="sm" />
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Progress dots */}
                  <div className="flex justify-center items-center gap-2 mb-5">
                    {Array.from({ length: requiredCount }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          width: slots[i] ? 28 : 10,
                          backgroundColor: slots[i] ? '#628141' : 'rgba(98,129,65,0.18)',
                        }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        style={{
                          height: 8, borderRadius: 4,
                          boxShadow: slots[i] ? '0 0 8px rgba(98,129,65,0.4)' : 'none',
                        }}
                      />
                    ))}
                  </div>

                  {/* Done button / hint */}
                  <div className="flex justify-center mb-10">
                    <AnimatePresence mode="wait">
                      {selectionComplete ? (
                        <motion.button
                          key="done"
                          type="button"
                          initial={{ opacity: 0, scale: 0.88, y: 6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.88 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                          onClick={confirmSelection}
                          className="relative px-8 py-3 rounded-full overflow-hidden hover:scale-105 transition-transform pulse-ring"
                          style={BTN}
                        >
                          <span className="relative z-10">✦  I'm Done</span>
                          <div className="absolute inset-0 shimmer" />
                        </motion.button>
                      ) : (
                        <motion.p
                          key="hint"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          style={{ color: '#2e3e28', fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic', fontSize: '0.9rem' }}
                        >
                          {requiredCount - selectedCount === 1 ? '1 card remaining' : `${requiredCount - selectedCount} cards remaining`}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Divider */}
                  <div className="ornament mb-7">
                    <span style={{ color: 'rgba(98,129,65,0.25)', fontSize: '0.5rem' }}>✦</span>
                  </div>

                  {/* Card grid */}
                  <div className="flex flex-wrap justify-center" style={{ gap: 7 }}>
                    {shuffledDeck.map((card, i) => {
                      const isInSlot  = slots.some(s => s?.deckIndex === i)
                      const isDisabled = !isInSlot && selectionComplete

                      if (isInSlot) {
                        return (
                          <div
                            key={`ghost-${i}`}
                            style={{
                              width: CARD_W, height: CARD_H, flexShrink: 0,
                              borderRadius: 6,
                              border: '1px dashed rgba(98,129,65,0.1)',
                              backgroundColor: 'rgba(98,129,65,0.02)',
                              opacity: 0.3,
                            }}
                          />
                        )
                      }

                      return (
                        <motion.div
                          key={`${card.id}-${i}`}
                          layoutId={`card-${i}`}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: isDisabled ? 0.18 : 1, y: 0 }}
                          transition={{ delay: i * 0.007, duration: 0.32, ease: 'easeOut' }}
                          style={{ width: CARD_W, height: CARD_H, flexShrink: 0, position: 'relative' }}
                        >
                          <div
                            className={`card-hover-wrap${!isDisabled ? ' can-pick' : ''}`}
                            onClick={() => !isDisabled && handleCardClick(card, i)}
                            style={{
                              width: CARD_W, height: CARD_H,
                              borderRadius: 6, overflow: 'hidden', position: 'relative',
                              cursor: isDisabled ? 'default' : 'pointer',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.32)',
                            }}
                          >
                            <div style={{
                              position: 'absolute', top: 0, left: 0,
                              transformOrigin: 'top left',
                              transform: `scale(${SCALE})`,
                              width: 120, height: 210,
                            }}>
                              <CardBack size="sm" />
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                </div>
              </LayoutGroup>
            </motion.div>
          )}

          {/* ─── CONTEXT ─── */}
          {phase === 'context' && (
            <motion.div
              key="context"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto px-4 py-14"
            >
              <div className="text-center mb-10">
                <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}>
                  {requiredCount === 1 ? 'One Card Chosen' : 'Three Cards Chosen'}
                </p>
                <h2 className="text-3xl font-light mb-3" style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#EBD5AB' }}>
                  Before we begin
                </h2>
                <p style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: '#8BAE66', fontStyle: 'italic', fontSize: '1.1rem' }}>
                  Add context if you'd like — or leave it open and let the cards speak freely.
                </p>
              </div>

              {/* Face-down card backs */}
              <div className="flex justify-center gap-5 sm:gap-8 mb-10">
                {selectedCards.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.12, duration: 0.4, ease: 'easeOut' }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}>
                      {s.label}
                    </span>
                    <div style={{ filter: 'drop-shadow(0 0 12px rgba(198,168,91,0.18))' }}>
                      <CardBack size="sm" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Editable questions */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-3 mb-9">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={2}
                  placeholder="What question or situation brings you here today? (optional)"
                  className="w-full rounded-xl px-4 py-3 resize-none outline-none transition-all"
                  style={{
                    backgroundColor: 'rgba(16,23,20,0.7)',
                    border: '1px solid rgba(98,129,65,0.2)',
                    color: '#EBD5AB',
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: '1.05rem',
                  }}
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={emotionalContext}
                    onChange={(e) => setEmotionalContext(e.target.value)}
                    placeholder="How are you feeling right now? (optional)"
                    className="flex-1 rounded-xl px-4 py-2.5 outline-none transition-all"
                    style={{
                      backgroundColor: 'rgba(16,23,20,0.7)',
                      border: '1px solid rgba(98,129,65,0.2)',
                      color: '#EBD5AB',
                      fontFamily: 'var(--font-cormorant), Georgia, serif',
                      fontSize: '1rem',
                    }}
                  />
                  <select
                    value={zodiacSign}
                    onChange={(e) => setZodiacSign(e.target.value)}
                    className="rounded-xl px-4 py-2.5 outline-none cursor-pointer"
                    style={{
                      backgroundColor: 'rgba(16,23,20,0.7)',
                      border: '1px solid rgba(98,129,65,0.2)',
                      color: zodiacSign ? '#EBD5AB' : '#4a5e40',
                      fontFamily: 'var(--font-cinzel), serif',
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {ZODIAC_SIGNS.map((sign) => (
                      <option key={sign} value={sign} style={{ backgroundColor: '#0d1a14' }}>
                        {sign || 'Your Sign (optional)'}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>

              {/* Confirmation summary */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.48 }}
                className="rounded-xl px-5 py-4 mb-6"
                style={{ backgroundColor: 'rgba(18,28,22,0.7)', border: '1px solid rgba(98,129,65,0.15)' }}
              >
                <p className="text-xs tracking-[0.12em] uppercase mb-1" style={{ color: '#4a5e40', fontFamily: 'var(--font-cinzel), serif' }}>
                  About to begin
                </p>
                <p style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: '#8BAE66', fontSize: '1rem' }}>
                  {requiredCount === 1 ? 'One card' : 'Three cards'} drawn
                  {question ? ` · "${question.length > 48 ? question.slice(0, 48) + '…' : question}"` : ' · no specific question'}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <button
                  type="button"
                  onClick={() => setPhase('selecting')}
                  className="text-sm tracking-[0.1em] uppercase opacity-45 hover:opacity-80 transition-opacity"
                  style={{ color: '#8BAE66', fontFamily: 'var(--font-cinzel), serif' }}
                >
                  ← Change Cards
                </button>
                <button
                  type="button"
                  onClick={beginReading}
                  className="relative px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 overflow-hidden"
                  style={BTN}
                >
                  <span className="relative z-10">✦  Yes, Reveal My Cards</span>
                  <div className="absolute inset-0 shimmer" />
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ─── READING ─── */}
          {phase === 'reading' && (
            <motion.div
              key="reading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto px-4 py-12"
            >
              <div className="text-center mb-12">
                <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}>
                  Tarot Reading
                </p>
                <h1 className="text-4xl md:text-5xl font-light mb-3 text-glow" style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#EBD5AB' }}>
                  The Reading Room
                </h1>
              </div>

              {/* Staggered card reveals */}
              <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-14">
                {selectedCards.map((s, i) => {
                  const isRevealed = revealedCards.has(i)
                  return (
                    <motion.div
                      key={`${s.card.id}-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
                      className="flex flex-col items-center gap-3"
                    >
                      <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}>
                        {s.label}
                      </span>
                      <div
                        className="card-flip-container"
                        style={{ filter: isRevealed ? 'drop-shadow(0 0 18px rgba(98,129,65,0.35))' : 'none', transition: 'filter 0.6s ease' }}
                      >
                        <div className={`card-inner${isRevealed ? ' flipped' : ''}`} style={{ width: 140, height: 245 }}>
                          <div className="card-face absolute inset-0"><CardBack size="sm" /></div>
                          <div className="card-face card-back absolute inset-0">
                            <div style={{ width: 140, height: 245, transform: s.reversed ? 'rotate(180deg)' : 'none', transformOrigin: 'center' }}>
                              <CardArt card={s.card} size="sm" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <AnimatePresence>
                        {isRevealed && (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                            className="text-center max-w-[140px]"
                          >
                            <p className="text-xs font-light mb-1 leading-tight" style={{ color: '#EBD5AB', fontFamily: 'var(--font-cinzel), serif' }}>
                              {s.card.name}
                            </p>
                            {s.reversed && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full tracking-wide" style={{ backgroundColor: 'rgba(34,48,40,0.8)', border: '1px solid rgba(98,129,65,0.25)', color: '#7DA55A' }}>
                                Reversed
                              </span>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>

              {/* AI Reading */}
              <div className="mb-8">
                <div className="rounded-2xl p-8 border" style={{ borderColor: 'rgba(98,129,65,0.22)', backgroundColor: 'rgba(26,36,32,0.65)', backdropFilter: 'blur(10px)' }}>
                  <p className="text-[10px] tracking-[0.3em] uppercase mb-6" style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}>
                    Your Reading
                  </p>
                  {aiLoading && !aiReading && (
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((j) => (
                          <motion.div
                            key={j}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: '#628141' }}
                            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] }}
                            transition={{ duration: 1.4, repeat: Infinity, delay: j * 0.2 }}
                          />
                        ))}
                      </div>
                      <span className="text-sm" style={{ color: '#4a5e40', fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic' }}>
                        The cards are speaking…
                      </span>
                    </div>
                  )}
                  {aiReading && (() => {
                    const paras      = aiReading.split('\n\n').filter(Boolean)
                    const isFinished = !aiLoading
                    return (
                      <div className="space-y-5">
                        {paras.map((para, pi) => {
                          const isFirst = pi === 0
                          const isLast  = isFinished && pi === paras.length - 1 && paras.length > 1
                          return (
                            <div key={pi}>
                              {isLast && (
                                <div className="flex items-center gap-3 mb-5" style={{ opacity: 0.3 }}>
                                  <div className="flex-1 h-px" style={{ backgroundColor: '#628141' }} />
                                  <span style={{ color: '#628141', fontSize: '0.6rem' }}>✦</span>
                                  <div className="flex-1 h-px" style={{ backgroundColor: '#628141' }} />
                                </div>
                              )}
                              <p style={{
                                color: isFirst ? '#DDE8C4' : isLast ? '#A8C07A' : '#C8DCAA',
                                fontFamily: 'var(--font-cormorant), Georgia, serif',
                                fontSize: isFirst ? '1.15rem' : '1.1rem',
                                lineHeight: '1.9',
                                fontStyle: isLast ? 'italic' : 'normal',
                              }}>
                                {para.split('\n').map((line, li) => (
                                  <span key={li}>{line}{li < para.split('\n').length - 1 && <br />}</span>
                                ))}
                              </p>
                            </div>
                          )
                        })}
                        {aiLoading && (
                          <motion.span
                            animate={{ opacity: [1, 0.1] }}
                            transition={{ duration: 0.55, repeat: Infinity, repeatType: 'reverse' }}
                            style={{ color: '#628141', fontSize: '1rem' }}
                          >▋</motion.span>
                        )}
                      </div>
                    )
                  })()}
                </div>
              </div>

              {/* Journal + New Reading */}
              {!aiLoading && aiReading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <div className="rounded-2xl p-6 border" style={{ borderColor: 'rgba(98,129,65,0.22)', backgroundColor: 'rgba(26,36,32,0.65)', backdropFilter: 'blur(10px)' }}>
                    <label className="block text-xs tracking-[0.15em] uppercase mb-3" style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}>
                      Journal Note
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      placeholder="What does this reading reveal to you?"
                      className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
                      style={{
                        backgroundColor: 'rgba(16,23,20,0.7)',
                        border: '1px solid rgba(98,129,65,0.2)',
                        color: '#EBD5AB',
                        fontFamily: 'var(--font-cormorant), Georgia, serif',
                        fontSize: '1rem',
                      }}
                    />
                    <div className="flex justify-between items-center mt-4">
                      <button
                        type="button" onClick={reset}
                        className="text-xs tracking-[0.1em] uppercase opacity-45 hover:opacity-75 transition-opacity"
                        style={{ color: '#8BAE66', fontFamily: 'var(--font-cinzel), serif' }}
                      >
                        ↺ New Reading
                      </button>
                      <button
                        type="button" onClick={saveToJournal} disabled={saved}
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
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </>
  )
}
