'use client'

import { VisitEntry, ReadingEntry, FeedbackEntry } from '@/lib/logger'

function parseBrowser(ua: string): string {
  if (ua.includes('Edg')) return 'Edge'
  if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Safari')) return 'Safari'
  if (ua === 'unknown') return '—'
  return 'Other'
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function spreadLabel(s: string) {
  return s === '3' ? 'Past / Present / Future' : 'Single Card'
}

const thCell: React.CSSProperties = {
  padding: '0.6rem 1rem',
  textAlign: 'left',
  fontSize: '0.62rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: '#7A7A7A',
  fontFamily: 'var(--font-cinzel), Georgia, serif',
  borderBottom: '1px solid rgba(198,168,91,0.12)',
  whiteSpace: 'nowrap',
}

const tdCell: React.CSSProperties = {
  padding: '0.65rem 1rem',
  fontSize: '0.82rem',
  color: '#B3B3B3',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  verticalAlign: 'top',
}

const tdMono: React.CSSProperties = {
  ...tdCell,
  fontFamily: 'monospace',
  fontSize: '0.75rem',
  color: '#7A7A7A',
}

function hoverOn(e: React.MouseEvent<HTMLTableRowElement>) {
  e.currentTarget.style.background = 'rgba(198,168,91,0.04)'
}
function hoverOff(e: React.MouseEvent<HTMLTableRowElement>) {
  e.currentTarget.style.background = 'transparent'
}

export function VisitsTable({ visits }: { visits: VisitEntry[] }) {
  if (visits.length === 0)
    return <p style={{ color: '#7A7A7A', fontSize: '0.85rem' }}>No visits recorded yet.</p>

  return (
    <div
      style={{
        background: 'rgba(20,20,20,0.55)',
        border: '1px solid rgba(198,168,91,0.12)',
        borderRadius: 10,
        overflow: 'auto',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thCell}>Time</th>
            <th style={thCell}>Page</th>
            <th style={thCell}>Browser</th>
            <th style={thCell}>IP</th>
            <th style={thCell}>Referrer</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((v) => (
            <tr
              key={v.id}
              style={{ transition: 'background 0.15s' }}
              onMouseOver={hoverOn}
              onMouseOut={hoverOff}
            >
              <td style={tdMono}>{fmtTime(v.timestamp)}</td>
              <td style={{ ...tdCell, color: '#C6A85B' }}>{v.page}</td>
              <td style={tdCell}>{parseBrowser(v.userAgent)}</td>
              <td style={tdMono}>{v.ip}</td>
              <td
                style={{
                  ...tdCell,
                  maxWidth: 200,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: '#7A7A7A',
                  fontSize: '0.75rem',
                }}
              >
                {v.referrer || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function FeedbackTable({ feedback }: { feedback: FeedbackEntry[] }) {
  if (feedback.length === 0)
    return <p style={{ color: '#7A7A7A', fontSize: '0.85rem' }}>No feedback submitted yet.</p>

  return (
    <div
      style={{
        background: 'rgba(20,20,20,0.55)',
        border: '1px solid rgba(198,168,91,0.12)',
        borderRadius: 10,
        overflow: 'auto',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thCell}>Time</th>
            <th style={thCell}>Message</th>
          </tr>
        </thead>
        <tbody>
          {feedback.map((f) => (
            <tr
              key={f.id}
              style={{ transition: 'background 0.15s' }}
              onMouseOver={hoverOn}
              onMouseOut={hoverOff}
            >
              <td style={{ ...tdMono, whiteSpace: 'nowrap' }}>{fmtTime(f.timestamp)}</td>
              <td style={{ ...tdCell, color: '#F2F2F2', fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '0.9rem' }}>
                {f.message}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ReadingsTable({ readings }: { readings: ReadingEntry[] }) {
  if (readings.length === 0)
    return <p style={{ color: '#7A7A7A', fontSize: '0.85rem' }}>No readings recorded yet.</p>

  return (
    <div
      style={{
        background: 'rgba(20,20,20,0.55)',
        border: '1px solid rgba(198,168,91,0.12)',
        borderRadius: 10,
        overflow: 'auto',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thCell}>Time</th>
            <th style={thCell}>Spread</th>
            <th style={thCell}>Question / Situation</th>
            <th style={thCell}>Feeling</th>
            <th style={thCell}>Sign</th>
            <th style={thCell}>Cards Drawn</th>
          </tr>
        </thead>
        <tbody>
          {readings.map((r) => (
            <tr
              key={r.id}
              style={{ transition: 'background 0.15s' }}
              onMouseOver={hoverOn}
              onMouseOut={hoverOff}
            >
              <td style={tdMono}>{fmtTime(r.timestamp)}</td>
              <td style={{ ...tdCell, whiteSpace: 'nowrap' }}>{spreadLabel(r.spread)}</td>
              <td
                style={{
                  ...tdCell,
                  maxWidth: 220,
                  color: r.question ? '#F2F2F2' : '#7A7A7A',
                  fontStyle: r.question ? 'normal' : 'italic',
                }}
              >
                {r.question || 'No question'}
              </td>
              <td
                style={{
                  ...tdCell,
                  maxWidth: 160,
                  color: r.emotionalContext ? '#B3B3B3' : '#7A7A7A',
                  fontStyle: r.emotionalContext ? 'normal' : 'italic',
                  fontSize: '0.78rem',
                }}
              >
                {r.emotionalContext || '—'}
              </td>
              <td style={{ ...tdCell, color: '#C6A85B' }}>{r.zodiacSign || '—'}</td>
              <td style={{ ...tdCell, fontSize: '0.75rem', color: '#7A7A7A' }}>
                {r.cards.join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
