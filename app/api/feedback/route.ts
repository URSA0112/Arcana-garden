import { NextRequest, NextResponse } from 'next/server'
import { logFeedback } from '@/lib/logger'

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }
    if (message.length > 500) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 })
    }
    await logFeedback(message.trim())
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
