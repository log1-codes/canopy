import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

interface RateEntry {
  count: number
  resetAt: number
}

const rateLimitMap = new Map<string, RateEntry>()

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  '/api/auth/register': { max: 5, windowMs: 60_000 },
  '/api/auth/forgot-password': { max: 3, windowMs: 60_000 },
  '/api/reset-password': { max: 5, windowMs: 60_000 },
}

const CLEANUP_INTERVAL = 5 * 60_000
let lastCleanup = Date.now()

function cleanupStaleEntries() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key)
    }
  }
}

function checkRateLimit(ip: string, path: string): boolean {
  const config = RATE_LIMITS[path]
  if (!config) return true

  cleanupStaleEntries()

  const key = `${ip}:${path}`
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + config.windowMs })
    return true
  }

  if (entry.count >= config.max) {
    return false
  }

  entry.count++
  return true
}


const protectedRoutes = ['/dashboard', '/profile']
const publicRoutes = ['/login', '/signup', '/forgot-password', '/reset-password']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  const rateLimitedPath = Object.keys(RATE_LIMITS).find((route) =>
    path.startsWith(route)
  )

  if (rateLimitedPath && request.method === 'POST') {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    if (!checkRateLimit(ip, rateLimitedPath)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
  }

  const isProtectedRoute = protectedRoutes.some(route =>
    path.startsWith(route)
  )

  const isPublicRoute = publicRoutes.some(route =>
    path.startsWith(route)
  )

  if (!isProtectedRoute && !isPublicRoute) {
    return NextResponse.next()
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(loginUrl)
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     * Note: API auth routes are included for rate limiting
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
}