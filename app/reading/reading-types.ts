import { TarotCard } from '@/lib/tarot-data'

export type Spread = '1' | '3'
export type Phase = 'intro' | 'selecting' | 'context' | 'reading'

export interface SelectedCard {
  card: TarotCard
  reversed: boolean
  label: string
  deckIndex: number
}

export type SlotArray = (SelectedCard | null)[]

export interface ParsedReading {
  cards: Record<string, string>
  advice: string
  synthesis: string
}

export const SPREAD_LABELS: Record<Spread, string[]> = {
  '1': ['Your Message'],
  '3': ['Past', 'Present', 'Future'],
}

export const ZODIAC_SIGNS = [
  '', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

export const CARD_W  = 68
export const CARD_H  = Math.round(CARD_W * 1.75)
export const SCALE   = CARD_W / 120

export const BG_URL = 'https://res.cloudinary.com/dt43fy6cr/image/upload/v1779094555/4529ddad-c37d-4e17-aa8a-0dc93b0012d3_qqhqrc.png'

export const BTN: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(198,168,91,0.85) 0%, #C6A85B 50%, rgba(198,168,91,0.85) 100%)',
  color: '#0A0A0A',
  fontFamily: 'var(--font-cinzel), serif',
  fontSize: '0.75rem',
  letterSpacing: '0.12em',
}
