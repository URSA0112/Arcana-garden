'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const TIMELINE = [
  {
    era: 'c. 1440',
    heading: 'Born in the Courts of Italy',
    text: 'In the candlelit halls of Milan and Ferrara, the first tarot decks appeared — not as prophecy, but as play. Commissioned by noble families as hand-painted luxuries, these Tarocchi decks were objects of status and beauty. The Visconti-Sforza deck, gilded with gold leaf, remains one of the oldest survivors.',
    image: 'https://res.cloudinary.com/dt43fy6cr/image/upload/v1778755981/BBEABC35-6429-43A1-AC4C-D6B51B7B1D0E_rf3i2f.jpg',
  },
  {
    era: '1780s',
    heading: 'The Occult Awakening',
    text: 'As the Enlightenment cast its rational light across Europe, shadows deepened. Antoine Court de Gébelin declared the cards held lost Egyptian wisdom — a romantic myth, yet one that ignited the occult imagination. Astrologers, Kabbalists, and Hermeticists wove their languages into the cards. Tarot became a mirror for the unseen.',
    image: 'https://res.cloudinary.com/dt43fy6cr/image/upload/v1778755981/BBEABC35-6429-43A1-AC4C-D6B51B7B1D0E_uad9hm.jpg',
  },
  {
    era: '1909',
    heading: 'The Rider-Waite Vision',
    text: 'Arthur Edward Waite and artist Pamela Colman Smith quietly changed everything. For the first time, all 78 cards told their own story in paint. The minor arcana came alive — peasants, cups, swords, fire — giving readers scenes to feel, not just symbols to decode. Their deck became the mother of nearly every modern tarot.',
    image: 'https://res.cloudinary.com/dt43fy6cr/image/upload/v1778755981/BBEABC35-6429-43A1-AC4C-D6B51B7B1D0E_vzqyxz.jpg',
  },
  {
    era: 'Today',
    heading: 'A Language That Endures',
    text: 'Across centuries and cultures, the 78 cards survive as something rare: a universal grammar of the human condition. Millions carry a deck not to predict the future, but to be honest about the present. Tarot asks what no one else will — and waits, patiently, for your answer.',
    image: 'https://res.cloudinary.com/dt43fy6cr/image/upload/v1778755981/BBEABC35-6429-43A1-AC4C-D6B51B7B1D0E_zwxowr.jpg',
  },
]

// Decorative line positions for the top-corner light-ray effect
const RAYS = [
  { top: '4%',  left: '-5%',  w: '52%', rotate: '-18deg', opacity: 0.07 },
  { top: '14%', left: '-5%',  w: '40%', rotate: '-22deg', opacity: 0.04 },
  { top: '4%',  right: '-5%', w: '52%', rotate: '18deg',  opacity: 0.07 },
  { top: '14%', right: '-5%', w: '40%', rotate: '22deg',  opacity: 0.04 },
]

