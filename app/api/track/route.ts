import { headers } from 'next/headers'
import { logVisit } from '@/lib/logger'

function maskIp(ip: string): string {
  const parts = ip.split('.')
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.*.*`
  return ip.slice(0, 6) + '…'
}

export async function POST(req: Request) {
  try {
    const { page, referrer } = await req.json()
    const hdrs = await headers()
    const rawIp =
      hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      hdrs.get('x-real-ip') ??
      'unknown'
    const userAgent = hdrs.get('user-agent') ?? 'unknown'

    const botPattern = /bot|crawler|spider|googlebot|bingbot|slurp|duckduckbot|facebookexternalhit|ia_archiver/i
    if (botPattern.test(userAgent)) return new Response(null, { status: 204 })

    await logVisit({
      timestamp: new Date().toISOString(),
      page: page ?? '/',
      ip: maskIp(rawIp),
      userAgent,
      referrer: referrer ?? '',
    })
  } catch {
    // never crash a page load over analytics
  }

  return new Response(null, { status: 204 })
}
