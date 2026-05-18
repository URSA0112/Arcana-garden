export type SpreadDifficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export interface SpreadDefinition {
  name: string
  subtitle: string
  cardCount: number
  difficulty: SpreadDifficulty
  description: string
  image: string
}

export const SPREAD_DEFINITIONS: SpreadDefinition[] = [
  {
    name: '1 · 2 · 3 Method',
    subtitle: 'The simplest reading',
    cardCount: 3,
    difficulty: 'Beginner',
    description:
      'Three cards, three clear positions. Past energy feeding the present, present circumstance, and the direction things are moving. The fastest way to get an honest read on any situation.',
    image: 'https://res.cloudinary.com/dt43fy6cr/image/upload/v1779090925/361a837f-87cc-46bd-a41e-2cc34bebbcfd_roecnz.png',
  },
  {
    name: 'Beginner Guidance',
    subtitle: '6-Card Guidance Spread',
    cardCount: 6,
    difficulty: 'Beginner',
    description:
      'Six positions that walk you through where you stand, what is helping and blocking you, what to let go, what to embrace, and where the situation is heading.',
    image: 'https://res.cloudinary.com/dt43fy6cr/image/upload/v1779090270/3db57d23-f134-44a6-872d-2108488fc237_obocft.png',
  },
  {
    name: "Hermit's Guidance",
    subtitle: 'Inner path spread',
    cardCount: 6,
    difficulty: 'Intermediate',
    description:
      'Designed for introspection and inner work. Six cards that illuminate your inner landscape — what you already know, what you are avoiding, and where solitude is pointing you.',
    image: 'https://res.cloudinary.com/dt43fy6cr/image/upload/v1779090275/247cd534-5af7-4b5c-9d8d-8fa20e33fe74_rstri5.png',
  },
  {
    name: 'Clarity Spread',
    subtitle: 'Full situation reading',
    cardCount: 8,
    difficulty: 'Advanced',
    description:
      'Eight cards for complex situations where you need to see the full picture — context, obstacles, hidden influences, external forces, and two possible outcomes depending on your next move.',
    image: 'https://res.cloudinary.com/dt43fy6cr/image/upload/v1779090855/4f4413c0-f6f3-4ef7-b67c-eec5642127c7_vfohw4.png',
  },
]

export const DIFFICULTY_STYLES: Record<SpreadDifficulty, { color: string; border: string; bg: string }> = {
  Beginner:     { color: '#8BAE66', border: 'rgba(98,129,65,0.35)',    bg: 'rgba(98,129,65,0.08)'    },
  Intermediate: { color: '#C6A85B', border: 'rgba(198,168,91,0.35)',   bg: 'rgba(198,168,91,0.08)'   },
  Advanced:     { color: '#B07070', border: 'rgba(176,112,112,0.35)',  bg: 'rgba(176,112,112,0.08)'  },
}
