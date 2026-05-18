'use client'

import { useState, useCallback } from 'react'
import type { TarotCard } from '@/lib/tarot-data'
import type { StudyMode, StudyPhase, StudyGameState, StudyGameActions } from '../study-types'
import {
  QUESTIONS_PER_LEVEL,
  QUESTIONS_PER_SESSION,
  REVERSED_PROBABILITY,
} from '../constants'
import { fisherYatesShuffle, buildAnswerOptions, getStreakMultiplier } from '../utils'

export type { StudyMode, StudyPhase, StudyGameState, StudyGameActions }

export function useStudyGame(allCards: TarotCard[]): StudyGameState & StudyGameActions {
  const [mode, setMode]                    = useState<StudyMode>('all')
  const [phase, setPhase]                  = useState<StudyPhase>('setup')
  const [level, setLevel]                  = useState(1)
  const [deck, setDeck]                    = useState<TarotCard[]>([])
  const [index, setIndex]                  = useState(0)
  const [side, setSide]                    = useState<'upright' | 'reversed'>('upright')
  const [options, setOptions]              = useState<string[]>([])
  const [correctIdx, setCorrectIdx]        = useState(0)
  const [chosen, setChosen]                = useState<number | null>(null)
  const [score, setScore]                  = useState(0)
  const [streak, setStreak]                = useState(0)
  const [bestStreak, setBestStreak]        = useState(0)
  const [correctCount, setCorrectCount]    = useState(0)
  const [cumPrevLevelsCorrect, setCumPrev] = useState(0)

  const prepareQuestion = useCallback((questionDeck: TarotCard[], questionIndex: number) => {
    const questionSide: 'upright' | 'reversed' =
      Math.random() < REVERSED_PROBABILITY ? 'reversed' : 'upright'
    const { options: opts, correctIdx: ci } = buildAnswerOptions(
      allCards,
      questionDeck[questionIndex],
      questionSide,
    )
    setSide(questionSide)
    setOptions(opts)
    setCorrectIdx(ci)
    setChosen(null)
  }, [allCards])

  const start = useCallback(() => {
    const pool = allCards.filter((c) => {
      if (mode === 'major') return c.arcana === 'major'
      if (mode === 'minor') return c.arcana === 'minor'
      return true
    })
    const sessionDeck = fisherYatesShuffle(pool).slice(0, QUESTIONS_PER_SESSION)
    setDeck(sessionDeck)
    setIndex(0)
    setLevel(1)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setCorrectCount(0)
    setCumPrev(0)
    prepareQuestion(sessionDeck, 0)
    setPhase('question')
  }, [allCards, mode, prepareQuestion])

  const answer = (chosenIdx: number) => {
    if (phase !== 'question') return
    setChosen(chosenIdx)
    const isCorrect = chosenIdx === correctIdx
    if (isCorrect) {
      const newStreak  = streak + 1
      const multiplier = getStreakMultiplier(newStreak)
      setScore((s) => s + 10 * multiplier)
      setStreak(newStreak)
      setBestStreak((b) => Math.max(b, newStreak))
      setCorrectCount((c) => c + 1)
    } else {
      setStreak(0)
    }
    setPhase('answered')
  }

  const next = () => {
    const nextIndex = index + 1
    if (nextIndex >= deck.length) { setPhase('done'); return }
    setIndex(nextIndex)
    if (nextIndex % QUESTIONS_PER_LEVEL === 0) {
      setPhase('level_complete')
    } else {
      prepareQuestion(deck, nextIndex)
      setPhase('question')
    }
  }

  const nextLevel = useCallback(() => {
    setCumPrev(correctCount)
    setLevel((l) => l + 1)
    prepareQuestion(deck, index)
    setPhase('question')
  }, [correctCount, deck, index, prepareQuestion])

  const goToSetup = () => setPhase('setup')

  return {
    mode, phase, level, deck, index, side, options, correctIdx, chosen,
    score, streak, bestStreak, correctCount, cumPrevLevelsCorrect,
    setMode, start, answer, next, nextLevel, goToSetup,
  }
}
