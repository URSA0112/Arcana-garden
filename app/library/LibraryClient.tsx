'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { TarotCard } from '@/lib/tarot-data'
import CardArt from '../components/CardArt'


type Filter = 'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'

const filterLabels: Record<Filter, string> = {
  all: 'All Cards',
  major: 'Major Arcana',
  wands: 'Wands',
  cups: 'Cups',
  swords: 'Swords',
  pentacles: 'Pentacles',
}

const filterSymbols: Record<Filter, string> = {
  all: '◈', major: '✦', wands: '🔥', cups: '💧', swords: '⚔️', pentacles: '🌿',
}

export default function LibraryClient({ cards }: { cards: TarotCard[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return cards.filter((c) => {
      const matchFilter =
        filter === 'all' ||
        (filter === 'major' && c.arcana === 'major') ||
        c.suit === filter
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()))
      return matchFilter && matchSearch
    })
  }, [cards, filter, search])

  return (
    <>
      {/* Background image */}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, zIndex: 0,
          backgroundImage: 'url(https://res.cloudinary.com/dt43fy6cr/image/upload/v1778685421/moonsun-cropforme.com_1_pi39hi.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
          opacity: 0.18, pointerEvents: 'none',
        }}
      />
      {/* Vignette */}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse 85% 80% at 50% 35%, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.75) 65%, rgba(10,10,10,0.95) 100%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh' }}>
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <p
          className="text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
        >
          All 78 Cards
        </p>
        <h1
          className="text-4xl md:text-5xl mb-3 text-glow"
          style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#F2F2F2' }}
        >
          The Library
        </h1>
        <p
          className="text-xl"
          style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: '#B3B3B3', fontStyle: 'italic' }}
        >
          Indexed and illuminated.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-5">
        {(Object.keys(filterLabels) as Filter[]).map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-sm transition-all duration-200 hover:scale-105"
            style={{
              border: `1px solid ${filter === f ? 'rgba(198,168,91,0.5)' : '#222222'}`,
              backgroundColor: filter === f ? 'rgba(198,168,91,0.1)' : 'transparent',
              color: filter === f ? '#F2F2F2' : '#7A7A7A',
              fontFamily: filter === f ? 'var(--font-cinzel), serif' : 'inherit',
              fontSize: filter === f ? '0.7rem' : '0.875rem',
              letterSpacing: filter === f ? '0.05em' : '0',
            }}
          >
            <span className="mr-1.5">{filterSymbols[f]}</span>
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="max-w-sm mx-auto mb-10 relative">
        <span
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
          style={{ color: '#7A7A7A' }}
        >
          ⌕
        </span>
        <input
          type="text"
          placeholder="Search cards or keywords…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
          style={{
            backgroundColor: '#141414',
            border: '1px solid #222222',
            color: '#F2F2F2',
            backdropFilter: 'blur(8px)',
          }}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filtered.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.012, 0.28) }}
          >
            <Link href={`/library/${card.id}`} className="group block">
              <div
                className="rounded-2xl overflow-hidden border transition-all duration-250 group-hover:scale-[1.04] group-hover:glow-sm"
                style={{
                  borderColor: '#222222',
                  backgroundColor: '#141414',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <div className="flex justify-center pt-3 pb-1 relative">
                  <CardArt card={card} size="sm" priority={i < 12} />
                </div>
                <div className="px-2 pb-3 text-center">
                  <p className="text-xs font-light leading-tight mb-0.5" style={{ color: '#F2F2F2' }}>
                    {card.name}
                  </p>
                  <p
                    className="text-[12px] capitalize tracking-wide"
                    style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
                  >
                    {card.arcana === 'major' ? 'Major' : card.suit}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20" style={{ color: '#7A7A7A' }}>
          <div className="text-4xl mb-3">◈</div>
          <p>No cards match your search.</p>
        </div>
      )}
    </div>
    </div>
    </>
  )
}
