import { NextRequest, NextResponse } from 'next/server'

// Unprotected paths
const PUBLIC_PATHS = [
  '/login',
]

// Allow requests for Next.js internals and public static files
function isPublicRequest(pathname: string) {
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.') || // public folder
    PUBLIC_PATHS.includes(pathname)
  )
}

// Decode a base64url JWT and check its 'exp' claim
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return true

    // base64url → JSON
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8'),
    )
    const nowInSecs = Date.now() / 1000

    return typeof payload.exp !== 'number' || payload.exp < nowInSecs
  } catch {
    return true
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow any public or static request
  if (isPublicRequest(pathname)) {
    return NextResponse.next()
  }

  if (pathname === '/')
    return NextResponse.redirect(new URL('/dashboard', req.url))

  // Clear cookies on logout
  if (pathname === '/logout') {
    const response = NextResponse.redirect(new URL('/login', req.url))
    response.cookies.delete('accessToken')
    return response
  }

  // Check for access token cookie
//   const accessToken = req.cookies.get('accessToken')?.value
//   if (!accessToken || isTokenExpired(accessToken)) {
//     return NextResponse.redirect(new URL('/login', req.url))
//   }

  // Authenticated, proceed
  return NextResponse.next()
}

export const config = {
  // Protect everything except Next.js internals
  matcher: ['/:path*'],
}