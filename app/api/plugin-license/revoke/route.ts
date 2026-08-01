import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { isAuthorizedAdmin } from "@/lib/plugin-license"

// POST /api/plugin-license/revoke
// Header: x-admin-token: <PLUGIN_LICENSE_ADMIN_TOKEN>
// Body: { key: string, revoked?: boolean }  (revoked defaults to true; pass false to un-revoke)
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

  const key = typeof body.key === "string" ? body.key.trim() : ""
  if (!key) {
    return NextResponse.json({ success: false, message: "`key` is required" }, { status: 400 })
  }
  const revoked = typeof body.revoked === "boolean" ? body.revoked : true

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("plugin_licenses")
    .update({ revoked })
    .eq("key", key)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, license: data })
}
