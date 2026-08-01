import type { NextRequest } from "next/server"
import { timingSafeEqual } from "@/lib/timing-safe-equal"

// --- Admin auth (x-admin-token header, checked against PLUGIN_LICENSE_ADMIN_TOKEN) ---

export function isAuthorizedAdmin(req: NextRequest): boolean {
  const expected = process.env.PLUGIN_LICENSE_ADMIN_TOKEN ?? ""
  if (!expected) return false

  const provided = req.headers.get("x-admin-token") ?? ""
  if (!provided) return false

  return timingSafeEqual(provided, expected)
}

// --- License key generation ---

const KEY_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // no 0/O/1/I

function randomSegment(length: number): string {
  let out = ""
  for (let i = 0; i < length; i++) {
    out += KEY_CHARS[Math.floor(Math.random() * KEY_CHARS.length)]
  }
  return out
}

export function generateLicenseKey(prefix: string): string {
  const segments = [randomSegment(4), randomSegment(4), randomSegment(4), randomSegment(4)]
  return `${prefix.toUpperCase()}-${segments.join("-")}`
}

// --- Rate limiting for the public /validate endpoint ---

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 60_000
const MAX_REQUESTS = 20

export function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  )
}

export function checkValidateRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= MAX_REQUESTS) return false
  entry.count++
  return true
}
