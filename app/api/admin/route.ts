import { getLogs } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function GET() {
  const logs = await getLogs()
  return Response.json(logs)
}
