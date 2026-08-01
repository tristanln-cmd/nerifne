import { NextRequest, NextResponse } from "next/server"
import { getClientIp, checkRateLimit } from "@/lib/rate-limit"
import { getSupabaseAdmin } from "@/lib/supabase"
import {
  issueCheckpointToken,
  stepsForKind,
  clampAddTimeHours,
  type CheckpointKind,
} from "@/lib/checkpoint"

// POST /api/plugin-license/checkpoint/start
// Body: { plugin?: string, kind?: "claim" | "addtime", hours?: number }
//
// "claim"   — the free-key checkpoint. Rejected if this IP already holds an
//             active (non-revoked, non-expired) key for the plugin.
// "addtime" — the extend-your-key checkpoint. Rejected if this IP does NOT
//             hold an active key. Step count scales with `hours`.
export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, message: "Too many attempts, try again shortly." },
      { status: 429 }
    )
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    body = {}
  }
  const plugin = typeof body.plugin === "string" && body.plugin.trim() ? body.plugin.trim() : "Madison"
  const kind: CheckpointKind = body.kind === "addtime" ? "addtime" : "claim"
  const hours = kind === "addtime" ? clampAddTimeHours(Number(body.hours)) : undefined

  const supabase = getSupabaseAdmin()
  const { data: existing, error } = await supabase
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

  const hasActiveKey = !!existing?.expires_at && new Date(existing.expires_at).getTime() > Date.now()

  if (kind === "claim" && hasActiveKey) {
    return NextResponse.json(
      { success: false, message: "You already have an active key for this IP. Use Add Time instead.", hasActiveKey: true },
      { status: 409 }
    )
  }
  if (kind === "addtime" && !hasActiveKey) {
    return NextResponse.json(
      { success: false, message: "No active key found for this IP. Claim a free key first." },
      { status: 409 }
    )
  }

  const steps = stepsForKind(kind, hours)

  let token: string
  try {
    token = issueCheckpointToken({
      plugin,
      kind,
      step: 0,
      totalSteps: steps.length,
      minWaitMs: steps[0].minWaitMs,
      startedAt: Date.now(),
      ip,
      hours,
    })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    token,
    kind,
    step: 0,
    totalSteps: steps.length,
    steps,
    hours,
  })
}
