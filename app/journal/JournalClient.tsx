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
  question?: string
  emotionalContext?: string
  zodiacSign?: string
  cards: DrawnEntry[]
  summary?: string          // synthesis paragraph — the key saved text
  sections?: {
    cards: Record<string, string>
    advice: string
    synthesis: string
  }
  note: string
}

export default function JournalClient() {
  const [entries, setEntries]   = useState<JournalEntry[]>([])
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
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}>
            Your Readings
          </p>
          <h1 className="text-5xl md:text-6xl font-light mb-3" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: '#F2F2F2', letterSpacing: '0.04em', fontStyle: 'italic' }}>
            The Journal
          </h1>
          <p className="text-xl" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: '#B3B3B3', fontStyle: 'italic' }}>
            {entries.length
              ? `${entries.length} reading${entries.length === 1 ? '' : 's'} recorded.`
              : 'Your saved readings will appear here.'}
          </p>
        </div>

        {entries.length === 0 && (
          <div className="text-center py-24">
            <div className="text-4xl mb-5" style={{ color: '#7A7A7A' }}>◈</div>
            <p className="mb-8 text-lg" style={{ color: '#7A7A7A', fontFamily: 'var(--font-cormorant), cursive' }}>
              No readings saved yet.
            </p>
            <Link
              href="/reading"
              className="relative inline-block px-8 py-3 rounded-full text-xs tracking-[0.1em] uppercase overflow-hidden hover:scale-105 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, rgba(198,168,91,0.8) 0%, #C6A85B 50%, rgba(198,168,91,0.8) 100%)', color: '#0A0A0A', fontFamily: 'var(--font-cinzel), serif' }}
            >
              Go to Reading Room
            </Link>
          </div>
        )}

        <div className="space-y-3">
          <AnimatePresence>
            {entries.map((entry) => {
              const isOpen      = expanded === entry.id
              const date        = new Date(entry.date)
              const spreadLabel = entry.spread === '1' ? 'One Card' : 'Three Cards — Past · Present · Future'
              // resolve the synthesis: prefer top-level summary, fall back to sections
              const synthesis   = entry.summary || entry.sections?.synthesis || ''

              return (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="rounded-2xl border overflow-hidden"
                  style={{
                    borderColor: isOpen ? 'rgba(198,168,91,0.32)' : 'rgba(198,168,91,0.12)',
                    backgroundColor: 'rgba(14,14,14,0.75)',
                    backdropFilter: 'blur(10px)',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  {/* ── Collapsed header ── */}
                  <button
                    type="button"
                    className="w-full flex items-start justify-between px-4 sm:px-6 py-4 text-left gap-4"
                    onClick={() => setExpanded(isOpen ? null : entry.id)}
                  >
                    <div className="min-w-0 flex-1">
                      {/* Question preview if present */}
                      {entry.question ? (
                        <p className="font-light mb-0.5 truncate" style={{ color: '#F2F2F2', fontFamily: 'var(--font-cormorant), cursive', fontSize: '1.18rem', fontStyle: 'italic' }}>
                          "{entry.question.length > 60 ? entry.question.slice(0, 60) + '…' : entry.question}"
                        </p>
                      ) : (
                        <p className="font-light mb-0.5" style={{ color: '#F2F2F2', fontFamily: 'var(--font-cormorant), cursive', fontSize: '1.18rem' }}>
                          {spreadLabel}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs tracking-wide" style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.6rem' }}>
                          {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        {entry.question && (
                          <span style={{ color: 'rgba(198,168,91,0.3)', fontSize: '0.5rem' }}>·</span>
                        )}
                        {entry.question && (
                          <p className="text-xs" style={{ color: 'rgba(198,168,91,0.5)', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.6rem' }}>
                            {spreadLabel}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 pt-0.5">
                      <div className="flex gap-1">
                        {entry.cards.slice(0, 3).map((c) => {
                          const card = getCardBySlug(c.id)
                          return card ? <span key={c.id} className="text-base">{card.symbol}</span> : null
                        })}
                      </div>
                      <span className="text-xs transition-transform duration-200" style={{ color: '#C6A85B', display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                    </div>
                  </button>

                  {/* ── Expanded body ── */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-6 pb-6 border-t" style={{ borderColor: 'rgba(198,168,91,0.1)' }}>

                          {/* Context — question + feeling */}
                          {(entry.question || entry.emotionalContext) && (
                            <div className="pt-5 pb-4 mb-1 flex flex-col gap-1.5">
                              {entry.question && (
                                <p style={{ color: '#B3B3B3', fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '1rem', fontStyle: 'italic', lineHeight: '1.6' }}>
                                  <span className="not-italic text-[10px] tracking-[0.18em] uppercase mr-2" style={{ color: '#7A7A7A', fontFamily: 'var(--font-cinzel), serif' }}>Situation</span>
                                  {entry.question}
                                </p>
                              )}
                              {entry.emotionalContext && (
                                <p style={{ color: '#B3B3B3', fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '1rem', fontStyle: 'italic', lineHeight: '1.6' }}>
                                  <span className="not-italic text-[10px] tracking-[0.18em] uppercase mr-2" style={{ color: '#7A7A7A', fontFamily: 'var(--font-cinzel), serif' }}>Feeling</span>
                                  {entry.emotionalContext}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Cards row */}
                          <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-5 py-5 border-y" style={{ borderColor: 'rgba(198,168,91,0.08)' }}>
                            {entry.cards.map((c, i) => {
                              const card = getCardBySlug(c.id)
                              if (!card) return null
                              return (
                                <div key={i} className="flex flex-col items-center gap-2">
                                  {c.label && (
                                    <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}>
                                      {c.label}
                                    </span>
                                  )}
                                  <div style={{ transform: c.reversed ? 'rotate(180deg)' : 'none', filter: 'drop-shadow(0 0 10px rgba(198,168,91,0.18))' }}>
                                    <CardArt card={card} size="sm" />
                                  </div>
                                  <p className="text-center max-w-[110px] leading-snug" style={{ color: '#F2F2F2', fontFamily: 'var(--font-cormorant), cursive', fontSize: '0.95rem' }}>
                                    {card.name}
                                    {c.reversed && <span style={{ color: '#C6A85B' }}> (R)</span>}
                                  </p>
                                </div>
                              )
                            })}
                          </div>

                          {/* Reading result — synthesis */}
                          {synthesis && (
                            <div className="mt-5 mb-5 rounded-xl px-5 py-4" style={{ backgroundColor: 'rgba(18,28,22,0.65)', border: '1px solid rgba(198,168,91,0.13)' }}>
                              <p className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}>
                                ✦ The Reading
                              </p>
                              <div className="space-y-3">
                                {synthesis.split('\n\n').filter(Boolean).map((para, pi) => (
                                  <p key={pi} style={{ color: pi === 0 ? '#D8E8C0' : '#A8BF90', fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '1.05rem', lineHeight: '1.85', fontStyle: pi > 0 ? 'italic' : 'normal' }}>
                                    {para}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Personal note */}
                          <div className="mb-4">
                            <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: '#7A7A7A', fontFamily: 'var(--font-cinzel), serif' }}>
                              Your reflection
                            </p>
                            <textarea
                              value={entry.note}
                              onChange={(e) => updateNote(entry.id, e.target.value)}
                              rows={3}
                              placeholder="Write your thoughts about this reading…"
                              className="w-full rounded-xl px-4 py-3 resize-none outline-none transition-all"
                              style={{ backgroundColor: 'rgba(10,10,10,0.8)', border: '1px solid rgba(198,168,91,0.12)', color: '#F2F2F2', fontFamily: 'var(--font-cormorant), cursive', fontSize: '1.05rem', lineHeight: '1.7' }}
                            />
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => deleteEntry(entry.id)}
                              className="text-[10px] px-4 py-1.5 rounded-lg transition-all hover:border-red-900/50 hover:text-red-400 tracking-[0.1em] uppercase"
                              style={{ color: '#7A7A7A', border: '1px solid rgba(198,168,91,0.12)', fontFamily: 'var(--font-cinzel), serif' }}
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
    </div>
  )
}
