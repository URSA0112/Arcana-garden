import type { StudyMode } from './study-types'

export const QUESTIONS_PER_LEVEL   = 5
export const TOTAL_LEVELS          = 3
export const QUESTIONS_PER_SESSION = QUESTIONS_PER_LEVEL * TOTAL_LEVELS
export const REVERSED_PROBABILITY  = 0.28

export const LEVEL_INFO = [
  { name: 'Awakening',  subtitle: 'First steps on the path'         },
  { name: 'Initiation', subtitle: 'Deeper mysteries revealed'        },
  { name: 'Mastery',    subtitle: 'The arcana speaks through you'    },
] as const

export const MODE_META = {
  major: { icon: '🌙', label: 'Major Arcana', count: '22 cards' },
  all:   { icon: '🃏', label: 'Full Deck',    count: '78 cards' },
  minor: { icon: '⚔️', label: 'Minor Arcana', count: '56 cards' },
} satisfies Record<StudyMode, { icon: string; label: string; count: string }>

export const STREAK_MULTIPLIERS = [
  { threshold: 5, multiplier: 3 },
  { threshold: 3, multiplier: 2 },
  { threshold: 0, multiplier: 1 },
] as const
