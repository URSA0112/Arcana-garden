'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { getCardBySlug } from '@/lib/tarot-data'
import CardArt from '../components/CardArt'

interface DrawnEntry {
  id: string
  name: string
  reversed: boolean
  label?: string
}

interface JournalEntry {
  id: number
  date: string
  spread: string
  cards: DrawnEntry[]
  note: string
}

export default function JournalClient() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('arcana-journal')
    if (raw) setEntries(JSON.parse(raw))
  }, [])

  const deleteEntry = (id: number) => {
    const updated = entries.filter((e) => e.id !== id)
    setEntries(updated)
    localStorage.setItem('arcana-journal', JSON.stringify(updated))
    if (expanded === id) setExpanded(null)
  }

  const updateNote = (id: number, note: string) => {
    const updated = entries.map((e) => (e.id === id ? { ...e, note } : e))
    setEntries(updated)
    localStorage.setItem('arcana-journal', JSON.stringify(updated))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <p
          className="text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}
        >
          Your Readings
        </p>
        <h1
          className="text-5xl font-bold mb-3 text-glow"
          style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#EBD5AB' }}
        >
          The Journal
        </h1>
        <p
          className="text-xl"
          style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: '#8BAE66', fontStyle: 'italic' }}
        >
          {entries.length
            ? `${entries.length} reading${entries.length === 1 ? '' : 's'} recorded.`
            : 'Your saved readings will appear here.'}
        </p>
      </div>

      {entries.length === 0 && (
        <div className="text-center py-24">
          <div
            className="text-5xl mb-5"
            style={{ color: '#3a5228' }}
          >
            ◈
          </div>
          <p
            className="mb-8 text-sm tracking-wide"
            style={{ color: '#4a5e40', fontFamily: 'var(--font-cinzel), serif' }}
          >
            No readings saved yet.
          </p>
          <Link
            href="/reading"
            className="relative inline-block px-8 py-3 rounded-full text-xs tracking-[0.1em] uppercase overflow-hidden hover:scale-105 transition-all duration-300 hover:glow-primary"
            style={{
              background: 'linear-gradient(135deg, #4a6632 0%, #628141 50%, #4a6632 100%)',
              color: '#EBD5AB',
              fontFamily: 'var(--font-cinzel), serif',
            }}
          >
            Go to Reading Room
          </Link>
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {entries.map((entry) => {
            const isOpen = expanded === entry.id
            const date = new Date(entry.date)
            const spreadLabel = entry.spread === '1' ? 'One Card' : 'Three Card — Past · Present · Future'

            return (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="rounded-2xl border overflow-hidden"
                style={{
                  borderColor: isOpen ? 'rgba(98,129,65,0.35)' : 'rgba(98,129,65,0.18)',
                  backgroundColor: 'rgba(26, 36, 32, 0.65)',
                  backdropFilter: 'blur(10px)',
                  transition: 'border-color 0.2s ease',
                }}
              >
                {/* Header row */}
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                  onClick={() => setExpanded(isOpen ? null : entry.id)}
                >
                  <div>
                    <p
                      className="font-medium text-sm mb-0.5"
                      style={{
                        color: '#EBD5AB',
                        fontFamily: 'var(--font-cormorant), Georgia, serif',
                        fontStyle: 'italic',
                        fontSize: '1.05rem',
                      }}
                    >
                      {spreadLabel}
                    </p>
                    <p
                      className="text-xs tracking-wide"
                      style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.65rem' }}
                    >
                      {date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      {entry.cards.slice(0, 3).map((c) => {
                        const card = getCardBySlug(c.id)
                        return card ? (
                          <span key={c.id} className="text-base">{card.symbol}</span>
                        ) : null
                      })}
                    </div>
                    <span
                      className="text-xs transition-transform duration-200"
                      style={{
                        color: '#628141',
                        display: 'inline-block',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    >
                      ▼
                    </span>
                  </div>
                </button>

                {/* Expanded */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-6 pb-6 border-t"
                        style={{ borderColor: 'rgba(98, 129, 65, 0.18)' }}
                      >
                        <div className="flex flex-wrap gap-5 py-6">
                          {entry.cards.map((c, i) => {
                            const card = getCardBySlug(c.id)
                            if (!card) return null
                            return (
                              <div key={i} className="flex flex-col items-center gap-2">
                                {c.label && (
                                  <span
                                    className="text-[10px] tracking-[0.2em] uppercase"
                                    style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}
                                  >
                                    {c.label}
                                  </span>
                                )}
                                <div
                                  style={{
                                    transform: c.reversed ? 'rotate(180deg)' : 'none',
                                    filter: 'drop-shadow(0 0 10px rgba(98,129,65,0.25))',
                                  }}
                                >
                                  <CardArt card={card} size="sm" />
                                </div>
                                <p
                                  className="text-xs text-center max-w-[100px] leading-snug"
                                  style={{ color: '#EBD5AB', fontFamily: 'var(--font-cormorant), Georgia, serif', fontStyle: 'italic' }}
                                >
                                  {card.name}
                                  {c.reversed && (
                                    <span style={{ color: '#628141' }}> (R)</span>
                                  )}
                                </p>
                              </div>
                            )
                          })}
                        </div>

                        <textarea
                          value={entry.note}
                          onChange={(e) => updateNote(entry.id, e.target.value)}
                          rows={3}
                          placeholder="Add a note about this reading…"
                          className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none mb-4 transition-all"
                          style={{
                            backgroundColor: 'rgba(16, 23, 20, 0.7)',
                            border: '1px solid rgba(98, 129, 65, 0.2)',
                            color: '#EBD5AB',
                            fontFamily: 'var(--font-cormorant), Georgia, serif',
                            fontSize: '1rem',
                          }}
                        />

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => deleteEntry(entry.id)}
                            className="text-[10px] px-4 py-1.5 rounded-lg transition-all hover:border-red-900/50 hover:text-red-400 tracking-[0.1em] uppercase"
                            style={{
                              color: '#4a5e40',
                              border: '1px solid rgba(98,129,65,0.2)',
                              fontFamily: 'var(--font-cinzel), serif',
                            }}
                          >
                            Delete Entry
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
