import crypto from "crypto"
import { timingSafeEqual } from "@/lib/timing-safe-equal"

const SECRET = process.env.CHECKPOINT_SECRET ?? ""

export type CheckpointKind = "claim" | "addtime"

export type CheckpointStepConfig = {
  label: string
  minWaitMs: number
}

// Edit this list to add/remove/reorder the steps for the initial free-key
// checkpoint (kind: "claim").
export const CHECKPOINT_STEPS: CheckpointStepConfig[] = [
  { label: "Join the Discord server", minWaitMs: 15_000 },
  { label: "Thanks for the support", minWaitMs: 15_000 },
]

// --- "Add time" checkpoint (kind: "addtime") ---
//
// Users who already hold an active key can bolt on more hours instead of
// waiting for it to expire. The longer they extend it, the more ad gates
// they sit through: one gate per ~4 hours requested, so 2h = 1 gate and
// 24h = 6 gates.

export const ADD_TIME_MIN_HOURS = 2
export const ADD_TIME_MAX_HOURS = 24
export const ADD_TIME_HOURS_PER_GATE = 4
export const ADD_TIME_STEP_WAIT_MS = 15_000

export function clampAddTimeHours(hours: number): number {
  if (!Number.isFinite(hours)) return ADD_TIME_MIN_HOURS
  const rounded = Math.round(hours)
  return Math.min(ADD_TIME_MAX_HOURS, Math.max(ADD_TIME_MIN_HOURS, rounded))
}

/** How many ad-gate steps a given (already-clamped) hour count requires. */
export function adGatesForHours(hours: number): number {
  const clamped = clampAddTimeHours(hours)
  return Math.max(1, Math.ceil(clamped / ADD_TIME_HOURS_PER_GATE))
}

export function addTimeSteps(hours: number): CheckpointStepConfig[] {
  const gates = adGatesForHours(hours)
  return Array.from({ length: gates }, (_, i) => ({
    label: `Ad break ${i + 1} of ${gates}`,
    minWaitMs: ADD_TIME_STEP_WAIT_MS,
  }))
}

export function stepsForKind(kind: CheckpointKind, hours?: number): CheckpointStepConfig[] {
  return kind === "addtime" ? addTimeSteps(hours ?? ADD_TIME_MIN_HOURS) : CHECKPOINT_STEPS
}

// --- Token payload ---
//
// Self-contained on purpose: the current step's minWaitMs and the run's
// totalSteps travel inside the signed token itself, so /advance never has
// to re-derive step config from anywhere else (important since "addtime"
// step counts vary by how many hours were requested).

export type CheckpointPayload = {
  plugin: string
  kind: CheckpointKind
  step: number
  totalSteps: number
  minWaitMs: number
  startedAt: number
  ip: string
  hours?: number // only meaningful for kind === "addtime"
}

function sign(body: string): string {
  return crypto.createHmac("sha256", SECRET).update(body).digest("hex")
}

/** Signs a checkpoint step so the client can't fabricate or skip ahead. */
export function issueCheckpointToken(payload: CheckpointPayload): string {
  if (!SECRET) {
    throw new Error("Checkpoint requires the CHECKPOINT_SECRET env var to be set.")
  }
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url")
  return `${body}.${sign(body)}`
}

export function verifyCheckpointToken(token: string): CheckpointPayload | null {
  if (!SECRET || !token || typeof token !== "string") return null
  const [body, sig] = token.split(".")
  if (!body || !sig) return null
  if (!timingSafeEqual(sig, sign(body))) return null

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"))
    if (
      (payload.kind === "claim" || payload.kind === "addtime") &&
      typeof payload.plugin === "string" &&
      typeof payload.step === "number" &&
      typeof payload.totalSteps === "number" &&
      typeof payload.minWaitMs === "number" &&
      typeof payload.startedAt === "number" &&
      typeof payload.ip === "string" &&
      (payload.hours === undefined || typeof payload.hours === "number")
    ) {
      return payload as CheckpointPayload
    }
    return null
  } catch {
    return null
  }
}
