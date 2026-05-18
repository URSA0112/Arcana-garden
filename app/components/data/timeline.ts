export interface TimelineEntry {
  era: string
  heading: string
  text: string
  image: string
}

export interface RayDecor {
  top: string
  left?: string
  right?: string
  w: string
  rotate: string
  opacity: number
}

export const TIMELINE: TimelineEntry[] = [
  {
    era: 'c. 1440',
    heading: 'Born in the Courts of Italy',
    text: 'In the candlelit halls of Milan and Ferrara, the first tarot decks appeared — not as prophecy, but as play. Commissioned by noble families as hand-painted luxuries, these Tarocchi decks were objects of status and beauty. The Visconti-Sforza deck, gilded with gold leaf, remains one of the oldest survivors.',
    image: 'https://res.cloudinary.com/dt43fy6cr/image/upload/v1778755981/BBEABC35-6429-43A1-AC4C-D6B51B7B1D0E_rf3i2f.jpg',
  },
  {
    era: '1780s',
    heading: 'The Occult Awakening',
    text: 'As the Enlightenment cast its rational light across Europe, shadows deepened. Antoine Court de Gébelin declared the cards held lost Egyptian wisdom — a romantic myth, yet one that ignited the occult imagination. Astrologers, Kabbalists, and Hermeticists wove their languages into the cards. Tarot became a mirror for the unseen.',
    image: 'https://res.cloudinary.com/dt43fy6cr/image/upload/v1778755981/BBEABC35-6429-43A1-AC4C-D6B51B7B1D0E_uad9hm.jpg',
  },
  {
    era: '1909',
    heading: 'The Rider-Waite Vision',
    text: 'Arthur Edward Waite and artist Pamela Colman Smith quietly changed everything. For the first time, all 78 cards told their own story in paint. The minor arcana came alive — peasants, cups, swords, fire — giving readers scenes to feel, not just symbols to decode. Their deck became the mother of nearly every modern tarot.',
    image: 'https://res.cloudinary.com/dt43fy6cr/image/upload/v1778755981/BBEABC35-6429-43A1-AC4C-D6B51B7B1D0E_vzqyxz.jpg',
  },
  {
    era: 'Today',
    heading: 'A Language That Endures',
    text: 'Across centuries and cultures, the 78 cards survive as something rare: a universal grammar of the human condition. Millions carry a deck not to predict the future, but to be honest about the present. Tarot asks what no one else will — and waits, patiently, for your answer.',
    image: 'https://res.cloudinary.com/dt43fy6cr/image/upload/v1778755981/BBEABC35-6429-43A1-AC4C-D6B51B7B1D0E_zwxowr.jpg',
  },
]

/** Diagonal light-ray decorations for the top corners of HistorySection */
export const DECORATION_RAYS: RayDecor[] = [
  { top: '4%',  left:  '-5%', w: '52%', rotate: '-18deg', opacity: 0.07 },
  { top: '14%', left:  '-5%', w: '40%', rotate: '-22deg', opacity: 0.04 },
  { top: '4%',  right: '-5%', w: '52%', rotate:  '18deg', opacity: 0.07 },
  { top: '14%', right: '-5%', w: '40%', rotate:  '22deg', opacity: 0.04 },
]
