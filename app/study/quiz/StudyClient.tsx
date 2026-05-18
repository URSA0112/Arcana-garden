'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { TarotCard } from '@/lib/tarot-data'
import CardArt from '@/app/components/CardArt'
import { StudyResults } from '../components/StudyResults'
import { StudySetup } from '../components/StudySetup'
import { LevelComplete } from '../components/LevelComplete'
import { useStudyGame } from '../hooks/useStudyGame'
import { QUESTIONS_PER_LEVEL, TOTAL_LEVELS, LEVEL_INFO } from '../constants'
import { getStreakMultiplier } from '../utils'

function truncateToWords(text: string, wordCount = 14): string {
  const words = text.split(' ')
  return words.length <= wordCount ? text : words.slice(0, wordCount).join(' ') + '…'
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

export default function StudyClient({ cards }: { cards: TarotCard[] }) {
  const game = useStudyGame(cards)

  if (game.phase === 'setup') {
    return <StudySetup mode={game.mode} onSetMode={game.setMode} onStart={game.start} />
  }

  if (game.phase === 'done') {
    return (
      <StudyResults
        score={game.score}
        bestStreak={game.bestStreak}
        correctCount={game.correctCount}
        totalQuestions={game.deck.length}
        onPlayAgain={game.start}
        onChangeMode={game.goToSetup}
      />
    )
  }

  if (game.phase === 'level_complete') {
    return (
      <LevelComplete
        completedLevel={game.level}
        score={game.score}
        bestStreak={game.bestStreak}
        correctCount={game.correctCount}
        cumPrevLevelsCorrect={game.cumPrevLevelsCorrect}
        onContinue={game.nextLevel}
      />
    )
  }

  // ── Active quiz ────────────────────────────────────────────────────────────

  const currentCard      = game.deck[game.index]
  const questionInLevel  = (game.index % QUESTIONS_PER_LEVEL) + 1
  const levelProgress    = (questionInLevel / QUESTIONS_PER_LEVEL) * 100
  const multiplier       = getStreakMultiplier(game.streak)
  const isCorrect        = game.chosen === game.correctIdx
  const isLevelLast      = questionInLevel >= QUESTIONS_PER_LEVEL && game.level < TOTAL_LEVELS
  const isFinalQuestion  = game.index + 1 >= game.deck.length

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* ── HUD ── */}
        <div className="flex items-center justify-between mb-5">

          {/* Quit */}
          <button
            type="button"
            onClick={game.goToSetup}
            className="text-[11px] tracking-[0.12em] uppercase transition-colors hover:text-[#C6A85B]"
            style={{ color: '#555', fontFamily: 'var(--font-cinzel), serif' }}
          >
            ← Quit
          </button>

          {/* Level gems */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              {Array.from({ length: TOTAL_LEVELS }, (_, i) => {
                const lvl         = i + 1
                const isCompleted = lvl < game.level
                const isCurrent   = lvl === game.level
                return (
                  <motion.div
                    key={lvl}
                    animate={{
                      backgroundColor: isCompleted ? '#C6A85B' : 'transparent',
                      borderColor: isCurrent ? '#C6A85B' : isCompleted ? '#C6A85B' : '#2A2A2A',
                    }}
                    style={{ width: 9, height: 9, borderRadius: '50%', border: '1.5px solid' }}
                  />
                )
              })}
            </div>
            <span className="text-[10px] tracking-[0.06em]" style={{ color: '#555', fontFamily: 'var(--font-cinzel), serif' }}>
              {LEVEL_INFO[game.level - 1].name}
            </span>
          </div>

          {/* Score + streak */}
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {game.streak >= 2 && (
                <motion.div
                  key={game.streak}
                  initial={{ scale: 1.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <span style={{ fontSize: '0.85rem' }}>🔥</span>
                  <span className="text-[12px]" style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}>
                    {game.streak}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.span
              key={game.score}
              initial={{ scale: 1.35 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className="text-base font-light"
              style={{ color: '#F2F2F2', fontFamily: 'var(--font-cinzel), serif', minWidth: 36, textAlign: 'right' }}
            >
              {game.score}
              {multiplier > 1 && (
                <span className="ml-1 text-[11px]" style={{ color: '#C6A85B' }}>×{multiplier}</span>
              )}
            </motion.span>
          </div>
        </div>

        {/* ── Level progress bar ── */}
        <div className="mb-7">
          <div className="flex justify-between text-[11px] mb-1.5" style={{ color: '#444', fontFamily: 'var(--font-cinzel), serif' }}>
            <span>{questionInLevel} / {QUESTIONS_PER_LEVEL}</span>
            <span>Lv.{game.level} · {LEVEL_INFO[game.level - 1].subtitle}</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#1C1C1C' }}>
            <motion.div
              className="h-full rounded-full"
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' as const }}
              style={{ background: 'linear-gradient(90deg, rgba(198,168,91,0.45), #C6A85B)' }}
            />
          </div>
        </div>

        {/* ── Card + question ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`q-${game.index}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2, ease: 'easeOut' as const }}
          >
            {/* Card and question text */}
            <div className="flex gap-5 items-center mb-6">
              {/* Card with flip-in animation */}
              <motion.div
                key={`card-${game.index}`}
                initial={{ scaleX: 0.05, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="shrink-0"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(198,168,91,0.22))',
                  transformOrigin: 'center',
                }}
              >
                <CardArt card={currentCard} size="sm" />
              </motion.div>

              {/* Question */}
              <div>
                {game.side === 'reversed' && (
                  <p
                    className="text-[10px] tracking-[0.3em] uppercase mb-1 flex items-center gap-1.5"
                    style={{ color: 'rgba(198,168,91,0.6)', fontFamily: 'var(--font-cinzel), serif' }}
                  >
                    <span>↕</span><span>Reversed</span>
                  </p>
                )}
                <p
                  className="text-[11px] tracking-[0.25em] uppercase mb-2"
                  style={{ color: '#555', fontFamily: 'var(--font-cinzel), serif' }}
                >
                  What does this card mean?
                </p>
                <h2
                  className="text-2xl sm:text-3xl font-light leading-tight"
                  style={{ fontFamily: 'var(--font-cinzel), serif', color: '#F2F2F2' }}
                >
                  {currentCard.name}
                </h2>
              </div>
            </div>

            {/* ── Answer options (single column, game-style) ── */}
            <div className="flex flex-col gap-2.5">
              {game.options.map((optionText, i) => {
                const isChosen   = game.chosen === i
                const isOptCorrect = i === game.correctIdx
                const isRevealed = game.phase === 'answered'

                let borderColor = 'rgba(198,168,91,0.1)'
                let bgColor     = 'rgba(14,14,14,0.7)'
                let textColor   = '#B3B3B3'
                let badgeBg     = 'rgba(198,168,91,0.07)'
                let badgeBorder = 'rgba(198,168,91,0.2)'
                let badgeColor  = 'rgba(198,168,91,0.5)'

                if (isRevealed) {
                  if (isOptCorrect) {
                    borderColor = 'rgba(198,168,91,0.7)'; bgColor = 'rgba(198,168,91,0.1)'
                    textColor = '#F2F2F2'; badgeBg = 'rgba(198,168,91,0.2)'; badgeBorder = '#C6A85B'; badgeColor = '#C6A85B'
                  } else if (isChosen) {
                    borderColor = 'rgba(200,70,70,0.6)'; bgColor = 'rgba(180,50,50,0.1)'
                    textColor = 'rgba(240,180,180,0.9)'; badgeBg = 'rgba(200,70,70,0.15)'; badgeBorder = 'rgba(200,70,70,0.5)'; badgeColor = 'rgba(220,80,80,0.9)'
                  } else {
                    textColor = '#3A3A3A'; badgeBorder = '#222'; badgeColor = '#333'
                  }
                }

                return (
                  <motion.button
                    key={i}
                    type="button"
                    disabled={isRevealed}
                    onClick={() => game.answer(i)}
                    whileHover={!isRevealed ? { scale: 1.015, borderColor: 'rgba(198,168,91,0.3)' } : {}}
                    whileTap={!isRevealed ? { scale: 0.985 } : {}}
                    animate={
                      isRevealed && isOptCorrect              ? { scale: [1, 1.03, 1] } :
                      isRevealed && isChosen && !isOptCorrect ? { x: [0, -8, 8, -5, 5, 0] } :
                      {}
                    }
                    transition={{ duration: 0.35 }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left"
                    style={{
                      borderColor,
                      backgroundColor: bgColor,
                      backdropFilter: 'blur(8px)',
                      transition: 'border-color 0.2s, background-color 0.2s',
                    }}
                  >
                    {/* Letter badge */}
                    <div
                      className="flex items-center justify-center rounded-lg shrink-0 text-[11px] font-light"
                      style={{
                        width: 30, height: 30,
                        backgroundColor: badgeBg,
                        border: `1px solid ${badgeBorder}`,
                        color: badgeColor,
                        fontFamily: 'var(--font-cinzel), serif',
                      }}
                    >
                      {isRevealed && isOptCorrect ? '✓' : isRevealed && isChosen && !isOptCorrect ? '✗' : OPTION_LETTERS[i]}
                    </div>

                    {/* Answer text */}
                    <span
                      className="text-sm leading-snug"
                      style={{
                        color: textColor,
                        fontFamily: 'var(--font-cormorant), serif',
                        fontSize: '1rem',
                        transition: 'color 0.2s',
                      }}
                    >
                      {truncateToWords(optionText)}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            {/* ── Feedback panel ── */}
            <AnimatePresence>
              {game.phase === 'answered' && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25 }}
                  className="mt-5 rounded-2xl px-5 py-4 border flex items-center justify-between gap-4"
                  style={{
                    borderColor: isCorrect ? 'rgba(198,168,91,0.4)' : 'rgba(200,60,60,0.35)',
                    backgroundColor: isCorrect ? 'rgba(198,168,91,0.07)' : 'rgba(180,50,50,0.07)',
                  }}
                >
                  <div>
                    <p
                      className="font-light tracking-[0.06em]"
                      style={{
                        fontFamily: 'var(--font-cinzel), serif',
                        fontSize: '0.95rem',
                        color: isCorrect ? '#C6A85B' : 'rgba(220,80,80,0.9)',
                      }}
                    >
                      {isCorrect ? '✦  Correct' : '✗  Wrong'}
                    </p>
                    <p
                      className="text-sm mt-0.5"
                      style={{ color: '#555', fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic' }}
                    >
                      {isCorrect
                        ? `+${10 * multiplier} pts${multiplier > 1 ? ` · ${multiplier}× combo!` : ''}`
                        : 'Not this time — the cards remember.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={game.next}
                    className="shrink-0 px-5 py-2.5 rounded-xl text-xs tracking-[0.1em] uppercase hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: 'rgba(198,168,91,0.1)',
                      border: '1px solid rgba(198,168,91,0.35)',
                      color: '#F2F2F2',
                      fontFamily: 'var(--font-cinzel), serif',
                    }}
                  >
                    {isLevelLast ? 'Level Up →' : isFinalQuestion ? 'Results →' : 'Next →'}
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
