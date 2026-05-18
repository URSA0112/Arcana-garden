'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { TarotCard } from '@/lib/tarot-data'
import { prependJournalEntry } from '@/lib/storage'
import type { JournalEntry } from '@/types/journal'

import {
  Spread, Phase, SelectedCard, SlotArray, ParsedReading,
  SPREAD_LABELS, BG_URL,
} from './reading-types'
import { strongShuffle, parseReading, buildFallbackReading, playSound } from './reading-utils'
import { ReadingIntro }   from './components/ReadingIntro'
import { CardSelecting }  from './components/CardSelecting'
import { ReadingContext } from './components/ReadingContext'
import { ReadingPhase }   from './components/ReadingPhase'

export default function ReadingClient({ cards }: { cards: TarotCard[] }) {
  const [phase, setPhase]   = useState<Phase>('intro')
  const [spread, setSpread] = useState<Spread>('3')

  const [question, setQuestion]               = useState('')
  const [emotionalContext, setEmotionalContext] = useState('')
  const [zodiacSign, setZodiacSign]           = useState('')

  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([])
  const [slots, setSlots]               = useState<SlotArray>([])

  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set())
  const [aiReading, setAiReading]         = useState('')
  const [parsedReading, setParsedReading] = useState<ParsedReading>({ cards: {}, advice: '', synthesis: '' })
  const [aiLoading, setAiLoading]         = useState(false)
  const [apiFailed, setApiFailed]         = useState(false)

  const [note, setNote]   = useState('')
  const [saved, setSaved] = useState(false)

  const requiredCount     = spread === '1' ? 1 : 3
  const selectedCards     = slots.filter((s): s is SelectedCard => s !== null)
  const selectedCount     = selectedCards.length
  const selectionComplete = slots.length > 0 && slots.every((s) => s !== null)

  // ── API ──────────────────────────────────────────────────────────────

  const fetchReading = useCallback(async (selCards: SelectedCard[]) => {
    setAiLoading(true)
    setApiFailed(false)
    setAiReading('')
    setParsedReading({ cards: {}, advice: '', synthesis: '' })
    try {
      const res = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cards: selCards.map((d) => ({
            name: d.card.name,
            reversed: d.reversed,
            label: d.label,
            keywords: d.card.keywords,
            upright: d.card.upright,
            reversed_meaning: d.card.reversed,
          })),
          spread, question, emotionalContext, zodiacSign,
        }),
      })
      if (!res.ok || !res.body) throw new Error('API unavailable')
      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let text = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        setAiReading(text)
        setParsedReading(parseReading(text))
      }
    } catch {
      setApiFailed(true)
      const fallback = buildFallbackReading(selCards, question)
      setAiReading(fallback)
      setParsedReading(parseReading(fallback))
    } finally {
      setAiLoading(false)
    }
  }, [spread, question, emotionalContext, zodiacSign])

  // ── Phase transitions ─────────────────────────────────────────────

  const beginSelecting = useCallback(() => {
    setShuffledDeck(strongShuffle(cards))
    setSlots(Array.from({ length: spread === '1' ? 1 : 3 }, () => null))
    setPhase('selecting')
  }, [cards, spread])

  const handleCardClick = useCallback((card: TarotCard, deckIndex: number) => {
    const existingSlot = slots.findIndex((s) => s?.deckIndex === deckIndex)
    if (existingSlot !== -1) {
      playSound('unpick')
      setSlots((prev) => { const n = [...prev]; n[existingSlot] = null; return n })
      return
    }
    if (selectionComplete) return
    const firstEmpty = slots.findIndex((s) => s === null)
    if (firstEmpty === -1) return
    playSound('pick')
    setSlots((prev) => {
      const n = [...prev]
      n[firstEmpty] = {
        card,
        reversed: Math.random() < 0.3,
        label: SPREAD_LABELS[spread][firstEmpty],
        deckIndex,
      }
      return n
    })
  }, [slots, selectionComplete, spread])

  const confirmSelection = useCallback(() => { playSound('done'); setPhase('context') }, [])

  const beginReading = useCallback(() => {
    setRevealedCards(new Set())
    setPhase('reading')
    const readingCards = slots.filter((s): s is SelectedCard => s !== null)
    readingCards.forEach((_, i) => {
      setTimeout(() => setRevealedCards((prev) => new Set([...prev, i])), i * 650 + 500)
    })
    fetchReading(readingCards)
  }, [slots, fetchReading])

  const reset = useCallback(() => {
    setPhase('intro'); setSlots([]); setRevealedCards(new Set())
    setAiReading(''); setParsedReading({ cards: {}, advice: '', synthesis: '' })
    setSaved(false); setNote(''); setQuestion(''); setEmotionalContext(''); setZodiacSign('')
    setApiFailed(false)
  }, [])

  const saveToJournal = () => {
    const readingCards = slots.filter((s): s is SelectedCard => s !== null)
    if (!readingCards.length) return
    const entry: JournalEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      spread,
      question,
      emotionalContext,
      zodiacSign,
      cards: readingCards.map((s) => ({
        id: s.card.id,
        name: s.card.name,
        reversed: s.reversed,
        label: s.label,
      })),
      summary: parsedReading.synthesis,
      sections: parsedReading,
      note,
    }
    prependJournalEntry(entry)
    setSaved(true)
  }

  // ── Render ────────────────────────────────────────────────────────

  return (
    <>
      {/* Background image */}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, zIndex: 0,
          backgroundImage: `url('${BG_URL}')`,
          backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
          opacity: 0.28, pointerEvents: 'none',
        }}
      />
      {/* Vignette overlay */}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse 85% 80% at 50% 35%, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.78) 65%, rgba(10,10,10,0.96) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh' }}>
        <AnimatePresence mode="wait">

          {phase === 'intro' && (
            <ReadingIntro
              key="intro"
              spread={spread}
              setSpread={setSpread}
              onBegin={beginSelecting}
            />
          )}

          {phase === 'selecting' && (
            <CardSelecting
              key="selecting"
              spread={spread}
              slots={slots}
              shuffledDeck={shuffledDeck}
              selectedCount={selectedCount}
              requiredCount={requiredCount}
              selectionComplete={selectionComplete}
              onCardClick={handleCardClick}
              onConfirm={confirmSelection}
              onReset={reset}
            />
          )}

          {phase === 'context' && (
            <ReadingContext
              key="context"
              selectedCards={selectedCards}
              requiredCount={requiredCount}
              question={question}
              setQuestion={setQuestion}
              emotionalContext={emotionalContext}
              setEmotionalContext={setEmotionalContext}
              zodiacSign={zodiacSign}
              setZodiacSign={setZodiacSign}
              onBeginReading={beginReading}
              onBack={() => setPhase('selecting')}
            />
          )}

          {phase === 'reading' && (
            <ReadingPhase
              key="reading"
              selectedCards={selectedCards}
              revealedCards={revealedCards}
              parsedReading={parsedReading}
              aiLoading={aiLoading}
              aiReading={aiReading}
              apiFailed={apiFailed}
              note={note}
              setNote={setNote}
              saved={saved}
              question={question}
              emotionalContext={emotionalContext}
              onSave={saveToJournal}
              onReset={reset}
            />
          )}

        </AnimatePresence>
      </div>
    </>
  )
}
