import { getLogs } from '@/lib/logger'
import { VisitsTable, ReadingsTable, FeedbackTable } from './AdminTables'

export const dynamic = 'force-dynamic'

function isToday(iso: string): boolean {
  const d = new Date(iso)
  const now = new Date()
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  )
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div
      style={{
        background: 'rgba(20,20,20,0.7)',
        border: '1px solid rgba(198,168,91,0.18)',
        borderRadius: 12,
        padding: '1.4rem 1.8rem',
        backdropFilter: 'blur(14px)',
        flex: '1 1 180px',
        minWidth: 160,
      }}
    >
      <div
        style={{
          fontSize: '2.2rem',
          fontWeight: 300,
          color: '#C6A85B',
          fontFamily: 'var(--font-cinzel), Georgia, serif',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#7A7A7A',
          marginTop: '0.5rem',
          fontFamily: 'var(--font-cinzel), Georgia, serif',
        }}
      >
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: '0.75rem', color: '#C6A85B', marginTop: '0.25rem', opacity: 0.7 }}>
          {sub} today
        </div>
      )}
    </div>
  )
}

export default async function AdminPage() {
  const logs = await getLogs()
  const visitsToday = logs.visits.filter((v) => isToday(v.timestamp)).length
  const readingsToday = logs.readings.filter((r) => isToday(r.timestamp)).length
  const recentVisits = logs.visits.slice(0, 50)
  const recentReadings = logs.readings.slice(0, 30)
  const recentFeedback = logs.feedback.slice(0, 100)

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '2.5rem 1.5rem 4rem',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#C6A85B',
            fontFamily: 'var(--font-cinzel), Georgia, serif',
            marginBottom: '0.5rem',
          }}
        >
          ✦ &nbsp; Arcana Garden
        </div>
        <h1
          style={{
            fontSize: '1.8rem',
            fontWeight: 300,
            color: '#F2F2F2',
            fontFamily: 'var(--font-cinzel), Georgia, serif',
            letterSpacing: '0.05em',
            margin: 0,
          }}
        >
          Analytics Dashboard
        </h1>
        <p style={{ color: '#7A7A7A', marginTop: '0.4rem', fontSize: '0.85rem' }}>
          Reload the page to refresh data.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
        <StatCard label="Total Visits" value={logs.visits.length} sub={`+${visitsToday}`} />
        <StatCard label="Visits Today" value={visitsToday} />
        <StatCard label="Claude API Calls" value={logs.readings.length} sub={`+${readingsToday}`} />
        <StatCard label="Readings Today" value={readingsToday} />
      </div>

      {/* Visits table */}
      <section style={{ marginBottom: '3rem' }}>
        <h2
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#C6A85B',
            fontFamily: 'var(--font-cinzel), Georgia, serif',
            fontWeight: 400,
            marginBottom: '1rem',
          }}
        >
          ✦ &nbsp; Recent Visits
        </h2>

        <VisitsTable visits={recentVisits} />
      </section>

      {/* Readings table */}
      <section style={{ marginBottom: '3rem' }}>
        <h2
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#C6A85B',
            fontFamily: 'var(--font-cinzel), Georgia, serif',
            fontWeight: 400,
            marginBottom: '1rem',
          }}
        >
          ✦ &nbsp; Claude API Readings
        </h2>

        <ReadingsTable readings={recentReadings} />
      </section>

      {/* Feedback table */}
      <section>
        <h2
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#C6A85B',
            fontFamily: 'var(--font-cinzel), Georgia, serif',
            fontWeight: 400,
            marginBottom: '1rem',
          }}
        >
          ✦ &nbsp; Feedback ({recentFeedback.length})
        </h2>

        <FeedbackTable feedback={recentFeedback} />
      </section>
    </div>
  )
}
