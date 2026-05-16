export async function POST(req: Request) {
  const { password } = await req.json()
  const expected = process.env.ADMIN_TOKEN

  if (!expected || password !== expected) {
    return Response.json({ error: 'Wrong password' }, { status: 401 })
  }

  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  const cookie = `admin_token=${expected}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Strict${secure}`

  return Response.json({ ok: true }, { headers: { 'Set-Cookie': cookie } })
}
