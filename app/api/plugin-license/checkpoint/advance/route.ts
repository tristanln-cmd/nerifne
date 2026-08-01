import { NextRequest, NextResponse } from "next/server"
import { getClientIp, readJson } from "@/lib/http"
import { verifyCheckpointToken, issueCheckpointToken, stepsForKind } from "@/lib/checkpoint"

const STALE_AFTER_MS = 30 * 60_000 // abandon a run if a step sits open this long

// Verifies the current step's wait has elapsed, then issues the token for the
// next step (or reports done after the last one). Works for both checkpoint kinds.
export async function POST(req: NextRequest) {
  const body = await readJson(req)
  if (!body) return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 })

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

  // The next step's wait time lives in the token's own step config.
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
