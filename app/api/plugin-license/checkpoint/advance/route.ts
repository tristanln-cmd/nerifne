import { NextRequest, NextResponse } from "next/server"
import { getClientIp } from "@/lib/rate-limit"
import { verifyCheckpointToken, issueCheckpointToken, stepsForKind } from "@/lib/checkpoint"

const STALE_AFTER_MS = 30 * 60_000 // abandon a run if a step sits open this long

// POST /api/plugin-license/checkpoint/advance
// Body: { token: string }
// Verifies the current step's wait time has actually elapsed, then issues
// the token for the next step (or reports done: true after the last one).
// Works for both "claim" and "addtime" checkpoint runs — the step config
// (count + wait times) travels inside the token itself.
export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 })
  }

  const token = typeof body.token === "string" ? body.token : ""
  const payload = verifyCheckpointToken(token)
  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired checkpoint. Please restart." },
      { status: 400 }
    )
  }

  const ip = getClientIp(req)
  if (payload.ip !== ip) {
    return NextResponse.json(
      { success: false, message: "Checkpoint must be completed from the same connection it was started on." },
      { status: 400 }
    )
  }

  if (payload.step >= payload.totalSteps) {
    return NextResponse.json({ success: false, message: "Checkpoint already complete." }, { status: 400 })
  }

  const elapsed = Date.now() - payload.startedAt
  if (elapsed < payload.minWaitMs) {
    return NextResponse.json(
      { success: false, message: "Please wait for the step to finish before continuing." },
      { status: 400 }
    )
  }
  if (elapsed > payload.minWaitMs + STALE_AFTER_MS) {
    return NextResponse.json({ success: false, message: "Checkpoint expired. Please restart." }, { status: 400 })
  }

  const nextStepIndex = payload.step + 1
  const done = nextStepIndex >= payload.totalSteps

  // Steps for this run's kind/hours, so we know the next step's wait time.
  const steps = stepsForKind(payload.kind, payload.hours)
  const nextMinWaitMs = steps[nextStepIndex]?.minWaitMs ?? steps[steps.length - 1].minWaitMs

  const nextToken = issueCheckpointToken({
    plugin: payload.plugin,
    kind: payload.kind,
    step: nextStepIndex,
    totalSteps: payload.totalSteps,
    minWaitMs: nextMinWaitMs,
    startedAt: Date.now(),
    ip,
    hours: payload.hours,
  })

  return NextResponse.json({ success: true, token: nextToken, step: nextStepIndex, done })
}
