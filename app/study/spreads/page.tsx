import Link from 'next/link'
import { SpreadShowcase } from '../components/SpreadShowcase'

export default function SpreadsPage() {
  return (
    <>
      <div className="max-w-6xl mx-auto px-5 pt-8" style={{ backgroundColor: '#0A0A0A' }}>
        <Link
          href="/study"
          className="text-[12px] tracking-[0.15em] uppercase transition-colors hover:text-[#C6A85B]"
          style={{ color: '#7A7A7A', fontFamily: 'var(--font-cinzel), serif' }}
        >
          ← Study
        </Link>
      </div>
      <SpreadShowcase />
    </>
  )
}
