import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { isAuthorizedAdmin, generateLicenseKey } from "@/lib/plugin-license"

// POST /api/plugin-license/generate
// Header: x-admin-token: <PLUGIN_LICENSE_ADMIN_TOKEN>
// Body: { plugin: string, customerEmail?: string, note?: string, expiresInDays?: number | null, maxActivations?: number }
export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 })
  }

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

// GET /api/plugin-license/generate — list all licenses (admin only, reused route for simplicity)
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
