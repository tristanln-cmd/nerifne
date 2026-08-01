import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { getClientIp, readJson } from "@/lib/http"
import { createRateLimiter } from "@/lib/rate-limit"

const limiter = createRateLimiter(3, 60_000)

// Lets the get-key page show a countdown + "Add time" when this IP already
// holds an active key, instead of running the claim checkpoint again.
export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!limiter.allow(ip)) {
    return NextResponse.json({ success: false, message: "Too many attempts, try again shortly." }, { status: 429 })
  }

  const body = (await readJson(req)) ?? {}
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
