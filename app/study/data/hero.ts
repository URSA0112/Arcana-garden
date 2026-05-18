export interface ReadingStep {
  icon: string
  number: string
  title: string
  text: string
}

export const READING_STEPS: ReadingStep[] = [
  {
    icon: '🕯️',
    number: '01',
    title: 'Prepare Your Space',
    text: 'Create a calm atmosphere with soft lighting or anything that helps you feel grounded. Your environment shapes your reading.',
  },
  {
    icon: '🃏',
    number: '02',
    title: 'Shuffle With Intention',
    text: 'Focus on your question or situation while shuffling. There is no perfect method — trust your instinct to stop.',
  },
  {
    icon: '🗺️',
    number: '03',
    title: 'Choose a Spread',
    text: 'A tarot spread is a layout where each card position holds a different meaning. The layout shapes the story.',
  },
  {
    icon: '🔮',
    number: '04',
    title: 'Interpret the Energy',
    text: 'Tarot reflects emotions, patterns, and possibilities — not fixed destiny. Let the cards open questions, not close them.',
  },
]

export const BEGINNER_TIPS: string[] = [
  "You don't need psychic abilities to read tarot.",
  'Trust your first feeling before memorizing meanings.',
  'Difficult cards usually signal transformation, not harm.',
  'Journaling your readings builds intuition over time.',
]

export const CLOSING_QUOTE =
  '"Tarot is less about predicting the future and more about understanding yourself."'

export interface TarotMyth {
  question: string
  truth: string
}

export const TAROT_MYTHS: TarotMyth[] = [
  {
    question: 'Do I need psychic powers?',
    truth: 'No. Tarot works through observation, intuition, and reflection — not supernatural ability. Anyone who can think can read cards.',
  },
  {
    question: 'Is the Death card bad?',
    truth: 'Rarely literal. Death almost always signals transformation or the end of a phase — making space for what comes next.',
  },
  {
    question: 'Can tarot predict the exact future?',
    truth: 'No card knows your future. Tarot reflects current energies and patterns. The future shifts with every choice you make.',
  },
  {
    question: 'Should someone gift me my first deck?',
    truth: 'A nice tradition, but a myth. Buy your own deck. Choosing one that resonates with you matters far more than how it arrived.',
  },
]
