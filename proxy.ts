// proxy.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  const expected = process.env.ADMIN_TOKEN

  if (!expected || token !== expected) {
    return NextResponse.redirect(
      new URL('/admin/login', request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  // Protect /admin and any sub-paths except /admin/login (which is public)
  matcher: ['/admin', '/admin/((?!login$).+)'],
}