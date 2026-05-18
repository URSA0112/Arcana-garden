'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TarotCard } from '@/lib/tarot-data'
import CardBack from '../../components/CardBack'
import { SlotArray, CARD_W, CARD_H, SCALE } from '../reading-types'

// Mobile horizontal-scroll strip: 4 rows, ~6 cols visible at once
const M_W     = 54
const M_H     = Math.round(M_W * 1.75)  // 94px
const M_SCALE = M_W / 120
const M_ROWS  = 4
const M_GAP   = 5
const M_SCROLL_SPEED = 30  // px per second — slow, relaxed drift

interface CardGridProps {
  shuffledDeck:      TarotCard[]
  slots:             SlotArray
  selectionComplete: boolean
  onCardClick:       (card: TarotCard, deckIndex: number) => void
}

function GhostCard({ w, h }: { w: number; h: number }) {
  return (
    <div
      style={{
        width: w, height: h, flexShrink: 0,
        borderRadius: 6,
        border: '1px dashed rgba(198,168,91,0.1)',
        backgroundColor: 'rgba(198,168,91,0.02)',
        opacity: 0.3,
      }}
    />
  )
}

export function CardGrid({ shuffledDeck, slots, selectionComplete, onCardClick }: CardGridProps) {
  const [isMobile, setIsMobile] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Detect mobile (< 640px = Tailwind sm breakpoint)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Auto-scroll right-to-left on mobile; stops permanently on first touch/click
  useEffect(() => {
    if (!isMobile) return
    const el = scrollRef.current
    if (!el) return

    let stopped  = false
    let rafId    = 0
    let lastTime: number | null = null

    const tick = (ts: number) => {
      if (stopped) return
      if (lastTime !== null) {
        const px = (M_SCROLL_SPEED * (ts - lastTime)) / 1000
        el.scrollLeft += px
      }
      lastTime = ts
      // Stop at the far end automatically
      if (el.scrollLeft < el.scrollWidth - el.clientWidth - 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    rafId = requestAnimationFrame(tick)

    const stop = () => {
      stopped = true
      cancelAnimationFrame(rafId)
    }
    el.addEventListener('touchstart', stop, { once: true, passive: true })
    el.addEventListener('pointerdown', stop, { once: true })

    return () => {
      stopped = true
      cancelAnimationFrame(rafId)
      el.removeEventListener('touchstart', stop)
      el.removeEventListener('pointerdown', stop)
    }
  }, [isMobile])

  // ── Mobile: 4-row horizontal strip ──────────────────────────────────────
  if (isMobile) {
    return (
      <div
        ref={scrollRef}
        className="no-scrollbar"
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          // Pull the strip to the screen edges, ignoring parent px-4
          marginLeft: '-16px',
          marginRight: '-16px',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(${M_ROWS}, ${M_H}px)`,
            gridAutoFlow: 'column',
            gridAutoColumns: `${M_W}px`,
            gap: M_GAP,
            // Small bottom padding so cards don't clip on scroll
            paddingBottom: 4,
          }}
        >
          {shuffledDeck.map((card, i) => {
            const isInSlot   = slots.some((s) => s?.deckIndex === i)
            const isDisabled = !isInSlot && selectionComplete

            if (isInSlot) return <GhostCard key={`ghost-${i}`} w={M_W} h={M_H} />

            return (
              <motion.div
                key={`${card.id}-${i}`}
                layoutId={`card-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: isDisabled ? 0.18 : 1 }}
                transition={{ delay: Math.min(i * 0.005, 0.25), duration: 0.28, ease: 'easeOut' }}
                style={{ width: M_W, height: M_H, flexShrink: 0, position: 'relative' }}
              >
                <div
                  className={!isDisabled ? 'can-pick' : ''}
                  onClick={() => !isDisabled && onCardClick(card, i)}
                  style={{
                    width: M_W, height: M_H,
                    borderRadius: 6, overflow: 'hidden',
                    position: 'relative',
                    cursor: isDisabled ? 'default' : 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.32)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute', top: 0, left: 0,
                      transformOrigin: 'top left',
                      transform: `scale(${M_SCALE})`,
                      width: 120, height: 210,
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
    )
  }

  // ── Desktop: original flex-wrap grid ────────────────────────────────────
  return (
    <div className="flex flex-wrap justify-center" style={{ gap: 7 }}>
      {shuffledDeck.map((card, i) => {
        const isInSlot   = slots.some((s) => s?.deckIndex === i)
        const isDisabled = !isInSlot && selectionComplete

        if (isInSlot) return <GhostCard key={`ghost-${i}`} w={CARD_W} h={CARD_H} />

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
                width: CARD_W, height: CARD_H,
                borderRadius: 6, overflow: 'hidden',
                position: 'relative',
                cursor: isDisabled ? 'default' : 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.32)',
              }}
            >
              <div
                style={{
                  position: 'absolute', top: 0, left: 0,
                  transformOrigin: 'top left',
                  transform: `scale(${SCALE})`,
                  width: 120, height: 210,
                }}
              >
                <CardBack size="sm" />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
