'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const links = [
  { href: '/', label: 'Home' },
  { href: '/library', label: 'Library' },
  { href: '/reading', label: 'Reading' },
  { href: '/study', label: 'Study' },
  { href: '/journal', label: 'Journal' },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 glass-dark border-b border-[rgba(98,129,65,0.18)]">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-[#628141] text-lg select-none">✦</span>
          <span
            className="text-base font-semibold tracking-[0.08em]"
            style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#EBD5AB' }}
          >
            Arcana Garden
          </span>
        </Link>

        <div className="flex items-center gap-0.5">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3.5 py-1.5 text-sm rounded-lg transition-colors duration-200"
                style={{ color: active ? '#EBD5AB' : '#7DA55A' }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor: 'rgba(98, 129, 65, 0.18)', border: '1px solid rgba(98, 129, 65, 0.3)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10 tracking-wide">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
