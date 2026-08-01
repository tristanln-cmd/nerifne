import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { getClientIp, checkRateLimit } from "@/lib/rate-limit"
import { verifyCheckpointToken } from "@/lib/checkpoint"

const STALE_AFTER_MS = 30 * 60_000

// POST /api/plugin-license/addtime
// Body: { token: string }
// Called once an "addtime" checkpoint token has stepped through every ad
// gate. Extends this IP's active key by the number of hours baked into the
// token (extension is measured from the key's current expiry, or from now
// if it already lapsed, so it never lets you "stack" past what you picked).
export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 })
  }

  const token = typeof body.token === "string" ? body.token : ""
  const payload = verifyCheckpointToken(token)
  if (!payload || payload.kind !== "addtime" || payload.step < payload.totalSteps || !payload.hours) {
    return NextResponse.json({ success: false, message: "Checkpoint not completed." }, { status: 400 })
  }

  const ip = getClientIp(req)
  if (payload.ip !== ip) {
    return NextResponse.json(
      { success: false, message: "Checkpoint must be completed from the same connection it was started on." },
      { status: 400 }
    )
  }
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ success: false, message: "Too many attempts, try again shortly." }, { status: 429 })
  }

  const elapsed = Date.now() - payload.startedAt
  if (elapsed > STALE_AFTER_MS) {
    return NextResponse.json({ success: false, message: "Checkpoint expired. Please restart." }, { status: 400 })
  }

  const plugin = payload.plugin || "Madison"
  const supabase = getSupabaseAdmin()

  const { data: existing, error: lookupError } = await supabase
    .from("plugin_licenses")
    .select("key, expires_at, revoked")
    .eq("claimed_ip", ip)
    .eq("plugin", plugin)
    .eq("revoked", false)
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (lookupError) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
  if (!existing) {
    return NextResponse.json({ success: false, message: "No active key found for this IP." }, { status: 404 })
  }

  const currentExpiry = existing.expires_at ? new Date(existing.expires_at).getTime() : Date.now()
  const base = Math.max(currentExpiry, Date.now())
  const newExpiresAt = new Date(base + payload.hours * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from("plugin_licenses")
    .update({ expires_at: newExpiresAt })
    .eq("key", existing.key)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    license: { key: data.key, plugin: data.plugin, expiresAt: data.expires_at },
    hoursAdded: payload.hours,
  })
}
