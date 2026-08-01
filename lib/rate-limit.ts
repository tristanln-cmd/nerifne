// In-memory, per-IP rate limiting. Each route gets its own instance, so one
// endpoint being hammered doesn't starve the others. If you ever run multiple
// serverless instances, back this with Redis / Vercel KV instead.
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>()

  return {
    allow(ip: string): boolean {
      const now = Date.now()
      const hit = hits.get(ip)
      if (!hit || now > hit.resetAt) {
        hits.set(ip, { count: 1, resetAt: now + windowMs })
        return true
      }
      if (hit.count >= limit) return false
      hit.count++
      return true
    },
  }
}

// A submission that arrives less than 2s after the page loaded is almost
// certainly a bot — humans can't type that fast.
const MIN_ELAPSED_MS = 2000

export function isSubmittedTooFast(loadTime: unknown): boolean {
  return typeof loadTime === "number" && Date.now() - loadTime < MIN_ELAPSED_MS
}
