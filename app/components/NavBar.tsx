'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS as links } from '@/app/constants/navigation'

export default function NavBar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 glass-dark border-b border-[#222222]">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          onClick={() => setMenuOpen(false)}
        >
          <span className="text-[#C6A85B] text-lg select-none">✦</span>
          <span
            className="text-base tracking-[0.1em]"
            style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#F2F2F2', fontWeight: 300 }}
          >
            Arcana Garden
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3.5 py-1.5 rounded-lg transition-colors duration-200"
                style={{
                  color: active ? '#F2F2F2' : '#7A7A7A',
                  fontFamily: 'var(--font-cinzel), Georgia, serif',
                  fontSize: '0.95rem',
                  fontWeight: 300,
                  letterSpacing: '0.04em',
                }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor: 'rgba(198,168,91,0.1)', border: '1px solid rgba(198,168,91,0.22)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Hamburger — mobile only */}
        <button
          type="button"
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px]"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span className="block h-[1.5px] rounded-full transition-all duration-300 origin-center"
            style={{ width: menuOpen ? '20px' : '22px', backgroundColor: '#B3B3B3', transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
          <span className="block h-[1.5px] w-[22px] rounded-full transition-all duration-300"
            style={{ backgroundColor: '#B3B3B3', opacity: menuOpen ? 0 : 1 }} />
          <span className="block h-[1.5px] rounded-full transition-all duration-300 origin-center"
            style={{ width: menuOpen ? '20px' : '22px', backgroundColor: '#B3B3B3', transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-[#222222]"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {links.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm transition-colors duration-200"
                    style={{
                      color: active ? '#F2F2F2' : '#7A7A7A',
                      backgroundColor: active ? 'rgba(198,168,91,0.1)' : 'transparent',
                      border: active ? '1px solid rgba(198,168,91,0.2)' : '1px solid transparent',
                      fontFamily: active ? 'var(--font-cinzel), serif' : 'inherit',
                      fontSize: active ? '0.72rem' : '0.875rem',
                      letterSpacing: active ? '0.06em' : '0',
                    }}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
