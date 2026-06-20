import { NextRequest, NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

setInterval(
  () => {
    const now = Date.now()
    store.forEach((entry, key) => {
      if (now > entry.resetAt) store.delete(key)
    })
  },
  60 * 1000
)

interface RateLimitOptions {
  limit: number
  windowMs: number
}

export function rateLimit(options: RateLimitOptions) {
  return async function check(req: NextRequest): Promise<NextResponse | null> {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'anonymous'

    const key = `${req.nextUrl.pathname}:${ip}`
    const now = Date.now()
    const entry = store.get(key)

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + options.windowMs })
      return null
    }

    entry.count++

    if (entry.count > options.limit) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(options.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(entry.resetAt / 1000)),
          },
        }
      )
    }

    return null
  }
}

export const authRateLimit = rateLimit({ limit: 10, windowMs: 15 * 60 * 1000 })
export const checkoutRateLimit = rateLimit({ limit: 5, windowMs: 60 * 1000 })
export const adminApiRateLimit = rateLimit({ limit: 30, windowMs: 60 * 1000 })
