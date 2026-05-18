'use client'

import { motion, AnimatePresence } from 'framer-motion'
import CardBack from '../../components/CardBack'
import { Spread, SlotArray, SelectedCard, SPREAD_LABELS, CARD_W, CARD_H, SCALE, BTN } from '../reading-types'
import { TarotCard } from '@/lib/tarot-data'

interface SelectionStatusProps {
  spread:             Spread
  slots:              SlotArray
  requiredCount:      number
  selectionComplete:  boolean
  onSlotClick:        (card: TarotCard, deckIndex: number) => void
  onConfirm:          () => void
}

function SlotPlaceholder() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 6,
        border: '1px dashed rgba(198,168,91,0.2)',
        backgroundColor: 'rgba(198,168,91,0.03)',
      }}
    />
  )
}

function SlotOccupied({ selCard, onSlotClick }: { selCard: SelectedCard; onSlotClick: (card: TarotCard, deckIndex: number) => void }) {
  return (
    <motion.div
      key={selCard.deckIndex}
      layoutId={`card-${selCard.deckIndex}`}
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 6,
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: '#100E07',
        boxShadow: '0 0 22px rgba(198,168,91,0.45), 0 4px 16px rgba(0,0,0,0.55)',
        border: '1px solid rgba(198,168,91,0.5)',
      }}
      onClick={() => onSlotClick(selCard.card, selCard.deckIndex)}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transformOrigin: 'top left',
          transform: `scale(${SCALE})`,
          width: 120,
          height: 210,
          pointerEvents: 'none',
        }}
      >
        <CardBack size="sm" />
      </div>
    </motion.div>
  )
}

export function SelectionStatus({
  spread,
  slots,
  requiredCount,
  selectionComplete,
  onSlotClick,
  onConfirm,
}: SelectionStatusProps) {
  const selectedCount = slots.filter(Boolean).length

  return (
    <>
      {/* Instruction */}
      <p
        className="text-center mb-8"
        style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          color: '#7A7A7A',
          fontStyle: 'italic',
          fontSize: '1.05rem',
        }}
      >
        {selectionComplete
          ? 'All cards placed — tap a placed card to return it, or confirm when ready.'
          : 'Trust your intuition. Tap a card to place it. Tap a placed card to return it.'}
      </p>

      {/* Slot zone */}
      <div className="flex justify-center gap-6 sm:gap-10 mb-5">
        {SPREAD_LABELS[spread].map((label, slotIdx) => {
          const selCard = slots[slotIdx] ?? null
          return (
            <div key={slotIdx} className="flex flex-col items-center gap-2">
              <span
                className="text-[12px] tracking-[0.22em] uppercase"
                style={{ color: 'rgba(198,168,91,0.65)', fontFamily: 'var(--font-cinzel), serif' }}
              >
                {label}
              </span>
              <div style={{ width: CARD_W, height: CARD_H, position: 'relative' }}>
                <SlotPlaceholder />
                {selCard && (
                  <SlotOccupied selCard={selCard} onSlotClick={onSlotClick} />
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
              backgroundColor: slots[i] ? '#C6A85B' : 'rgba(198,168,91,0.15)',
            }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            style={{
              height: 8,
              borderRadius: 4,
              boxShadow: slots[i] ? '0 0 8px rgba(198,168,91,0.4)' : 'none',
            }}
          />
        ))}
      </div>

      {/* Done / remaining */}
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
              onClick={onConfirm}
              className="relative px-8 py-3 rounded-full overflow-hidden hover:scale-105 transition-transform pulse-ring"
              style={BTN}
            >
              <span className="relative z-10">✦ &nbsp; I&apos;m Done</span>
              <div className="absolute inset-0 shimmer" />
            </motion.button>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                color: '#555',
                fontFamily: 'var(--font-cormorant), serif',
                fontStyle: 'italic',
                fontSize: '0.9rem',
              }}
            >
              {requiredCount - selectedCount === 1
                ? '1 card remaining'
                : `${requiredCount - selectedCount} cards remaining`}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
