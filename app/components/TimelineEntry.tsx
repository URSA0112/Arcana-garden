import type { TimelineEntry as TimelineEntryData } from './data/timeline'

interface TimelineEntryProps {
  entry:      TimelineEntryData
  index:      number
  imgRef:     (el: HTMLDivElement | null) => void
  txtRef:     (el: HTMLDivElement | null) => void
  isLast:     boolean
}

export function TimelineEntry({ entry, index, imgRef, txtRef, isLast }: TimelineEntryProps) {
  const imgOnLeft = index % 2 === 0

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-14 items-center">

        {/* Image */}
        <div
          ref={imgRef}
          className={imgOnLeft ? 'md:order-1' : 'md:order-2'}
          style={{
            WebkitMaskImage: 'radial-gradient(ellipse 94% 94% at 50% 50%, black 28%, rgba(0,0,0,0.55) 62%, transparent 88%)',
            maskImage:        'radial-gradient(ellipse 94% 94% at 50% 50%, black 28%, rgba(0,0,0,0.55) 62%, transparent 88%)',
          }}
        >
          <div className="aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-2xl group cursor-pointer">
            <img
              src={entry.image}
              alt={entry.heading}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ opacity: 0.75 }}
              loading="lazy"
            />
          </div>
        </div>

        {/* Text */}
        <div
          ref={txtRef}
          className={`flex flex-col gap-3 ${imgOnLeft ? 'md:order-2' : 'md:order-1'}`}
        >
          <p
            className="text-[12px] tracking-[0.38em] uppercase"
            style={{ color: '#C6A85B', fontFamily: 'var(--font-cinzel), serif' }}
          >
            {entry.era}
          </p>
          <h3
            className="text-2xl sm:text-3xl font-light leading-snug"
            style={{ fontFamily: 'var(--font-cinzel), Georgia, serif', color: '#F2F2F2' }}
          >
            {entry.heading}
          </h3>
          <div className="w-10 h-px" style={{ background: 'rgba(198,168,91,0.4)' }} />
          <p
            className="leading-relaxed"
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: '1.1rem',
              lineHeight: '1.78',
              color: 'rgba(242,242,242,0.7)',
              fontStyle: 'italic',
            }}
          >
            {entry.text}
          </p>
        </div>

      </div>

      {/* Divider between entries */}
      {!isLast && (
        <div className="flex items-center gap-4 my-20 sm:my-28">
          <div className="flex-1 h-px" style={{ background: 'rgba(198,168,91,0.1)' }} />
          <span className="text-[9px]" style={{ color: 'rgba(198,168,91,0.32)' }}>◆</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(198,168,91,0.1)' }} />
        </div>
      )}
    </div>
  )
}
