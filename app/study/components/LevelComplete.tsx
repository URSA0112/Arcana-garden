'use client'

import { motion } from 'framer-motion'
import { LEVEL_INFO, TOTAL_LEVELS, QUESTIONS_PER_LEVEL } from '../constants'

function getLevelStars(correct: number): number {
  if (correct >= QUESTIONS_PER_LEVEL)     return 3
  if (correct >= QUESTIONS_PER_LEVEL - 1) return 2
  if (correct >= QUESTIONS_PER_LEVEL - 2) return 1
  return 0
}

interface LevelCompleteProps {
  completedLevel: number
  score: number
  bestStreak: number
  correctCount: number
  cumPrevLevelsCorrect: number
  onContinue: () => void
}

export function LevelComplete({
  completedLevel,
  score,
  bestStreak,
  correctCount,
  cumPrevLevelsCorrect,
  onContinue,
}: LevelCompleteProps) {
  const info         = LEVEL_INFO[completedLevel - 1]
  const nextInfo     = completedLevel < TOTAL_LEVELS ? LEVEL_INFO[completedLevel] : null
  const levelCorrect = correctCount - cumPrevLevelsCorrect
  const stars        = getLevelStars(levelCorrect)

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(198,168,91,0.08) 0%, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="relative max-w-sm w-full mx-auto px-6 py-16 text-center"
      >
        {/* Stars */}
        <div className="flex justify-center gap-3 mb-8">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={i < stars
                ? { scale: [0, 1.4, 1], opacity: 1 }
                : { scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.18, duration: 0.4, ease: 'easeOut' as const }}
              style={{
                fontSize: '2rem',
                color: i < stars ? '#C6A85B' : 'rgba(198,168,91,0.18)',
                filter: i < stars ? 'drop-shadow(0 0 8px rgba(198,168,91,0.6))' : 'none',
              }}
            >
              ★
            </motion.span>
          ))}
        </div>

        {/* Level badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <p
            className="text-[11px] tracking-[0.45em] uppercase mb-3"
            style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
          >
            Level {completedLevel} of {TOTAL_LEVELS} Complete
          </p>

          <h2
            className="text-4xl font-light mb-1"
            style={{ fontFamily: 'var(--font-cinzel), serif', color: '#F2F2F2' }}
          >
            {info.name}
          </h2>

          <p
            className="mb-8"
            style={{ fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic', color: '#555', fontSize: '1.05rem' }}
          >
            {info.subtitle}
          </p>
        </motion.div>

        {/* Level score summary */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.4 }}
          className="grid grid-cols-3 gap-2 mb-8"
        >
          {[
            { label: 'Correct', value: `${levelCorrect} / ${QUESTIONS_PER_LEVEL}` },
            { label: 'Score',   value: String(score) },
            { label: 'Streak',  value: `🔥 ${bestStreak}` },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl py-3 px-2 border"
              style={{ borderColor: 'rgba(198,168,91,0.15)', backgroundColor: 'rgba(14,14,14,0.7)' }}
            >
              <div className="text-lg font-light mb-0.5" style={{ fontFamily: 'var(--font-cinzel), serif', color: '#C6A85B' }}>
                {value}
              </div>
              <div className="text-[10px] tracking-[0.15em] uppercase" style={{ color: '#555', fontFamily: 'var(--font-cinzel), serif' }}>
                {label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Next level preview */}
        {nextInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="rounded-xl px-4 py-3 mb-8 border text-left"
            style={{ borderColor: 'rgba(198,168,91,0.1)', backgroundColor: 'rgba(198,168,91,0.04)' }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: 'rgba(198,168,91,0.6)', fontFamily: 'var(--font-cinzel), serif' }}>
              Up Next · Level {completedLevel + 1}
            </p>
            <p className="text-sm" style={{ color: '#B3B3B3', fontFamily: 'var(--font-cinzel), serif' }}>
              {nextInfo.name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#555', fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic' }}>
              {nextInfo.subtitle}
            </p>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          type="button"
          onClick={onContinue}
          className="relative w-full py-4 rounded-full overflow-hidden hover:scale-[1.02] transition-transform text-xs tracking-[0.14em] uppercase"
          style={{
            background: 'linear-gradient(135deg, rgba(198,168,91,0.9) 0%, #C6A85B 50%, rgba(198,168,91,0.9) 100%)',
            color: '#0A0A0A',
            fontFamily: 'var(--font-cinzel), serif',
            boxShadow: '0 0 28px rgba(198,168,91,0.18)',
          }}
        >
          <span className="relative z-10">
            {nextInfo ? `Continue to ${nextInfo.name} →` : 'See Final Results →'}
          </span>
          <div className="absolute inset-0 shimmer" />
        </motion.button>
      </motion.div>
    </div>
  )
}
