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

    // 1. Convert Base64URL to Base64
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    
    // 2. FIXED: Add Padding (Required for atob in Edge Runtime)
    const padding = base64.length % 4
    if (padding) {
      base64 += '='.repeat(4 - padding)
    }

    // 3. Decode
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    const payload = JSON.parse(jsonPayload)
    const nowInSecs = Date.now() / 1000

    return typeof payload.exp !== 'number' || payload.exp < nowInSecs
  } catch (e) {
    console.error("Token decode failed:", e)
    return true
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Check for access token cookie
  const accessToken = req.cookies.get('accessToken')?.value
  const hasValidSession = accessToken && !isTokenExpired(accessToken)

  // Redirect authenticated users away from login page
  if( pathname === '/login' && hasValidSession ) {
    return NextResponse.redirect(new URL('/users', req.url))
  }

  // Allow any public or static request
  if (isPublicRequest(pathname)) {
    return NextResponse.next()
  }

  // Redirect root to dashboard
  if (pathname === '/')
    return NextResponse.redirect(new URL('/users', req.url))

  // Clear cookies on logout
  if (pathname === '/logout') {
    const response = NextResponse.redirect(new URL('/login', req.url))
    response.cookies.delete('accessToken')
    return response
  }

  // Protect private routes
  if (!hasValidSession) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Authenticated, proceed
  return NextResponse.next()
}

export const config = {
  // Protect everything except Next.js internals
  matcher: ['/:path*'],
}