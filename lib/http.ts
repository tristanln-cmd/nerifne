import type { NextRequest } from "next/server"

// The proxy/load-balancer chain is the only reliable place for the client IP.
export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  )
}

// Null when the request body isn't valid JSON, so handlers can reply 400
// instead of wrapping every `await req.json()` in a try/catch.
export async function readJson(req: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json()
    return body && typeof body === "object" ? (body as Record<string, unknown>) : null
  } catch {
    return null
  }
}
