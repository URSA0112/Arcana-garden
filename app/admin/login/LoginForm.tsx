'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      setError('Wrong password.')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'rgba(20,20,20,0.7)',
          border: '1px solid rgba(198,168,91,0.18)',
          borderRadius: 14,
          padding: '2.5rem 2rem',
          backdropFilter: 'blur(14px)',
          width: '100%',
          maxWidth: 340,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.6rem',
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
              fontSize: '1.3rem',
              fontWeight: 300,
              color: '#F2F2F2',
              fontFamily: 'var(--font-cinzel), Georgia, serif',
              margin: 0,
              letterSpacing: '0.04em',
            }}
          >
            Admin Access
          </h1>
        </div>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
          style={{
            background: 'rgba(10,10,10,0.6)',
            border: '1px solid rgba(198,168,91,0.2)',
            borderRadius: 8,
            padding: '0.75rem 1rem',
            color: '#F2F2F2',
            fontSize: '0.95rem',
            outline: 'none',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />

        {error && (
          <p style={{ color: '#c0392b', fontSize: '0.82rem', margin: 0 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? 'rgba(198,168,91,0.15)' : 'rgba(198,168,91,0.12)',
            border: '1px solid rgba(198,168,91,0.35)',
            borderRadius: 8,
            padding: '0.75rem',
            color: '#C6A85B',
            fontSize: '0.75rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-cinzel), Georgia, serif',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'Verifying…' : 'Enter'}
        </button>
      </form>
    </div>
  )
}
