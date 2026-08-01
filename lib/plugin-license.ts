import type { NextRequest } from "next/server"
import { timingSafeEqual } from "@/lib/timing-safe-equal"

// Admin endpoints check the x-admin-token header against this env var.
export function isAuthorizedAdmin(req: NextRequest): boolean {
  const expected = process.env.PLUGIN_LICENSE_ADMIN_TOKEN ?? ""
  const provided = req.headers.get("x-admin-token") ?? ""
  if (!expected || !provided) return false
  return timingSafeEqual(provided, expected)
}

const KEY_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // no 0/O/1/I to avoid typos

function randomSegment(length: number): string {
  let out = ""
  for (let i = 0; i < length; i++) out += KEY_CHARS[Math.floor(Math.random() * KEY_CHARS.length)]
  return out
}

export function generateLicenseKey(prefix: string): string {
  const segments = [randomSegment(4), randomSegment(4), randomSegment(4), randomSegment(4)]
  return `${prefix.toUpperCase()}-${segments.join("-")}`
}
