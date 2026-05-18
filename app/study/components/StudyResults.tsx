'use client'

import { motion } from 'framer-motion'

interface GradeInfo {
  letter: string
  label: string
  line: string
  color: string
  glow: string
}

function getGrade(accuracy: number): GradeInfo {
  if (accuracy >= 90) return { letter: 'S', label: 'Legendary',  line: 'The arcana bow before you.',              color: '#F0CC6C', glow: 'rgba(240,204,108,0.4)' }
  if (accuracy >= 75) return { letter: 'A', label: 'Adept',      line: 'The cards have revealed themselves.',    color: '#C6A85B', glow: 'rgba(198,168,91,0.35)' }
  if (accuracy >= 55) return { letter: 'B', label: 'Initiate',   line: 'A worthy study. Keep going.',            color: '#9A9A9A', glow: 'rgba(154,154,154,0.25)' }
  return               { letter: 'C', label: 'Seeker',    line: 'The mysteries require more time.',      color: '#666666', glow: 'rgba(100,100,100,0.2)' }
}

interface StudyResultsProps {
  score: number
  bestStreak: number
  correctCount: number
  totalQuestions: number
  onPlayAgain: () => void
  onChangeMode: () => void
}

export function StudyResults({
  score,
  bestStreak,
  correctCount,
  totalQuestions,
  onPlayAgain,
  onChangeMode,
}: StudyResultsProps) {
  const accuracy = Math.round((correctCount / totalQuestions) * 100)
  const grade    = getGrade(accuracy)
  const stars    = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${grade.glow.replace('0.4', '0.06').replace('0.35', '0.05').replace('0.25', '0.04').replace('0.2', '0.03')} 0%, transparent 70%)` }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative max-w-sm w-full mx-auto px-6 py-16 text-center"
      >
        {/* Grade badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
          className="inline-flex items-center justify-center rounded-full mb-6 mx-auto"
          style={{
            width: 88, height: 88,
            border: `2px solid ${grade.color}`,
            backgroundColor: `${grade.glow.replace('0.4', '0.12').replace('0.35', '0.1').replace('0.25', '0.08').replace('0.2', '0.07')}`,
            boxShadow: `0 0 32px ${grade.glow}, inset 0 0 16px ${grade.glow.replace('0.4', '0.06').replace('0.35', '0.05').replace('0.25', '0.04').replace('0.2', '0.03')}`,
          }}
        >
          <span
            style={{ fontSize: '2.4rem', fontFamily: 'var(--font-cinzel), serif', color: grade.color, fontWeight: 300, lineHeight: 1 }}
          >
            {grade.letter}
          </span>
        </motion.div>

        {/* Stars */}
        <div className="flex justify-center gap-2.5 mb-5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={i < stars ? { scale: [0, 1.5, 1], opacity: 1 } : { scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.35, ease: 'easeOut' as const }}
              style={{
                fontSize: '1.5rem',
                color: i < stars ? grade.color : 'rgba(198,168,91,0.15)',
                filter: i < stars ? `drop-shadow(0 0 6px ${grade.glow})` : 'none',
              }}
            >
              ★
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <p
            className="text-[11px] tracking-[0.45em] uppercase mb-2"
            style={{ color: grade.color, fontFamily: 'var(--font-cinzel), serif' }}
          >
            {grade.label}
          </p>

          <h2
            className="text-4xl font-light mb-2"
            style={{ fontFamily: 'var(--font-cinzel), serif', color: '#F2F2F2' }}
          >
            Trial Complete
          </h2>

          <p
            className="mb-10"
            style={{ color: '#7A7A7A', fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic', fontSize: '1.05rem' }}
          >
            {grade.line}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.4 }}
          className="grid grid-cols-3 gap-3 mb-10"
        >
          {[
            { label: 'Score',    value: String(score) },
            { label: 'Accuracy', value: `${accuracy}%` },
            { label: 'Streak',   value: `🔥 ${bestStreak}` },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl p-4 border"
              style={{ borderColor: 'rgba(198,168,91,0.15)', backgroundColor: 'rgba(14,14,14,0.7)' }}
            >
              <div className="text-xl font-light mb-1" style={{ fontFamily: 'var(--font-cinzel), serif', color: '#C6A85B' }}>
                {value}
              </div>
              <div className="text-[10px] tracking-[0.15em] uppercase" style={{ color: '#555', fontFamily: 'var(--font-cinzel), serif' }}>
                {label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Accuracy bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15, duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex justify-between text-[11px] mb-1.5" style={{ color: '#555', fontFamily: 'var(--font-cinzel), serif' }}>
            <span>Accuracy</span>
            <span style={{ color: grade.color }}>{accuracy}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${accuracy}%` }}
              transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' as const }}
              style={{ background: `linear-gradient(90deg, ${grade.color}88, ${grade.color})` }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.4 }}
          className="flex gap-3"
        >
          <button
            type="button"
            onClick={onChangeMode}
            className="flex-1 py-3 rounded-xl text-xs tracking-[0.08em] uppercase transition-all hover:scale-[1.02]"
            style={{ border: '1px solid rgba(198,168,91,0.25)', color: '#7A7A7A', fontFamily: 'var(--font-cinzel), serif' }}
          >
            Change Mode
          </button>
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex-1 py-3 rounded-xl text-xs tracking-[0.08em] uppercase transition-all hover:scale-[1.02]"
            style={{ backgroundColor: 'rgba(198,168,91,0.1)', border: '1px solid rgba(198,168,91,0.35)', color: '#F2F2F2', fontFamily: 'var(--font-cinzel), serif' }}
          >
            Play Again →
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
