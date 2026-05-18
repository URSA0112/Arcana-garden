'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getMoonPhase, getZodiacSign, ELEMENT_COLOR } from '@/lib/astronomy'
import { NAV_LINKS } from '@/app/constants/navigation'
import { TRACKS, BAR_HEIGHTS, type TrackId } from '@/app/constants/music'
import { useAudio } from './hooks/useAudio'

// ── AudioPlayer ───────────────────────────────────────────────────────────────

function AudioPlayer({
  playing, loading, activeId, onToggle, onSelect,
}: {
  playing:  boolean
  loading:  boolean
  activeId: TrackId
  onToggle: () => void
  onSelect: (id: TrackId) => void
}) {
  const active = TRACKS.find((t) => t.id === activeId)!

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        border: `1px solid ${playing ? 'rgba(198,168,91,0.28)' : 'rgba(198,168,91,0.1)'}`,
        backgroundColor: playing ? 'rgba(198,168,91,0.04)' : 'rgba(14,14,14,0.8)',
        transition: 'border-color 0.4s ease, background-color 0.4s ease',
      }}
    >
      {/* Play / pause row */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={playing ? 'Pause music' : 'Play music'}
        className="flex items-center gap-3 w-full mb-4"
      >
        {/* Waveform bars / buffering dots */}
        <div className="flex items-end gap-px flex-shrink-0" style={{ height: 18, width: 22 }}>
          {loading ? (
            [0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full self-center mx-px audio-bar"
                style={{ backgroundColor: '#C6A85B', animationDelay: `${i * 0.15}s` }}
              />
            ))
          ) : (
            BAR_HEIGHTS.map((h, i) => (
              <div
                key={i}
                className={playing ? 'audio-bar' : ''}
                style={{
                  width: 2,
                  height: playing ? `${h * 100}%` : '28%',
                  borderRadius: 1,
                  backgroundColor: playing ? '#C6A85B' : '#333',
                  transformOrigin: 'bottom',
                  animationDelay: `${i * 0.11}s`,
                  transition: 'background-color 0.4s ease, height 0.4s ease',
                }}
              />
            ))
          )}
        </div>

        <div className="flex-1 text-left">
          <p
            className="text-[11px] tracking-[0.1em] uppercase leading-none"
            style={{ color: playing ? '#C6A85B' : '#555', fontFamily: 'var(--font-cinzel), serif', transition: 'color 0.3s' }}
          >
            {loading ? 'Buffering…' : playing ? active.name : 'Play Music'}
          </p>
          <p
            className="text-[10px] mt-0.5 leading-none"
            style={{ color: '#2A2A2A', fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic' }}
          >
            {playing ? active.desc : 'Choose a channel below'}
          </p>
        </div>

        {/* Play / pause icon */}
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300"
          style={{
            width: 28, height: 28,
            border: `1px solid ${playing ? 'rgba(198,168,91,0.4)' : 'rgba(198,168,91,0.15)'}`,
            backgroundColor: playing ? 'rgba(198,168,91,0.12)' : 'transparent',
          }}
        >
          <span style={{ color: playing ? '#C6A85B' : '#444', fontSize: '0.55rem' }}>
            {loading ? '…' : playing ? '❚❚' : '▶'}
          </span>
        </div>
      </button>

      {/* Track selector pills */}
      <div className="flex gap-2">
        {TRACKS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            title={t.desc}
            className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-200"
            style={{
              border: `1px solid ${activeId === t.id ? 'rgba(198,168,91,0.35)' : 'rgba(198,168,91,0.08)'}`,
              backgroundColor: activeId === t.id ? 'rgba(198,168,91,0.08)' : 'transparent',
            }}
          >
            <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>{t.icon}</span>
            <span
              className="text-[8px] tracking-[0.04em] uppercase leading-none"
              style={{ color: activeId === t.id ? '#C6A85B' : '#333', fontFamily: 'var(--font-cinzel), serif', transition: 'color 0.2s' }}
            >
              {t.name.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

export default function Footer() {
  const [moon,    setMoon]    = useState<ReturnType<typeof getMoonPhase>  | null>(null)
  const [zodiac,  setZodiac]  = useState<ReturnType<typeof getZodiacSign> | null>(null)
  const [dateStr, setDateStr] = useState('')
  const { playing, loading, activeId, toggle, selectTrack } = useAudio()

  useEffect(() => {
    const now = new Date()
    setMoon(getMoonPhase(now))
    setZodiac(getZodiacSign(now))
    setDateStr(now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))
  }, [])

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 10,
        backgroundColor: '#0A0A0A',
        borderTop: '1px solid rgba(198,168,91,0.1)',
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 sm:gap-6 mb-10">

          {/* Brand */}
          <div>
            <p
              className="text-xs tracking-[0.35em] uppercase mb-2"
              style={{ color: 'rgba(198,168,91,0.5)', fontFamily: 'var(--font-cinzel), serif' }}
            >
              ✦ &nbsp;Arcana Garden
            </p>
            <p
              style={{
                color: '#555',
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: '0.95rem',
                lineHeight: '1.7',
                fontStyle: 'italic',
                maxWidth: 200,
              }}
            >
              A tarot learning &amp; reading platform for seekers of all paths.
            </p>
          </div>

          {/* Navigation — skip Home, already in logo */}
          <div>
            <p
              className="text-[10px] tracking-[0.3em] uppercase mb-4"
              style={{ color: 'rgba(198,168,91,0.4)', fontFamily: 'var(--font-cinzel), serif' }}
            >
              Navigate
            </p>
            <ul className="space-y-2.5">
              {NAV_LINKS.filter((l) => l.href !== '/').map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="transition-colors duration-150 hover:text-[#C6A85B]"
                    style={{ color: '#555', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.7rem', letterSpacing: '0.06em' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tonight's Sky */}
          <div>
            <p
              className="text-[10px] tracking-[0.3em] uppercase mb-4"
              style={{ color: 'rgba(198,168,91,0.4)', fontFamily: 'var(--font-cinzel), serif' }}
            >
              Tonight&apos;s Sky
            </p>
            <div
              className="rounded-2xl p-4 space-y-3"
              style={{ border: '1px solid rgba(198,168,91,0.12)', backgroundColor: 'rgba(14,14,14,0.8)' }}
            >
              <div className="flex items-center gap-3">
                <span style={{ fontSize: '1.55rem', lineHeight: 1 }}>{moon?.symbol ?? '🌕'}</span>
                <div>
                  <p className="text-[11px] tracking-[0.08em] uppercase" style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}>
                    {moon?.name ?? '—'}
                  </p>
                  <p style={{ color: '#555', fontFamily: 'var(--font-cormorant), serif', fontSize: '0.8rem', fontStyle: 'italic' }}>
                    {dateStr}
                  </p>
                </div>
              </div>
              <div style={{ height: 1, backgroundColor: 'rgba(198,168,91,0.08)' }} />
              <div className="flex items-center gap-3">
                <span
                  style={{
                    fontSize: '1.25rem', lineHeight: 1,
                    color: zodiac ? ELEMENT_COLOR[zodiac.element] : '#C6A85B',
                    filter: 'drop-shadow(0 0 5px currentColor)',
                  }}
                >
                  {zodiac?.symbol ?? '♈'}
                </span>
                <div>
                  <p className="text-[11px] tracking-[0.08em] uppercase" style={{ color: '#EBD5AB', fontFamily: 'var(--font-cinzel), serif' }}>
                    ☉ &nbsp;{zodiac?.name ?? '—'}
                  </p>
                  <p style={{ color: '#555', fontFamily: 'var(--font-cormorant), serif', fontSize: '0.8rem', fontStyle: 'italic' }}>
                    {zodiac?.element} · Sun sign season
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Audio */}
          <div>
            <p
              className="text-[10px] tracking-[0.3em] uppercase mb-4"
              style={{ color: 'rgba(198,168,91,0.4)', fontFamily: 'var(--font-cinzel), serif' }}
            >
              Atmosphere
            </p>
            <AudioPlayer
              playing={playing}
              loading={loading}
              activeId={activeId}
              onToggle={toggle}
              onSelect={selectTrack}
            />
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6"
          style={{ borderTop: '1px solid rgba(198,168,91,0.07)' }}
        >
          <p
            className="text-[10px] tracking-[0.2em] uppercase"
            style={{ color: '#2A2A2A', fontFamily: 'var(--font-cinzel), serif' }}
          >
            © {new Date().getFullYear()} Arcana Garden
          </p>
          <p
            className="text-[10px] tracking-[0.2em] uppercase"
            style={{ color: '#2A2A2A', fontFamily: 'var(--font-cinzel), serif' }}
          >
            Music by{' '}
            <a href="https://somafm.com" target="_blank" rel="noreferrer" style={{ color: '#3A3A3A' }} className="hover:text-[#555] transition-colors">
              SomaFM
            </a>
            {' '}✦ All rights reserved
          </p>
        </div>

      </div>
    </footer>
  )
}
