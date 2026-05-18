// proxy.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const token = request.cookies.get('admin_token')?.value
  const expected = process.env.ADMIN_TOKEN

  // Redirect if invalid token
  if (!expected || token !== expected) {
    return NextResponse.redirect(
      new URL('/admin/login', request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}