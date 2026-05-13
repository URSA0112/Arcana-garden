import Link from 'next/link'
import Image from 'next/image'
import { getDailyCard } from '@/lib/tarot-data'
import DailyCardDisplay from './components/DailyCardDisplay'
import ParticleField from './components/ParticleField'

const HERO_IMAGE = 'https://res.cloudinary.com/dt43fy6cr/image/upload/v1778685421/moonsun-cropforme.com_1_pi39hi.jpg'

const navItems = [
  { href: '/reading', label: 'Draw Cards',  desc: 'Begin a reading',  symbol: '✦' },
  { href: '/library', label: 'Library',     desc: 'All 78 cards',     symbol: '◈' },
  { href: '/study',   label: 'Study',       desc: 'Flashcard mode',   symbol: '◇' },
  { href: '/journal', label: 'Journal',     desc: 'Saved readings',   symbol: '◉' },
]

export default function HomePage() {
  const dailyCard = getDailyCard()

  return (
    <div className="relative overflow-hidden">
      <ParticleField />

      {/* ── Hero ── */}
      <section className="relative min-h-[88vh] flex flex-col justify-end overflow-hidden">

        {/* Hero background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMAGE}
            alt="Sun and Moon — Arcana Garden"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Multi-stop overlay: darken edges, fade to transparent toward center, heavy at bottom */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(to bottom,
                  rgba(16,23,20,0.55) 0%,
                  rgba(16,23,20,0.1)  28%,
                  rgba(16,23,20,0.1)  55%,
                  rgba(16,23,20,0.82) 80%,
                  rgba(16,23,20,1)    100%
                ),
                linear-gradient(to right,
                  rgba(16,23,20,0.35) 0%,
                  transparent        25%,
                  transparent        75%,
                  rgba(16,23,20,0.35) 100%
                )
              `,
            }}
          />
        </div>

        {/* Hero content — anchored to bottom */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-16 pt-24 w-full text-center flex flex-col items-center">
          <p
            className="text-xs tracking-[0.38em] uppercase mb-4"
            style={{ color: 'rgba(139,174,102,0.9)', fontFamily: 'var(--font-cinzel), serif' }}
          >
            Tarot · Learning · Reflection
          </p>

          <h1
            className="text-6xl md:text-8xl font-bold mb-5 text-glow"
            style={{
              fontFamily: 'var(--font-cinzel), Georgia, serif',
              color: '#EBD5AB',
              lineHeight: 1.1,
              textShadow: '0 2px 40px rgba(235,213,171,0.5), 0 0 80px rgba(235,213,171,0.18)',
            }}
          >
            Arcana Garden
          </h1>

          <p
            className="text-xl md:text-2xl mb-12 max-w-md mx-auto leading-relaxed"
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              color: 'rgba(139,174,102,0.95)',
              fontStyle: 'italic',
              textShadow: '0 1px 12px rgba(0,0,0,0.8)',
            }}
          >
            Step into the grove where the cards remember what you forget.
          </p>

          {/* Nav cards */}
          <div className="flex flex-wrap justify-center gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-[1.05] hover:glow-sm"
                style={{
                  border: '1px solid rgba(98, 129, 65, 0.35)',
                  backgroundColor: 'rgba(16, 23, 20, 0.55)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  minWidth: '130px',
                }}
              >
                <div
                  className="text-xl mb-1 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: '#628141' }}
                >
                  {item.symbol}
                </div>
                <div
                  className="font-semibold text-sm tracking-wide"
                  style={{ color: '#EBD5AB', fontFamily: 'var(--font-cinzel), serif' }}
                >
                  {item.label}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#7DA55A' }}>
                  {item.desc}
                </div>
                <div className="absolute inset-0 rounded-2xl shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Daily Card ── */}
      <section className="relative z-10 max-w-2xl mx-auto px-4 py-20">
        <div className="ornament mb-8">
          <span
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: '#628141', fontFamily: 'var(--font-cinzel), serif' }}
          >
            Card of the Day
          </span>
        </div>

        <div className="text-center mb-10">
          <h2
            className="text-3xl font-semibold"
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              color: '#EBD5AB',
              fontStyle: 'italic',
            }}
          >
            Today&apos;s Guidance
          </h2>
        </div>

        <DailyCardDisplay card={dailyCard} />
      </section>
    </div>
  )
}
