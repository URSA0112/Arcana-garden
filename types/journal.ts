export interface DrawnCard {
  id: string
  name: string
  reversed: boolean
  label?: string
}

export interface JournalEntry {
  id: number
  date: string
  spread: string
  question?: string
  emotionalContext?: string
  zodiacSign?: string
  cards: DrawnCard[]
  /** Synthesis paragraph saved from the AI reading */
  summary?: string
  sections?: {
    cards: Record<string, string>
    advice: string
    synthesis: string
  }
  note: string
}
