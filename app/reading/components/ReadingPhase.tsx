'use client'

import { motion, AnimatePresence } from 'framer-motion'
import CardArt from '../../components/CardArt'
import CardBack from '../../components/CardBack'
import { SelectedCard, ParsedReading } from '../reading-types'

// ── CardSection ───────────────────────────────────────────────────────

interface CardSectionProps {
  sc: SelectedCard
  i: number
  isRevealed: boolean
  parsedReading: ParsedReading
  aiLoading: boolean
  totalCards: number
}

function CardSection({ sc, i, isRevealed, parsedReading, aiLoading, totalCards }: CardSectionProps) {
  const cardText   = parsedReading.cards[sc.label] ?? ''
  const showAdvice = sc.label === 'Future' && !!parsedReading.advice

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1, duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        {/* Card column */}
        <div className="flex flex-col items-center sm:items-start gap-3 flex-shrink-0">
          <span
            className="text-[12px] tracking-[0.3em] uppercase"
            style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
          >
            {sc.label}
          </span>

          <div
            className="card-flip-container"
            style={{
              filter: isRevealed ? 'drop-shadow(0 0 18px rgba(198,168,91,0.35))' : 'none',
              transition: 'filter 0.6s ease',
            }}
          >
            <div
              className={`card-inner${isRevealed ? ' flipped' : ''}`}
              style={{ width: 120, height: 210 }}
            >
              <div className="card-face absolute inset-0"><CardBack size="sm" /></div>
              <div className="card-face card-back absolute inset-0">
                <div
                  style={{
                    width: 120,
                    height: 210,
                    transform: sc.reversed ? 'rotate(180deg)' : 'none',
                    transformOrigin: 'center',
                  }}
                >
                  <CardArt card={sc.card} size="sm" />
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center sm:text-left"
              >
                <p
                  className="text-sm font-light leading-tight mb-1"
                  style={{ color: '#EBD5AB', fontFamily: 'var(--font-cinzel), serif' }}
                >
                  {sc.card.name}
                </p>
                {sc.reversed && (
                  <span
                    className="text-[12px] px-2 py-0.5 rounded-full tracking-wide"
                    style={{
                      backgroundColor: 'rgba(14,14,14,0.8)',
                      border: '1px solid rgba(198,168,91,0.25)',
                      color: '#C6A85B',
                    }}
                  >
                    Reversed
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text column */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              <motion.div
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pt-8"
                style={{
                  color: '#444',
                  fontFamily: 'var(--font-cormorant), serif',
                  fontStyle: 'italic',
                  fontSize: '0.9rem',
                }}
              >
                waiting for the card…
              </motion.div>
            ) : !cardText && aiLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pt-2 flex items-center gap-3"
              >
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((j) => (
                    <motion.div
                      key={j}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: '#C6A85B' }}
                      animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: j * 0.2 }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    color: '#555',
                    fontFamily: 'var(--font-cormorant), serif',
                    fontStyle: 'italic',
                    fontSize: '0.9rem',
                  }}
                >
                  reading…
                </span>
              </motion.div>
            ) : cardText ? (
              <motion.div
                key="text"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {cardText.split('\n\n').filter(Boolean).map((para, pi) => (
                  <p
                    key={pi}
                    style={{
                      color: pi === 0 ? '#EBD5AB' : '#D4C5A0',
                      fontFamily: 'var(--font-cormorant), Georgia, serif',
                      fontSize: '1.08rem',
                      lineHeight: '1.85',
                    }}
                  >
                    {para.split('\n').map((line, li, arr) => (
                      <span key={li}>{line}{li < arr.length - 1 && <br />}</span>
                    ))}
                  </p>
                ))}

                {showAdvice && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl px-5 py-4 mt-2"
                    style={{
                      backgroundColor: 'rgba(14,14,14,0.7)',
                      border: '1px solid rgba(198,168,91,0.2)',
                    }}
                  >
                    <p
                      className="text-[12px] tracking-[0.22em] uppercase mb-2"
                      style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
                    >
                      ✦ What to hold
                    </p>
                    {parsedReading.advice.split('\n\n').filter(Boolean).map((para, pi) => (
                      <p
                        key={pi}
                        style={{
                          color: '#B3B3B3',
                          fontFamily: 'var(--font-cormorant), Georgia, serif',
                          fontSize: '1.05rem',
                          lineHeight: '1.8',
                          fontStyle: 'italic',
                        }}
                      >
                        {para}
                      </p>
                    ))}
                  </motion.div>
                )}

                {aiLoading && i === totalCards - 1 && (
                  <motion.span
                    animate={{ opacity: [1, 0.1] }}
                    transition={{ duration: 0.55, repeat: Infinity, repeatType: 'reverse' }}
                    style={{ color: '#C6A85B', fontSize: '1rem' }}
                  >
                    ▋
                  </motion.span>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {i < totalCards - 1 && (
        <div className="ornament mt-10" style={{ opacity: 0.35 }}>
          <span style={{ color: 'rgba(198,168,91,0.5)', fontSize: '0.45rem' }}>✦</span>
        </div>
      )}
    </motion.div>
  )
}

// ── SynthesisSection ──────────────────────────────────────────────────

