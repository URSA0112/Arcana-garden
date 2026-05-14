'use client'

const r = (n: number) => Math.round(n * 1000) / 1000

export default function CardBack({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'sm' ? 120 : size === 'lg' ? 280 : 180
  const h = Math.round(dim * 1.75)
  const cx = dim / 2
  const cy = h / 2
  const scale = dim / 120

  return (
    <svg
      width={dim}
      height={h}
      viewBox={`0 0 ${dim} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <defs>
        <radialGradient id={`back-grad-${size}`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#16130A" />
          <stop offset="70%" stopColor="#100E07" />
          <stop offset="100%" stopColor="#0A0904" />
        </radialGradient>

        <radialGradient id={`center-glow-${size}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C6A85B" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#C6A85B" stopOpacity="0" />
        </radialGradient>

        <pattern id={`back-pattern-${size}`} x="0" y="0" width={14 * scale} height={14 * scale} patternUnits="userSpaceOnUse">
          <path
            d={`M${r(7*scale)} 0L${r(14*scale)} ${r(7*scale)}L${r(7*scale)} ${r(14*scale)}L0 ${r(7*scale)}Z`}
            fill="none"
            stroke="#C6A85B"
            strokeWidth={r(0.3 * scale)}
            strokeOpacity="0.18"
          />
        </pattern>
      </defs>

      {/* Background */}
      <rect width={dim} height={h} rx={8 * scale} fill={`url(#back-grad-${size})`} />
      <rect width={dim} height={h} rx={8 * scale} fill={`url(#back-pattern-${size})`} />

      {/* Outer border */}
      <rect
        x={4 * scale} y={4 * scale}
        width={dim - 8 * scale} height={h - 8 * scale}
        rx={6 * scale}
        fill="none"
        stroke="#C6A85B"
        strokeWidth={0.8 * scale}
        strokeOpacity="0.45"
      />
      {/* Inner border */}
      <rect
        x={8 * scale} y={8 * scale}
        width={dim - 16 * scale} height={h - 16 * scale}
        rx={4 * scale}
        fill="none"
        stroke="#D4B86A"
        strokeWidth={0.4 * scale}
        strokeOpacity="0.22"
      />

      {/* Center glow */}
      <circle cx={cx} cy={cy} r={40 * scale} fill={`url(#center-glow-${size})`} />

      {/* Radiating lines (12-point) */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 * Math.PI) / 180
        const r1 = 10 * scale
        const r2 = 32 * scale
        return (
          <line
            key={i}
            x1={r(cx + r1 * Math.cos(angle))}
            y1={r(cy + r1 * Math.sin(angle))}
            x2={r(cx + r2 * Math.cos(angle))}
            y2={r(cy + r2 * Math.sin(angle))}
            stroke="#C6A85B"
            strokeWidth={r(0.6 * scale)}
            strokeOpacity={i % 2 === 0 ? 0.55 : 0.25}
          />
        )
      })}

      {/* Outer ring */}
      <circle
        cx={cx} cy={cy} r={34 * scale}
        fill="none"
        stroke="#C6A85B"
        strokeWidth={0.5 * scale}
        strokeOpacity="0.35"
        strokeDasharray={`${2 * scale} ${3 * scale}`}
      />

      {/* Mid ring */}
      <circle
        cx={cx} cy={cy} r={20 * scale}
        fill="none"
        stroke="#D4B86A"
        strokeWidth={0.4 * scale}
        strokeOpacity="0.28"
      />

      {/* Inner circle */}
      <circle
        cx={cx} cy={cy} r={8 * scale}
        fill="none"
        stroke="#D4B86A"
        strokeWidth={0.8 * scale}
        strokeOpacity="0.5"
      />

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={2.5 * scale} fill="#F2E8D0" fillOpacity="0.55" />

      {/* Corner flourishes */}
      {[
        [14 * scale, 14 * scale, 0],
        [dim - 14 * scale, 14 * scale, 90],
        [dim - 14 * scale, h - 14 * scale, 180],
        [14 * scale, h - 14 * scale, 270],
      ].map(([fx, fy, rot], idx) => (
        <g key={idx} transform={`translate(${fx}, ${fy}) rotate(${rot})`}>
          <line x1={0} y1={0} x2={6 * scale} y2={0} stroke="#C6A85B" strokeWidth={0.6 * scale} strokeOpacity="0.5" />
          <line x1={0} y1={0} x2={0} y2={6 * scale} stroke="#C6A85B" strokeWidth={0.6 * scale} strokeOpacity="0.5" />
          <circle cx={0} cy={0} r={1.2 * scale} fill="#D4B86A" fillOpacity="0.5" />
        </g>
      ))}

      {/* Bottom text */}
      <text
        x={cx}
        y={h - 7 * scale}
        fontFamily="Georgia, serif"
        fontSize={5.5 * scale}
        textAnchor="middle"
        fill="#F2E8D0"
        fillOpacity="0.3"
        letterSpacing={1.5 * scale}
      >
        ✦ ARCANA GARDEN ✦
      </text>
    </svg>
  )
}
