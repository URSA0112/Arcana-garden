'use client'

import { motion } from 'framer-motion'
import CardBack from '../../components/CardBack'
import { SelectedCard, ZODIAC_SIGNS, BTN } from '../reading-types'

interface ReadingContextProps {
  selectedCards: SelectedCard[]
  requiredCount: number
  question: string
  setQuestion: (v: string) => void
  emotionalContext: string
  setEmotionalContext: (v: string) => void
  zodiacSign: string
  setZodiacSign: (v: string) => void
  onBeginReading: () => void
  onBack: () => void
}

const INPUT: React.CSSProperties = {
  backgroundColor: 'rgba(10,10,10,0.7)',
  border: '1px solid rgba(198,168,91,0.15)',
  color: '#EBD5AB',
  fontFamily: 'var(--font-cormorant), Georgia, serif',
  fontSize: '1.05rem',
  outline: 'none',
}

export function ReadingContext({
  requiredCount,
  selectedCards,
  question,
  setQuestion,
  emotionalContext,
  setEmotionalContext,
  zodiacSign,
  setZodiacSign,
  onBeginReading,
  onBack,
}: ReadingContextProps) {
  return (
    <motion.div
      key="context"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto px-4 py-14"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <p
          className="text-xs tracking-[0.35em] uppercase mb-4"
          style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
        >
          {requiredCount === 1 ? 'One Card Chosen' : 'Three Cards Chosen'}
        </p>
        <h2
          className="text-3xl font-light mb-3"
          style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#EBD5AB' }}
        >
          Before we begin
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            color: '#B3B3B3',
            fontStyle: 'italic',
            fontSize: '1.1rem',
          }}
        >
          Add context if you'd like — or leave it open and let the cards speak freely.
        </p>
      </div>

      {/* Selected cards preview */}
      <div className="flex justify-center gap-5 sm:gap-8 mb-10">
        {selectedCards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.12, duration: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
            <span
              className="text-[12px] tracking-[0.2em] uppercase"
              style={{ color: 'rgba(198,168,91,0.65)', fontFamily: 'var(--font-cinzel), serif' }}
            >
              {s.label}
            </span>
            <div style={{ filter: 'drop-shadow(0 0 12px rgba(198,168,91,0.18))' }}>
              <CardBack size="sm" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Context inputs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 mb-9"
      >
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          placeholder="What question or situation brings you here today? (optional)"
          className="w-full rounded-xl px-4 py-3 resize-none"
          style={INPUT}
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={emotionalContext}
            onChange={(e) => setEmotionalContext(e.target.value)}
            placeholder="How are you feeling right now? (optional)"
            className="flex-1 rounded-xl px-4 py-2.5"
            style={{ ...INPUT, fontSize: '1rem' }}
          />
          <select
            value={zodiacSign}
            onChange={(e) => setZodiacSign(e.target.value)}
            className="rounded-xl px-4 py-2.5 cursor-pointer"
            style={{
              ...INPUT,
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              fontFamily: 'var(--font-cinzel), serif',
              color: zodiacSign ? '#EBD5AB' : '#555',
            }}
          >
            {ZODIAC_SIGNS.map((sign) => (
              <option key={sign} value={sign} style={{ backgroundColor: '#0A0A0A' }}>
                {sign || 'Your Sign (optional)'}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Summary row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.48 }}
        className="rounded-xl px-5 py-4 mb-6"
        style={{ backgroundColor: 'rgba(14,14,14,0.7)', border: '1px solid rgba(198,168,91,0.12)' }}
      >
        <p
          className="text-xs tracking-[0.12em] uppercase mb-1"
          style={{ color: 'rgba(198,168,91,0.45)', fontFamily: 'var(--font-cinzel), serif' }}
        >
          About to begin
        </p>
        <p
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            color: '#B3B3B3',
            fontSize: '1rem',
          }}
        >
          {requiredCount === 1 ? 'One card' : 'Three cards'} drawn
          {question
            ? ` · "${question.length > 48 ? question.slice(0, 48) + '…' : question}"`
            : ' · no specific question'}
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <button
          type="button"
          onClick={onBack}
          className="text-sm tracking-[0.1em] uppercase opacity-45 hover:opacity-80 transition-opacity"
          style={{ color: 'rgba(198,168,91,0.7)', fontFamily: 'var(--font-cinzel), serif' }}
        >
          ← Change Cards
        </button>
        <button
          type="button"
          onClick={onBeginReading}
          className="relative px-10 py-3.5 rounded-full transition-all duration-300 hover:scale-105 overflow-hidden"
          style={BTN}
        >
          <span className="relative z-10">✦ &nbsp; Yes, Reveal My Cards</span>
          <div className="absolute inset-0 shimmer" />
        </button>
      </motion.div>
    </motion.div>
  )
}
