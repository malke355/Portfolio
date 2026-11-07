import { MAX_DEVBOT_MESSAGES_PER_MINUTE } from '@/lib/devbot/types'

type Bucket = {
  timestamps: number[]
}

const buckets = new Map<string, Bucket>()

/**
 * Simple in-memory sliding window. Fine for a single Node instance (Vercel
 * serverless is best-effort per isolate). Demo mode never hits this.
 */
export function checkRateLimit(
  key: string,
  limit = MAX_DEVBOT_MESSAGES_PER_MINUTE,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now()
  const windowMs = 60_000
  const bucket = buckets.get(key) ?? { timestamps: [] }
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs)

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0] ?? now
    const retryAfterSec = Math.max(
      1,
      Math.ceil((windowMs - (now - oldest)) / 1000),
    )
    buckets.set(key, bucket)
    return { ok: false, retryAfterSec }
  }

  bucket.timestamps.push(now)
  buckets.set(key, bucket)
  return { ok: true }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return request.headers.get('x-real-ip') ?? 'anonymous'
}
