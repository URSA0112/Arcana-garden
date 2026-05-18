import type { TarotCard } from '@/lib/tarot-data'
import { STREAK_MULTIPLIERS } from './constants'

export function fisherYatesShuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function buildAnswerOptions(
  allCards: TarotCard[],
  currentCard: TarotCard,
  side: 'upright' | 'reversed',
): { options: string[]; correctIdx: number } {
  const correctMeaning = side === 'upright' ? currentCard.upright : currentCard.reversed
  const wrongMeanings  = fisherYatesShuffle(allCards.filter((c) => c.id !== currentCard.id))
    .slice(0, 3)
    .map((c) => (side === 'upright' ? c.upright : c.reversed))
  const shuffled = fisherYatesShuffle([correctMeaning, ...wrongMeanings])
  return { options: shuffled, correctIdx: shuffled.indexOf(correctMeaning) }
}

export function getStreakMultiplier(streak: number): number {
  return STREAK_MULTIPLIERS.find((m) => streak >= m.threshold)?.multiplier ?? 1
}