function SynthesisSection({ synthesis }: { synthesis: string }) {
  return (
    <AnimatePresence>
      {synthesis && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="ornament mb-6" style={{ opacity: 0.4 }}>
            <span style={{ color: 'rgba(198,168,91,0.5)', fontSize: '0.5rem' }}>✦</span>
          </div>
          <div
            className="rounded-2xl p-7 border"
            style={{
              borderColor: 'rgba(198,168,91,0.15)',
              backgroundColor: 'rgba(14,14,14,0.7)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <p
              className="text-[12px] tracking-[0.3em] uppercase mb-5"
              style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
            >
              The Reading
            </p>
            <div className="space-y-4">
              {synthesis.split('\n\n').filter(Boolean).map((para, pi) => (
                <p
                  key={pi}
                  style={{
                    color: pi === 0 ? '#EBD5AB' : '#D4C5A0',
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: '1.1rem',
                    lineHeight: '1.9',
                    fontStyle: pi > 0 ? 'italic' : 'normal',
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── JournalSection ────────────────────────────────────────────────────

interface JournalSectionProps {
  question: string
  emotionalContext: string
  note: string
  setNote: (v: string) => void
  saved: boolean
  onSave: () => void
  onReset: () => void
}

function JournalSection({ question, emotionalContext, note, setNote, saved, onSave, onReset }: JournalSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <div
        className="rounded-2xl p-6 border"
        style={{
          borderColor: 'rgba(198,168,91,0.15)',
          backgroundColor: 'rgba(14,14,14,0.7)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {(question || emotionalContext) && (
          <div className="mb-5 pb-5 border-b" style={{ borderColor: 'rgba(198,168,91,0.08)' }}>
            <p
              className="text-[12px] tracking-[0.2em] uppercase mb-3"
              style={{ color: 'rgba(198,168,91,0.45)', fontFamily: 'var(--font-cinzel), serif' }}
            >
              Your context
            </p>
            {question && (
              <p
                className="mb-1.5"
                style={{
                  color: '#B3B3B3',
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: '0.95rem',
                  fontStyle: 'italic',
                }}
              >
                <span style={{ color: 'rgba(198,168,91,0.4)' }}>Situation: </span>{question}
              </p>
            )}
            {emotionalContext && (
              <p
                style={{
                  color: '#B3B3B3',
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: '0.95rem',
                  fontStyle: 'italic',
                }}
              >
                <span style={{ color: 'rgba(198,168,91,0.4)' }}>Feeling: </span>{emotionalContext}
              </p>
            )}
          </div>
        )}

        <label
          className="block text-xs tracking-[0.15em] uppercase mb-3"
          style={{ color: 'rgba(198,168,91,0.65)', fontFamily: 'var(--font-cinzel), serif' }}
        >
          Journal Note
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="What does this reading reveal to you?"
          className="w-full rounded-xl px-4 py-3 resize-none outline-none"
          style={{
            backgroundColor: 'rgba(10,10,10,0.7)',
            border: '1px solid rgba(198,168,91,0.15)',
            color: '#EBD5AB',
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: '1rem',
          }}
        />

        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={onReset}
            className="text-xs tracking-[0.1em] uppercase opacity-45 hover:opacity-75 transition-opacity"
            style={{ color: 'rgba(198,168,91,0.6)', fontFamily: 'var(--font-cinzel), serif' }}
          >
            ↺ New Reading
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saved}
            className="px-5 py-2 rounded-xl text-xs transition-all hover:scale-105 disabled:opacity-60 tracking-[0.08em] uppercase"
            style={{
              backgroundColor: saved ? 'rgba(198,168,91,0.1)' : '#C6A85B',
              color: saved ? '#C6A85B' : '#0A0A0A',
              fontFamily: 'var(--font-cinzel), serif',
              border: saved ? '1px solid rgba(198,168,91,0.25)' : 'none',
            }}
          >
            {saved ? '✓  Saved to Journal' : 'Save to Journal'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── ReadingPhase ──────────────────────────────────────────────────────

interface ReadingPhaseProps {
  selectedCards: SelectedCard[]
  revealedCards: Set<number>
  parsedReading: ParsedReading
  aiLoading: boolean
  aiReading: string
  apiFailed: boolean
  note: string
  setNote: (v: string) => void
  saved: boolean
  question: string
  emotionalContext: string
  onSave: () => void
  onReset: () => void
}

export function ReadingPhase({
  selectedCards,
  revealedCards,
  parsedReading,
  aiLoading,
  aiReading,
  apiFailed,
  note,
  setNote,
  saved,
  question,
  emotionalContext,
  onSave,
  onReset,
}: ReadingPhaseProps) {
  return (
    <motion.div
      key="reading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto px-4 py-12"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <p
          className="text-xs tracking-[0.35em] uppercase mb-3"
          style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
        >
          Tarot Reading
        </p>
        <h1
          className="text-4xl md:text-5xl font-light mb-3 text-glow"
          style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#EBD5AB' }}
        >
          The Reading Room
        </h1>
        {apiFailed && (
          <p
            className="text-xs mt-2"
            style={{
              color: '#555',
              fontFamily: 'var(--font-cormorant), serif',
              fontStyle: 'italic',
            }}
          >
            Reading from the cards themselves — connection was quiet today.
          </p>
        )}
      </div>

      {/* Per-card sections */}
      <div className="space-y-12 mb-12">
        {selectedCards.map((sc, i) => (
          <CardSection
            key={`${sc.card.id}-${i}`}
            sc={sc}
            i={i}
            isRevealed={revealedCards.has(i)}
            parsedReading={parsedReading}
            aiLoading={aiLoading}
            totalCards={selectedCards.length}
          />
        ))}
      </div>

      <SynthesisSection synthesis={parsedReading.synthesis} />

      {!aiLoading && aiReading && (
        <JournalSection
          question={question}
          emotionalContext={emotionalContext}
          note={note}
          setNote={setNote}
          saved={saved}
          onSave={onSave}
          onReset={onReset}
        />
      )}
    </motion.div>
  )
}
