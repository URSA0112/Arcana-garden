'use client'

import { motion, LayoutGroup } from 'framer-motion'
import { TarotCard } from '@/lib/tarot-data'
import { Spread, SlotArray } from '../reading-types'
import { SelectionStatus } from './SelectionStatus'
import { CardGrid } from './CardGrid'

interface CardSelectingProps {
  spread:             Spread
  slots:              SlotArray
  shuffledDeck:       TarotCard[]
  selectedCount:      number
  requiredCount:      number
  selectionComplete:  boolean
  onCardClick:        (card: TarotCard, deckIndex: number) => void
  onConfirm:          () => void
  onReset:            () => void
}

export function CardSelecting({
  spread,
  slots,
  shuffledDeck,
  selectedCount,
  requiredCount,
  selectionComplete,
  onCardClick,
  onConfirm,
  onReset,
}: CardSelectingProps) {
  return (
    <motion.div
      key="selecting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Sticky header */}
      <div
        className="sticky top-0 z-30 px-6 py-3"
        style={{
          backgroundColor: 'rgba(10,10,10,0.93)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(198,168,91,0.07)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onReset}
            className="text-xs tracking-[0.1em] uppercase opacity-40 hover:opacity-70 transition-opacity"
            style={{ color: 'rgba(198,168,91,0.65)', fontFamily: 'var(--font-cinzel), serif' }}
          >
            ← Back
          </button>
          <span
            className="text-[11px] tabular-nums"
            style={{ color: 'rgba(198,168,91,0.35)', fontFamily: 'var(--font-cinzel), serif' }}
          >
            {selectedCount}&thinsp;/&thinsp;{requiredCount}
          </span>
        </div>
      </div>

      <LayoutGroup>
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-20">

          <SelectionStatus
            spread={spread}
            slots={slots}
            requiredCount={requiredCount}
            selectionComplete={selectionComplete}
            onSlotClick={onCardClick}
            onConfirm={onConfirm}
          />

          <div className="ornament mb-7">
            <span style={{ color: 'rgba(198,168,91,0.25)', fontSize: '0.5rem' }}>✦</span>
          </div>

          <CardGrid
            shuffledDeck={shuffledDeck}
            slots={slots}
            selectionComplete={selectionComplete}
            onCardClick={onCardClick}
          />

        </div>
      </LayoutGroup>
    </motion.div>
  )
}
