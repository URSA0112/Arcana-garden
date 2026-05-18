import type { TarotCard } from '@/lib/tarot-data'

export type StudyMode  = 'all' | 'major' | 'minor'
export type StudyPhase = 'setup' | 'question' | 'answered' | 'level_complete' | 'done'

export interface StudyGameState {
  mode:                 StudyMode
  phase:                StudyPhase
  level:                number
  deck:                 TarotCard[]
  index:                number
  side:                 'upright' | 'reversed'
  options:              string[]
  correctIdx:           number
  chosen:               number | null
  score:                number
  streak:               number
  bestStreak:           number
  correctCount:         number
  cumPrevLevelsCorrect: number
}

export interface StudyGameActions {
  setMode:   (mode: StudyMode) => void
  start:     () => void
  answer:    (chosenIdx: number) => void
  next:      () => void
  nextLevel: () => void
  goToSetup: () => void
}
