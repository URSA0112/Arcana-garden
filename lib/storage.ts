import type { JournalEntry } from '@/types/journal'

export const JOURNAL_KEY = 'arcana-journal'

export function loadJournalEntries(): JournalEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(JOURNAL_KEY)
    return raw ? (JSON.parse(raw) as JournalEntry[]) : []
  } catch {
    return []
  }
}

export function saveJournalEntries(entries: JournalEntry[]): void {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries))
}

export function prependJournalEntry(entry: JournalEntry): void {
  const existing = loadJournalEntries()
  saveJournalEntries([entry, ...existing])
}
