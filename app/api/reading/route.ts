import Anthropic from '@anthropic-ai/sdk'
import { headers } from 'next/headers'
import { logReading } from '@/lib/logger'
import { SYSTEM_PROMPT, buildUserMessage } from './prompt'

const client = new Anthropic()

export async function POST(req: Request) {
  const { cards, spread, question, emotionalContext, zodiacSign } = await req.json()

  const hdrs  = await headers()
  const rawIp =
    hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    hdrs.get('x-real-ip') ??
    'unknown'

  await logReading({
    timestamp:        new Date().toISOString(),
    spread:           spread ?? '1',
    question:         question ?? '',
    emotionalContext: emotionalContext ?? '',
    zodiacSign:       zodiacSign ?? '',
    cards:            (cards as Array<{ name: string }>).map((c) => c.name),
    ip:               rawIp.slice(0, 6) + '…',
  })

  const userContent = buildUserMessage(
    cards,
    spread,
    question         ?? '',
    emotionalContext ?? '',
    zodiacSign       ?? ''
  )

  const stream = await client.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 2200,
    stream:     true,
    system:     SYSTEM_PROMPT,
    messages:   [{ role: 'user', content: userContent }],
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
