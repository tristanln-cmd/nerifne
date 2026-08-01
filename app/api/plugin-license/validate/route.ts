import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { getClientIp, readJson } from "@/lib/http"
import { createRateLimiter } from "@/lib/rate-limit"

const limiter = createRateLimiter(20, 60_000)

// Public endpoint the plugin itself calls to check a key, track hardware IDs,
// and bump the activation count.
export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!limiter.allow(ip)) {
    return NextResponse.json(
      { valid: false, message: "Too many attempts, try again shortly." },
      { status: 429 }
    )
  }

  const body = await readJson(req)
  if (!body) return NextResponse.json({ valid: false, message: "Invalid JSON body" }, { status: 400 })

  const key = typeof body.key === "string" ? body.key.trim() : ""
  const plugin = typeof body.plugin === "string" ? body.plugin.trim() : ""
  const hwid = typeof body.hwid === "string" ? body.hwid.trim() : null

  if (!key || !plugin) {
    return NextResponse.json(
      { valid: false, message: "`key` and `plugin` are required" },
      { status: 400 }
    )
  }

  const supabase = getSupabaseAdmin()
  const { data: license, error } = await supabase
    .from("plugin_licenses")
    .select("*")
    .eq("key", key)
    .eq("plugin", plugin)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ valid: false, message: "Server error" }, { status: 500 })
  }
  if (!license) {
    return NextResponse.json({ valid: false, message: "Invalid license key" }, { status: 404 })
  }
  if (license.revoked) {
    return NextResponse.json({ valid: false, message: "This license has been revoked" }, { status: 403 })
  }
  if (license.expires_at && new Date(license.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ valid: false, message: "This license has expired" }, { status: 410 })
  }

  if (hwid) {
    const seenIds: string[] = Array.isArray(license.seen_hwids)
      ? license.seen_hwids
      : []

    const alreadySeen = seenIds.includes(hwid)

    if (!alreadySeen && seenIds.length >= license.max_activations) {
      return NextResponse.json(
        { valid: false, message: "This license has reached its hardware activation limit" },
        { status: 403 }
      )
    }

    if (!alreadySeen) {
      await supabase
        .from("plugin_licenses")
        .update({
          seen_hwids: [...seenIds, hwid],
          activation_count: seenIds.length + 1,
          last_validated_at: new Date().toISOString(),
        })
        .eq("key", key)
    } else {
      await supabase
        .from("plugin_licenses")
        .update({ last_validated_at: new Date().toISOString() })
        .eq("key", key)
    }
  }

  return NextResponse.json({
    valid: true,
    message: "License validated",
    plugin: license.plugin,
    expiresAt: license.expires_at,
  })
}
