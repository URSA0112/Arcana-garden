export interface VisitEntry {
  id: string
  timestamp: string
  page: string
  ip: string
  userAgent: string
  referrer: string
}

export interface ReadingEntry {
  id: string
  timestamp: string
  spread: string
  question: string
  emotionalContext: string
  zodiacSign: string
  cards: string[]
  ip: string
}

export interface Logs {
  visits: VisitEntry[]
  readings: ReadingEntry[]
}

const isProd = process.env.NODE_ENV === 'production'
const VISITS_KEY = 'ag:visits'
const READINGS_KEY = 'ag:readings'

async function redis() {
  const { Redis } = await import('@upstash/redis')
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  })
}

export async function logVisit(entry: Omit<VisitEntry, 'id'>) {
  if (!isProd) return
  const r = await redis()
  const item: VisitEntry = { id: crypto.randomUUID(), ...entry }
  await r.lpush(VISITS_KEY, item)
  await r.ltrim(VISITS_KEY, 0, 999)
}

export async function logReading(entry: Omit<ReadingEntry, 'id'>) {
  if (!isProd) return
  const r = await redis()
  const item: ReadingEntry = { id: crypto.randomUUID(), ...entry }
  await r.lpush(READINGS_KEY, item)
  await r.ltrim(READINGS_KEY, 0, 999)
}

export async function getLogs(): Promise<Logs> {
  if (!isProd) return { visits: [], readings: [] }
  try {
    const r = await redis()
    const [visits, readings] = await Promise.all([
      r.lrange<VisitEntry>(VISITS_KEY, 0, 49),
      r.lrange<ReadingEntry>(READINGS_KEY, 0, 29),
    ])
    return { visits: visits ?? [], readings: readings ?? [] }
  } catch {
    return { visits: [], readings: [] }
  }
}
