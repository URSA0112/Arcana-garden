'use client'

import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { TarotCard } from '@/lib/tarot-data'
import CardBack from '../../components/CardBack'
import { Spread, SlotArray, SPREAD_LABELS, CARD_W, CARD_H, SCALE, BTN } from '../reading-types'
import { SelectedCard } from '../reading-types'

interface CardSelectingProps {
  spread: Spread
  slots: SlotArray
  shuffledDeck: TarotCard[]
  selectedCount: number
  requiredCount: number
  selectionComplete: boolean
  onCardClick: (card: TarotCard, deckIndex: number) => void
  onConfirm: () => void
  onReset: () => void
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
          borderBottom: '1px solid rgba(98,129,65,0.07)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onReset}
            className="text-xs tracking-[0.1em] uppercase opacity-40 hover:opacity-70 transition-opacity"
            style={{ color: '#8BAE66', fontFamily: 'var(--font-cinzel), serif' }}
          >
            ← Back
          </button>
          <span
            className="text-[11px] tabular-nums"
            style={{ color: '#3a4e35', fontFamily: 'var(--font-cinzel), serif' }}
          >
            {selectedCount}&thinsp;/&thinsp;{requiredCount}
          </span>
        </div>
      </div>

      <LayoutGroup>
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-20">
          <p
            className="text-center mb-8"
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              color: '#4a6642',
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
                    style={{ color: '#507040', fontFamily: 'var(--font-cinzel), serif' }}
                  >
                    {label}
                  </span>
                  <div style={{ width: CARD_W, height: CARD_H, position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 6,
                        border: '1px dashed rgba(98,129,65,0.22)',
                        backgroundColor: 'rgba(98,129,65,0.03)',
                      }}
                    />
                    {selCard && (
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
                        onClick={() => onCardClick(selCard.card, selCard.deckIndex)}
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
                  height: 8,
                  borderRadius: 4,
                  boxShadow: slots[i] ? '0 0 8px rgba(98,129,65,0.4)' : 'none',
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
                  <span className="relative z-10">✦ &nbsp; I'm Done</span>
                  <div className="absolute inset-0 shimmer" />
                </motion.button>
              ) : (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    color: '#2e3e28',
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

          <div className="ornament mb-7">
            <span style={{ color: 'rgba(98,129,65,0.25)', fontSize: '0.5rem' }}>✦</span>
          </div>

          {/* Card grid */}
          <div className="flex flex-wrap justify-center" style={{ gap: 7 }}>
            {shuffledDeck.map((card, i) => {
              const isInSlot   = slots.some((s) => s?.deckIndex === i)
              const isDisabled = !isInSlot && selectionComplete
              if (isInSlot) {
                return (
                  <div
                    key={`ghost-${i}`}
                    style={{
                      width: CARD_W,
                      height: CARD_H,
                      flexShrink: 0,
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
                    onClick={() => !isDisabled && onCardClick(card, i)}
                    style={{
                      width: CARD_W,
                      height: CARD_H,
                      borderRadius: 6,
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: isDisabled ? 'default' : 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.32)',
                    }}
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
                      }}
                    >
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
  )
}
