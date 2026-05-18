export const TRACKS = [
  {
    id:   'drone',
    name: 'Drone Zone',
    desc: 'Deep atmospheric textures',
    icon: '🌌',
    url:  'https://ice2.somafm.com/dronezone-128-mp3',
  },
  {
    id:   'space',
    name: 'Deep Space',
    desc: 'Electronic & space ambient',
    icon: '✦',
    url:  'https://ice2.somafm.com/deepspaceone-128-mp3',
  },
  {
    id:   'groove',
    name: 'Groove Salad',
    desc: 'Chilled downtempo beats',
    icon: '🌿',
    url:  'https://ice2.somafm.com/groovesalad-128-mp3',
  },
] as const

export type TrackId = (typeof TRACKS)[number]['id']

export const BAR_HEIGHTS = [0.5, 0.85, 1, 0.7, 0.9, 0.55, 0.8] as const
