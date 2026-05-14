import Image from 'next/image'
import { TarotCard, getCardImagePath } from '@/lib/tarot-data'

const sizes = {
  sm: { w: 120, h: 210 },
  md: { w: 180, h: 315 },
  lg: { w: 280, h: 490 },
}

export default function CardArt({
  card,
  size = 'md',
  priority = false,
}: {
  card: TarotCard
  size?: 'sm' | 'md' | 'lg'
  priority?: boolean
}) {
  const { w, h } = sizes[size]
  const src = getCardImagePath(card)

  return (
    <div
      className="rounded-xl overflow-hidden shrink-0 block relative bg-bg"
      style={{
        width: w,
        height: h,
        border: '1px solid rgba(198, 168, 91, 0.2)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      <Image
        src={src}
        alt={card.name}
        width={w}
        height={h}
        sizes={`${w}px`}
        priority={priority}
        className="object-contain w-full h-full"
      />
    </div>
  )
}
