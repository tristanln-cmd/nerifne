import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { getClientIp, readJson } from "@/lib/http"
import { verifyCheckpointToken } from "@/lib/checkpoint"
import { generateLicenseKey } from "@/lib/plugin-license"

const STALE_AFTER_MS = 30 * 60_000
const FREE_KEY_EXPIRES_HOURS = 2 * 24 // 2 days

// Called once the "claim" checkpoint has fully stepped through. Mints a free,
// single-activation key — one per IP, enforced against the DB so it holds up
// across cold starts and multiple serverless instances.
export async function POST(req: NextRequest) {
  const body = await readJson(req)
  if (!body) return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 })

  const token = typeof body.token === "string" ? body.token : ""
  const payload = verifyCheckpointToken(token)
  if (!payload || payload.kind !== "claim" || payload.step < payload.totalSteps) {
    return NextResponse.json({ success: false, message: "Checkpoint not completed." }, { status: 400 })
  }

  const ip = getClientIp(req)
  if (payload.ip !== ip) {
    return NextResponse.json(
      { success: false, message: "Checkpoint must be claimed from the same connection it was started on." },
      { status: 400 }
    )
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
  if (existing?.expires_at && new Date(existing.expires_at).getTime() > Date.now()) {
    return NextResponse.json(
      { success: false, message: "You already have an active key for this IP.", hasActiveKey: true },
      { status: 429 }
    )
  }

  const prefix = plugin.replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase() || "FREE"
  const key = generateLicenseKey(prefix)
  const expiresAt = new Date(Date.now() + FREE_KEY_EXPIRES_HOURS * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from("plugin_licenses")
    .insert({
      key,
      plugin,
      customer_email: null,
      note: "Free checkpoint key",
      expires_at: expiresAt,
      max_activations: 1,
      activation_count: 0,
      revoked: false,
      claimed_ip: ip,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    license: { key: data.key, plugin: data.plugin, expiresAt: data.expires_at },
  })
}
