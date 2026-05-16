'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TarotCard } from '@/lib/tarot-data'
import CardArt from '../components/CardArt'

type Mode = 'all' | 'major' | 'minor'
type Phase = 'setup' | 'question' | 'answered' | 'done'

const modeLabels: Record<Mode, string> = { all: 'Full Deck', major: 'Major Arcana', minor: 'Minor Arcana' }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function truncate(str: string, words = 11): string {
  const ws = str.split(' ')
  return ws.length <= words ? str : ws.slice(0, words).join(' ') + '…'
}

function buildOptions(
  allCards: TarotCard[],
  current: TarotCard,
  side: 'upright' | 'reversed'
): { options: string[]; correctIdx: number } {
  const correct = side === 'upright' ? current.upright : current.reversed
  const wrong = shuffle(allCards.filter(c => c.id !== current.id))
    .slice(0, 3)
    .map(c => (side === 'upright' ? c.upright : c.reversed))
  const all = shuffle([correct, ...wrong])
  return { options: all, correctIdx: all.indexOf(correct) }
}

export default function StudyClient({ cards }: { cards: TarotCard[] }) {
  const [mode, setMode] = useState<Mode>('all')
  const [phase, setPhase] = useState<Phase>('setup')
  const [deck, setDeck] = useState<TarotCard[]>([])
  const [index, setIndex] = useState(0)
  const [side, setSide] = useState<'upright' | 'reversed'>('upright')
  const [options, setOptions] = useState<string[]>([])
  const [correctIdx, setCorrectIdx] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  const setupQuestion = useCallback((d: TarotCard[], i: number) => {
    const s: 'upright' | 'reversed' = Math.random() < 0.28 ? 'reversed' : 'upright'
    const { options: opts, correctIdx: ci } = buildOptions(cards, d[i], s)
    setSide(s)
    setOptions(opts)
    setCorrectIdx(ci)
    setChosen(null)
  }, [cards])

  const start = useCallback(() => {
    const pool = cards.filter(c =>
      mode === 'all' ? true : mode === 'major' ? c.arcana === 'major' : c.arcana === 'minor'
    )
    const shuffled = shuffle(pool).slice(0, 15)
    setDeck(shuffled)
    setIndex(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setCorrectCount(0)
    setupQuestion(shuffled, 0)
    setPhase('question')
  }, [cards, mode, setupQuestion])

  const answer = (idx: number) => {
    if (phase !== 'question') return
    setChosen(idx)
    const isCorrect = idx === correctIdx
    if (isCorrect) {
      const newStreak = streak + 1
      const multiplier = newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1
      setScore(s => s + 10 * multiplier)
      setStreak(newStreak)
      setBestStreak(b => Math.max(b, newStreak))
      setCorrectCount(c => c + 1)
    } else {
      setStreak(0)
    }
    setPhase('answered')
  }

  const next = () => {
    if (index + 1 >= deck.length) {
      setPhase('done')
      return
    }
    const ni = index + 1
    setIndex(ni)
    setupQuestion(deck, ni)
    setPhase('question')
  }

  const current = deck[index]
  const progress = deck.length ? ((index + 1) / deck.length) * 100 : 0
  const multiplier = streak >= 5 ? 3 : streak >= 3 ? 2 : 1

  // ── SETUP ──────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="max-w-lg w-full mx-auto px-6 py-16 text-center">
          <p
            className="text-[12px] tracking-[0.4em] uppercase mb-4"
            style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
          >
            Quiz Mode
          </p>
          <h1
            className="text-5xl font-light mb-4 text-glow"
            style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#F2F2F2' }}
          >
            Test Your Arcana
          </h1>
          <p
            className="text-xl mb-12 leading-relaxed"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: '#B3B3B3', fontStyle: 'italic' }}
          >
            Pick the correct meaning for each card.<br />15 questions · chain correct answers to multiply your score.
          </p>

          {/* Mode select */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {(['all', 'major', 'minor'] as Mode[]).map(m => (
              <button
                type="button"
                key={m}
                onClick={() => setMode(m)}
                className="px-6 py-2.5 rounded-xl text-sm transition-all duration-200 hover:scale-[1.03]"
                style={{
                  border: `1px solid ${mode === m ? 'rgba(198,168,91,0.5)' : '#222222'}`,
                  backgroundColor: mode === m ? 'rgba(198,168,91,0.1)' : 'transparent',
                  color: mode === m ? '#F2F2F2' : '#7A7A7A',
                  fontFamily: mode === m ? 'var(--font-cinzel), serif' : 'inherit',
                  fontSize: mode === m ? '0.7rem' : '0.875rem',
                  letterSpacing: mode === m ? '0.05em' : 0,
                }}
              >
                {modeLabels[m]}
              </button>
            ))}
          </div>

          {/* Streak bonus legend */}
          <div className="flex justify-center gap-8 mb-12">
            {[['3 streak', '2× pts'], ['5 streak', '3× pts']].map(([label, val]) => (
              <div key={label} className="text-center">
                <div className="text-lg mb-0.5" style={{ color: '#C6A85B' }}>🔥</div>
                <div className="text-xs" style={{ color: '#7A7A7A', fontFamily: 'var(--font-cinzel), serif' }}>{label}</div>
                <div className="text-xs" style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif', fontWeight: 300 }}>{val}</div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={start}
            className="relative group px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(198,168,91,0.85) 0%, #C6A85B 50%, rgba(198,168,91,0.85) 100%)',
              color: '#0A0A0A',
              fontFamily: 'var(--font-cinzel), serif',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
            }}
          >
            <span className="relative z-10">Begin Quiz</span>
            <div className="absolute inset-0 shimmer" />
          </button>
        </div>
      </div>
    )
  }

  // ── DONE ───────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const accuracy = Math.round((correctCount / deck.length) * 100)
    const grade = accuracy >= 80 ? { icon: '✦', line: 'The cards have revealed themselves to you.' }
                : accuracy >= 50 ? { icon: '◈', line: 'A worthy study. The arcana endure.' }
                : { icon: '◇', line: 'The mysteries require more time.' }
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-sm w-full mx-auto px-6 py-16 text-center"
        >
          <div className="text-4xl mb-5" style={{ color: '#C6A85B' }}>{grade.icon}</div>
          <h2 className="text-4xl font-light mb-3" style={{ fontFamily: 'var(--font-cinzel), serif', color: '#F2F2F2' }}>
            Session Complete
          </h2>
          <p className="mb-10" style={{ color: '#7A7A7A', fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic', fontSize: '1.1rem' }}>
            {grade.line}
          </p>

          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { label: 'Score', value: String(score) },
              { label: 'Accuracy', value: `${accuracy}%` },
              { label: 'Best Streak', value: `🔥 ${bestStreak}` },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl p-4 border"
                style={{ borderColor: 'rgba(198,168,91,0.18)', backgroundColor: 'rgba(14,14,14,0.7)' }}
              >
                <div className="text-2xl font-light mb-1" style={{ fontFamily: 'var(--font-cinzel), serif', color: '#C6A85B' }}>
                  {value}
                </div>
                <div className="text-[12px] tracking-[0.15em] uppercase" style={{ color: '#7A7A7A', fontFamily: 'var(--font-cinzel), serif' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => setPhase('setup')}
              className="px-5 py-2.5 rounded-xl text-xs tracking-[0.08em] uppercase transition-all hover:scale-105"
              style={{ border: '1px solid rgba(198,168,91,0.3)', color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
            >
              Change Mode
            </button>
            <button
              type="button"
              onClick={start}
              className="px-5 py-2.5 rounded-xl text-xs tracking-[0.08em] uppercase transition-all hover:scale-105"
              style={{ backgroundColor: 'rgba(198,168,91,0.12)', border: '1px solid rgba(198,168,91,0.4)', color: '#F2F2F2', fontFamily: 'var(--font-cinzel), serif' }}
            >
              Play Again →
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── QUESTION / ANSWERED ───────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={() => setPhase('setup')}
            className="text-[12px] tracking-[0.12em] uppercase transition-colors hover:text-[#C6A85B]"
            style={{ color: '#7A7A7A', fontFamily: 'var(--font-cinzel), serif' }}
          >
            ← Quit
          </button>
          <div className="flex items-center gap-5">
            <AnimatePresence>
              {streak >= 2 && (
                <motion.span
                  key={streak}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs"
                  style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
                >
                  🔥 {streak}
                </motion.span>
              )}
            </AnimatePresence>
            <motion.span
              key={score}
              initial={{ scale: 1.25 }}
              animate={{ scale: 1 }}
              className="text-sm font-light"
              style={{ color: '#F2F2F2', fontFamily: 'var(--font-cinzel), serif' }}
            >
              {score}
              {multiplier > 1 && (
                <span className="ml-1 text-xs" style={{ color: '#C6A85B' }}>×{multiplier}</span>
              )}
            </motion.span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-[12px] mb-1.5 tracking-[0.06em]" style={{ color: '#7A7A7A', fontFamily: 'var(--font-cinzel), serif' }}>
            <span>{index + 1} / {deck.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, rgba(198,168,91,0.5), #C6A85B)', width: `${progress}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${current.id}-${index}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.22 }}
          >
            {/* Card + question header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-7">
              <motion.div
                animate={{ rotate: side === 'reversed' ? 180 : 0 }}
                transition={{ duration: 0.4 }}
                className="shrink-0"
                style={{ filter: 'drop-shadow(0 0 18px rgba(198,168,91,0.22))' }}
              >
                <CardArt card={current} size="sm" />
              </motion.div>

              <div className="text-center sm:text-left">
                <p
                  className="text-[12px] tracking-[0.3em] uppercase mb-2"
                  style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
                >
                  {side === 'reversed' ? '↕ Reversed · ' : ''}What does this card mean?
                </p>
                <h2
                  className="text-3xl md:text-4xl font-light mb-3 leading-tight"
                  style={{ fontFamily: 'var(--font-cinzel), serif', color: '#F2F2F2' }}
                >
                  {current.name}
                </h2>
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {current.keywords.map(k => (
                    <span
                      key={k}
                      className="text-[12px] px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(198,168,91,0.07)', color: '#7A7A7A', border: '1px solid rgba(198,168,91,0.12)' }}
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Answer options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((opt, i) => {
                const isChosen = chosen === i
                const isCorrect = i === correctIdx
                const revealed = phase === 'answered'

                let border = 'rgba(198,168,91,0.12)'
                let bg = 'rgba(14,14,14,0.7)'
                let color = '#B3B3B3'

                if (revealed) {
                  if (isCorrect) { border = 'rgba(198,168,91,0.65)'; bg = 'rgba(198,168,91,0.1)'; color = '#F2F2F2' }
                  else if (isChosen) { border = 'rgba(200,70,70,0.55)'; bg = 'rgba(180,50,50,0.1)'; color = '#F2F2F2' }
                  else { color = '#555555' }
                }

                return (
                  <motion.button
                    key={i}
                    type="button"
                    disabled={revealed}
                    onClick={() => answer(i)}
                    whileHover={!revealed ? { scale: 1.02, borderColor: 'rgba(198,168,91,0.35)' } : {}}
                    whileTap={!revealed ? { scale: 0.98 } : {}}
                    className="p-4 rounded-xl border text-left text-sm leading-snug transition-colors duration-200"
                    style={{ borderColor: border, backgroundColor: bg, color, backdropFilter: 'blur(8px)' }}
                  >
                    <span
                      className="inline-block w-5 text-[12px] tracking-widest shrink-0 mr-1"
                      style={{ color: 'rgba(198,168,91,0.35)' }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {truncate(opt)}
                    {revealed && isCorrect && (
                      <span className="ml-2 text-[12px]" style={{ color: '#C6A85B' }}>✓</span>
                    )}
                    {revealed && isChosen && !isCorrect && (
                      <span className="ml-2 text-[12px]" style={{ color: 'rgba(220,80,80,0.9)' }}>✗</span>
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Feedback + next */}
            <AnimatePresence>
              {phase === 'answered' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-5 flex items-center justify-between gap-4"
                >
                  <p
                    className="text-sm"
                    style={{
                      fontFamily: 'var(--font-cormorant), serif',
                      fontStyle: 'italic',
                      color: chosen === correctIdx ? '#C6A85B' : 'rgba(210,80,80,0.85)',
                    }}
                  >
                    {chosen === correctIdx
                      ? `+${10 * multiplier} pts${multiplier > 1 ? ` · ${multiplier}× streak!` : ' · correct'}`
                      : 'Not this time — the cards remember.'}
                  </p>
                  <button
                    type="button"
                    onClick={next}
                    className="shrink-0 px-6 py-2.5 rounded-xl text-xs tracking-[0.08em] uppercase transition-all hover:scale-105"
                    style={{
                      backgroundColor: 'rgba(198,168,91,0.12)',
                      border: '1px solid rgba(198,168,91,0.4)',
                      color: '#F2F2F2',
                      fontFamily: 'var(--font-cinzel), serif',
                    }}
                  >
                    {index + 1 >= deck.length ? 'Results →' : 'Next →'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