export default function HistorySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef    = useRef<HTMLDivElement>(null)
  const imgRefs    = useRef<(HTMLDivElement | null)[]>([])
  const txtRefs    = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (headRef.current) {
        gsap.from(Array.from(headRef.current.children), {
          y: 28, opacity: 0, duration: 0.82, stagger: 0.14, ease: 'power3.out',
          scrollTrigger: { trigger: headRef.current, start: 'top 82%' },
        })
      }

      TIMELINE.forEach((_, i) => {
        const imgEl    = imgRefs.current[i]
        const txtEl    = txtRefs.current[i]
        const imgOnLeft = i % 2 === 0

        if (imgEl) {
          gsap.from(imgEl, {
            x: imgOnLeft ? -60 : 60, opacity: 0, duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: imgEl, start: 'top 85%' },
          })
        }
        if (txtEl) {
          gsap.from(txtEl, {
            x: imgOnLeft ? 42 : -42, opacity: 0, duration: 0.95, ease: 'power3.out', delay: 0.13,
            scrollTrigger: { trigger: txtEl, start: 'top 85%' },
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: '#0A0A0A' }}
    >
      {/* ── Seamless top fade from hero ── */}
      <div
        className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{ height: 200, background: 'linear-gradient(to bottom, #0A0A0A 0%, transparent 100%)' }}
      />

      {/* ── Bottom fade ── */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{ height: 160, background: 'linear-gradient(to top, #0A0A0A 0%, transparent 100%)' }}
      />

      {/* ── Decor: ambient gold glow — top center ── */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none z-0"
        style={{
          height: '55%',
          background: 'radial-gradient(ellipse 55% 45% at 50% 0%, rgba(198,168,91,0.06) 0%, transparent 100%)',
        }}
      />

      {/* ── Decor: secondary glow — bottom ── */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none z-0"
        style={{
          height: '35%',
          background: 'radial-gradient(ellipse 40% 40% at 50% 100%, rgba(198,168,91,0.04) 0%, transparent 100%)',
        }}
      />

      {/* ── Decor: dot-grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(198,168,91,0.055) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />

      {/* ── Decor: diagonal light rays (top corners) ── */}
      {RAYS.map((r, i) => (
        <div
          key={i}
          className="absolute pointer-events-none z-0 h-px"
          style={{
            top: r.top,
            left: 'left' in r ? r.left : undefined,
            right: 'right' in r ? r.right : undefined,
            width: r.w,
            background: 'linear-gradient(to right, transparent, rgba(198,168,91,1), transparent)',
            opacity: r.opacity,
            transform: `rotate(${r.rotate})`,
            transformOrigin: 'left' in r ? 'left center' : 'right center',
          }}
        />
      ))}

      {/* ── Decor: perspective grid — bottom ── */}
      <div
        className="absolute inset-x-0 bottom-0 z-0 pointer-events-none overflow-hidden"
        style={{ height: '28%' }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: '-10%', right: '-10%',
            height: '200%',
            backgroundImage:
              'linear-gradient(rgba(198,168,91,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(198,168,91,0.045) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            transform: 'perspective(550px) rotateX(58deg)',
            transformOrigin: 'bottom center',
          }}
        />
        {/* Fade the grid out toward the top */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, #0A0A0A 0%, transparent 50%)' }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-20 max-w-5xl mx-auto px-5 sm:px-8 pt-40 pb-36">

        {/* Header */}
        <div ref={headRef} className="text-center mb-24">
          <p
            className="text-[10px] tracking-[0.44em] uppercase mb-5"
            style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
          >
            A History of the Cards
          </p>
          <h2
            className="text-4xl sm:text-5xl font-light leading-tight"
            style={{
              fontFamily: 'var(--font-cinzel), Georgia, serif',
              color: '#F2F2F2',
              textShadow: '0 2px 32px rgba(198,168,91,0.12)',
            }}
          >
            Six Centuries of Tarot
          </h2>
          <p
            className="mt-5 text-lg sm:text-xl leading-relaxed max-w-sm mx-auto"
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              color: '#B3B3B3',
              fontStyle: 'italic',
            }}
          >
            From courtly game to sacred compass — the long, strange journey of 78 cards.
          </p>
          <div
            className="mt-10 mx-auto w-px"
            style={{ height: 60, background: 'linear-gradient(to bottom, rgba(198,168,91,0.45), transparent)' }}
          />
        </div>

        {/* Timeline entries */}
        <div className="flex flex-col">
          {TIMELINE.map((item, i) => {
            const imgOnLeft = i % 2 === 0
            return (
              <div key={i}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-14 items-center">

                  {/* Image */}
                  <div
                    ref={el => { imgRefs.current[i] = el }}
                    className={imgOnLeft ? 'md:order-1' : 'md:order-2'}
                    style={{
                      WebkitMaskImage:
                        'radial-gradient(ellipse 94% 94% at 50% 50%, black 28%, rgba(0,0,0,0.55) 62%, transparent 88%)',
                      maskImage:
                        'radial-gradient(ellipse 94% 94% at 50% 50%, black 28%, rgba(0,0,0,0.55) 62%, transparent 88%)',
                    }}
                  >
                    <div className="aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-2xl group cursor-pointer">
                      <img
                        src={item.image}
                        alt={item.heading}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ opacity: 0.75 }}
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <div
                    ref={el => { txtRefs.current[i] = el }}
                    className={`flex flex-col gap-3 ${imgOnLeft ? 'md:order-2' : 'md:order-1'}`}
                  >
                    <p
                      className="text-[10px] tracking-[0.38em] uppercase"
                      style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
                    >
                      {item.era}
                    </p>
                    <h3
                      className="text-2xl sm:text-3xl font-light leading-snug"
                      style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#F2F2F2' }}
                    >
                      {item.heading}
                    </h3>
                    <div className="w-10 h-px" style={{ background: 'rgba(198,168,91,0.4)' }} />
                    <p
                      className="leading-relaxed"
                      style={{
                        fontFamily: 'var(--font-cormorant), Georgia, serif',
                        fontSize: '1.1rem',
                        lineHeight: '1.78',
                        color: 'rgba(242,242,242,0.7)',
                        fontStyle: 'italic',
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                {i < TIMELINE.length - 1 && (
                  <div className="flex items-center gap-4 my-20 sm:my-28">
                    <div className="flex-1 h-px" style={{ background: 'rgba(198,168,91,0.1)' }} />
                    <span className="text-[9px]" style={{ color: 'rgba(198,168,91,0.32)' }}>◆</span>
                    <div className="flex-1 h-px" style={{ background: 'rgba(198,168,91,0.1)' }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
