'use client'

import { motion } from 'framer-motion'
import type { StudyMode } from '../study-types'
import { MODE_META, LEVEL_INFO, TOTAL_LEVELS, QUESTIONS_PER_LEVEL } from '../constants'

const MODES: StudyMode[] = ['major', 'all', 'minor']

interface StudySetupProps {
  mode: StudyMode
  onSetMode: (mode: StudyMode) => void
  onStart: () => void
}

export function StudySetup({ mode, onSetMode, onStart }: StudySetupProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(198,168,91,0.05) 0%, transparent 65%)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(198,168,91,0.03) 1px, transparent 1px)', backgroundSize: '44px 44px' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-xl w-full mx-auto px-6 py-16 text-center"
      >
        <p
          className="text-[11px] tracking-[0.5em] uppercase mb-4"
          style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
        >
          Select Your Path
        </p>

        <h1
          className="text-5xl sm:text-6xl font-light mb-3"
          style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#F2F2F2' }}
        >
          Test Your Arcana
        </h1>

        <p
          className="text-lg mb-10"
          style={{ fontFamily: 'var(--font-cormorant), serif', color: '#7A7A7A', fontStyle: 'italic' }}
        >
          {TOTAL_LEVELS} levels · {QUESTIONS_PER_LEVEL} questions each
        </p>

        {/* Mode cards */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {MODES.map((m) => {
            const meta     = MODE_META[m]
            const isActive = mode === m
            return (
              <motion.button
                key={m}
                type="button"
                onClick={() => onSetMode(m)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-2xl p-4 flex flex-col items-center gap-2 transition-colors duration-200"
                style={{
                  border: `1px solid ${isActive ? 'rgba(198,168,91,0.55)' : 'rgba(198,168,91,0.1)'}`,
                  backgroundColor: isActive ? 'rgba(198,168,91,0.08)' : 'rgba(14,14,14,0.6)',
                  backdropFilter: 'blur(8px)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="mode-glow"
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(198,168,91,0.12) 0%, transparent 70%)' }}
                  />
                )}
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{meta.icon}</span>
                <span
                  className="text-[11px] tracking-[0.08em] uppercase leading-tight"
                  style={{ fontFamily: 'var(--font-cinzel), serif', color: isActive ? '#F2F2F2' : '#7A7A7A' }}
                >
                  {meta.label}
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: isActive ? 'rgba(198,168,91,0.8)' : '#444' }}
                >
                  {meta.count}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Level path */}
        <div className="flex items-start justify-center gap-0 mb-10">
          {LEVEL_INFO.map((lvl, i) => (
            <div key={lvl.name} className="flex items-start">
              <div className="flex flex-col items-center" style={{ width: 100 }}>
                <div
                  className="flex items-center justify-center rounded-full mb-2 text-[11px]"
                  style={{
                    width: 32, height: 32,
                    border: '1px solid rgba(198,168,91,0.3)',
                    backgroundColor: 'rgba(198,168,91,0.07)',
                    color: '#C6A85B',
                    fontFamily: 'var(--font-cinzel), serif',
                  }}
                >
                  {i + 1}
                </div>
                <p className="text-[11px] tracking-[0.05em]" style={{ fontFamily: 'var(--font-cinzel), serif', color: '#B3B3B3' }}>
                  {lvl.name}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: '#555', fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic' }}>
                  {lvl.subtitle}
                </p>
              </div>
              {i < LEVEL_INFO.length - 1 && (
                <div style={{ width: 24, height: 1, backgroundColor: 'rgba(198,168,91,0.2)', marginTop: 15, flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        {/* Streak bonuses */}
        <div
          className="flex justify-center gap-6 mb-10 py-4 rounded-2xl border"
          style={{ borderColor: 'rgba(198,168,91,0.1)', backgroundColor: 'rgba(14,14,14,0.5)' }}
        >
          {[
            { streak: 3, mult: '2×', label: 'combo' },
            { streak: 5, mult: '3×', label: 'combo' },
          ].map(({ streak, mult, label }) => (
            <div key={streak} className="flex items-center gap-2">
              <span style={{ fontSize: '1.1rem' }}>🔥</span>
              <div>
                <span className="text-[12px]" style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}>
                  {mult}&nbsp;pts
                </span>
                <span className="ml-1.5 text-[11px]" style={{ color: '#555', fontFamily: 'var(--font-cinzel), serif' }}>
                  {streak}+ {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onStart}
          className="relative px-14 py-4 rounded-full overflow-hidden hover:scale-105 transition-transform text-sm tracking-[0.15em] uppercase"
          style={{
            background: 'linear-gradient(135deg, rgba(198,168,91,0.9) 0%, #C6A85B 50%, rgba(198,168,91,0.9) 100%)',
            color: '#0A0A0A',
            fontFamily: 'var(--font-cinzel), serif',
            boxShadow: '0 0 32px rgba(198,168,91,0.2)',
          }}
        >
          <span className="relative z-10">✦ &nbsp; Enter the Trial</span>
          <div className="absolute inset-0 shimmer" />
        </button>
      </motion.div>
    </div>
  )
}
