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

export interface FeedbackEntry {
  id: string
  timestamp: string
  message: string
}

export interface Logs {
  visits: VisitEntry[]
  readings: ReadingEntry[]
  feedback: FeedbackEntry[]
}

const isProd = process.env.NODE_ENV === 'production'
const VISITS_KEY = 'ag:visits'
const READINGS_KEY = 'ag:readings'
const FEEDBACK_KEY = 'ag:feedback'

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

export async function logFeedback(message: string) {
  if (!isProd) return
  const r = await redis()
  const item: FeedbackEntry = { id: crypto.randomUUID(), timestamp: new Date().toISOString(), message }
  await r.lpush(FEEDBACK_KEY, item)
  await r.ltrim(FEEDBACK_KEY, 0, 499)
}

export async function getLogs(): Promise<Logs> {
  if (!isProd) return { visits: [], readings: [], feedback: [] }
  try {
    const r = await redis()
    const [visits, readings, feedback] = await Promise.all([
      r.lrange<VisitEntry>(VISITS_KEY, 0, 49),
      r.lrange<ReadingEntry>(READINGS_KEY, 0, 29),
      r.lrange<FeedbackEntry>(FEEDBACK_KEY, 0, 99),
    ])
    return { visits: visits ?? [], readings: readings ?? [], feedback: feedback ?? [] }
  } catch {
    return { visits: [], readings: [], feedback: [] }
  }
}
