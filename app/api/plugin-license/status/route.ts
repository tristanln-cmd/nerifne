import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { getClientIp, checkRateLimit } from "@/lib/rate-limit"

// POST /api/plugin-license/status
// Body: { plugin?: string }
// Looks up whether this IP already holds an active (non-revoked,
// non-expired) key, so the get-key page can show a countdown + "Add time"
// instead of running the claim checkpoint again.
export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ success: false, message: "Too many attempts, try again shortly." }, { status: 429 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    body = {}
  }
  const plugin = typeof body.plugin === "string" && body.plugin.trim() ? body.plugin.trim() : "Madison"

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("plugin_licenses")
    .select("key, expires_at, revoked")
    .eq("claimed_ip", ip)
    .eq("plugin", plugin)
    .eq("revoked", false)
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }

  const hasActiveKey = !!data?.expires_at && new Date(data.expires_at).getTime() > Date.now()

  if (!hasActiveKey) {
    return NextResponse.json({ success: true, hasActiveKey: false })
  }

  return NextResponse.json({
    success: true,
    hasActiveKey: true,
    license: { key: data!.key, expiresAt: data!.expires_at },
  })
}
