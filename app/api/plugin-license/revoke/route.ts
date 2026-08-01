import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { readJson } from "@/lib/http"
import { isAuthorizedAdmin } from "@/lib/plugin-license"

// Admin-only. Pass { revoked: false } to un-revoke; defaults to true.
export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  const body = await readJson(req)
  if (!body) return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 })

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
