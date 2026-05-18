export const MOON_PHASES = [
  { name: 'New Moon',        symbol: '🌑', range: [0,      0.0625] },
  { name: 'Waxing Crescent', symbol: '🌒', range: [0.0625, 0.1875] },
  { name: 'First Quarter',   symbol: '🌓', range: [0.1875, 0.3125] },
  { name: 'Waxing Gibbous',  symbol: '🌔', range: [0.3125, 0.4375] },
  { name: 'Full Moon',       symbol: '🌕', range: [0.4375, 0.5625] },
  { name: 'Waning Gibbous',  symbol: '🌖', range: [0.5625, 0.6875] },
  { name: 'Last Quarter',    symbol: '🌗', range: [0.6875, 0.8125] },
  { name: 'Waning Crescent', symbol: '🌘', range: [0.8125, 0.9375] },
  { name: 'New Moon',        symbol: '🌑', range: [0.9375, 1]      },
] as const

export const ZODIAC = [
  { name: 'Capricorn',   symbol: '♑', element: 'Earth', start: [12, 22], end: [1,  19] },
  { name: 'Aquarius',    symbol: '♒', element: 'Air',   start: [1,  20], end: [2,  18] },
  { name: 'Pisces',      symbol: '♓', element: 'Water', start: [2,  19], end: [3,  20] },
  { name: 'Aries',       symbol: '♈', element: 'Fire',  start: [3,  21], end: [4,  19] },
  { name: 'Taurus',      symbol: '♉', element: 'Earth', start: [4,  20], end: [5,  20] },
  { name: 'Gemini',      symbol: '♊', element: 'Air',   start: [5,  21], end: [6,  20] },
  { name: 'Cancer',      symbol: '♋', element: 'Water', start: [6,  21], end: [7,  22] },
  { name: 'Leo',         symbol: '♌', element: 'Fire',  start: [7,  23], end: [8,  22] },
  { name: 'Virgo',       symbol: '♍', element: 'Earth', start: [8,  23], end: [9,  22] },
  { name: 'Libra',       symbol: '♎', element: 'Air',   start: [9,  23], end: [10, 22] },
  { name: 'Scorpio',     symbol: '♏', element: 'Water', start: [10, 23], end: [11, 21] },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire',  start: [11, 22], end: [12, 21] },
] as const

export const ELEMENT_COLOR: Record<string, string> = {
  Fire: '#E8876A', Earth: '#A8B87A', Air: '#9ABDE8', Water: '#7ABBE8',
}

// Reference: known new moon Jan 6 2000 18:14 UTC; synodic period 29.530588853 days
export function getMoonPhase(date: Date) {
  const known = new Date(Date.UTC(2000, 0, 6, 18, 14))
  const CYCLE = 29.530588853
  const ageDays = (date.getTime() - known.getTime()) / 86_400_000
  const phase = ((ageDays % CYCLE) + CYCLE) % CYCLE / CYCLE
  return MOON_PHASES.find((p) => phase >= p.range[0] && phase < p.range[1])!
}

export function getZodiacSign(date: Date) {
  const m = date.getMonth() + 1
  const d = date.getDate()
  for (const z of ZODIAC) {
    const [sm, sd] = z.start
    const [em, ed] = z.end
    if (sm > em) {
      if ((m === sm && d >= sd) || (m === em && d <= ed)) return z
    } else {
      if ((m === sm && d >= sd) || (m === em && d <= ed)) return z
      if (m > sm && m < em) return z
    }
  }
  return ZODIAC[0]
}
