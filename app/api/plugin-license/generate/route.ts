import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { readJson } from "@/lib/http"
import { isAuthorizedAdmin, generateLicenseKey } from "@/lib/plugin-license"

// Admin-only. Both handlers require the x-admin-token header.
export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  const body = await readJson(req)
  if (!body) return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 })

  const plugin = typeof body.plugin === "string" ? body.plugin.trim() : ""
  if (!plugin) {
    return NextResponse.json({ success: false, message: "`plugin` is required" }, { status: 400 })
  }

  const customerEmail = typeof body.customerEmail === "string" ? body.customerEmail.trim() : null
  const note = typeof body.note === "string" ? body.note.trim() : null
  const expiresInDays =
    typeof body.expiresInDays === "number" && body.expiresInDays > 0 ? body.expiresInDays : null
  const maxActivations =
    typeof body.maxActivations === "number" && body.maxActivations > 0 ? body.maxActivations : 1

  const key = generateLicenseKey("MADISON")
  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : null

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("plugin_licenses")
    .insert({
      key,
      plugin,
      customer_email: customerEmail,
      note,
      expires_at: expiresAt,
      max_activations: maxActivations,
      activation_count: 0,
      revoked: false,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, license: data })
}

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("plugin_licenses")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, licenses: data })
}
