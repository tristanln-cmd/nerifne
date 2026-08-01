"use client"

import { useEffect, useMemo, useState } from "react"
import AdsterraBanner from "@/components/AdsterraBanner"
import AdsterraNativeBanner from "@/components/AdsterraNativeBanner"
import AdsterraGlobalUnits from "@/components/AdsterraGlobalUnits"
import CookieConsent from "@/components/CookieConsent"
import AdBlockGate from "@/components/AdBlockGate"
import { ADSTERRA_CHECKPOINT_BANNERS, ADSTERRA_RECTANGLE_BANNER, ADSTERRA_SKYSCRAPER_BANNER } from "@/lib/config"

const DISCORD_INVITE = "https://discord.gg/olemad"
const PLUGIN_NAME = "Madison"

const ADD_TIME_MIN_HOURS = 2
const ADD_TIME_MAX_HOURS = 24
const ADD_TIME_HOURS_PER_GATE = 4 // mirrors lib/checkpoint.ts

function gatesForHours(hours: number): number {
  return Math.max(1, Math.ceil(hours / ADD_TIME_HOURS_PER_GATE))
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return "expired"
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

type CheckpointStep = { label: string; minWaitMs: number }
type Kind = "claim" | "addtime"

// Screens: figuring out which one to show | run through the free-key
// checkpoint | already have a key, show countdown + add time | picking how
// many hours to add | running the add-time ad gates
type Screen = "resolving" | "claim-checkpoint" | "active" | "addtime-pick" | "addtime-checkpoint"

export default function GetKeyPage() {
  const [screen, setScreen] = useState<Screen>("resolving")
  const [error, setError] = useState<string | null>(null)
  const [adConsent, setAdConsent] = useState<"granted" | "denied" | null>(null)

  // The user's current key (from a fresh claim, from /status, or after
  // add-time extends it).
  const [licenseKey, setLicenseKey] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [justClaimed, setJustClaimed] = useState(false)

  // Live countdown, ticks every second while on the "active" screen.
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (screen !== "active") return
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [screen])
  const remainingMs = expiresAt ? new Date(expiresAt).getTime() - now : 0

  // Shared checkpoint-run state (used for both "claim" and "addtime" kinds).
  const [kind, setKind] = useState<Kind>("claim")
  const [token, setToken] = useState<string | null>(null)
  const [steps, setSteps] = useState<CheckpointStep[]>([])
  const [step, setStep] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [joinedClicked, setJoinedClicked] = useState(false)
  const [advancing, setAdvancing] = useState(false)

  // Hour picker for "add time".
  const [pickedHours, setPickedHours] = useState(ADD_TIME_MIN_HOURS)
  const gateCount = useMemo(() => gatesForHours(pickedHours), [pickedHours])

  // On load, find out if this IP already has an active key.
  useEffect(() => {
    fetch("/api/plugin-license/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plugin: PLUGIN_NAME }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message)
        if (data.hasActiveKey) {
          setLicenseKey(data.license.key)
          setExpiresAt(data.license.expiresAt)
          setScreen("active")
        } else {
          startCheckpoint("claim")
        }
      })
      .catch((e: any) => {
        setError(e.message || "Could not check your key status.")
        // Fall back to letting them try to claim.
        startCheckpoint("claim")
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function startCheckpoint(nextKind: Kind, hours?: number) {
    setError(null)
    setJoinedClicked(false)
    try {
      const res = await fetch("/api/plugin-license/checkpoint/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plugin: PLUGIN_NAME, kind: nextKind, hours }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || "Could not start the checkpoint.")
      setKind(nextKind)
      setToken(data.token)
      setSteps(data.steps)
      setStep(0)
      setSecondsLeft(Math.ceil((data.steps[0]?.minWaitMs ?? 15000) / 1000))
      setScreen(nextKind === "claim" ? "claim-checkpoint" : "addtime-checkpoint")
    } catch (e: any) {
      setError(e.message || "Could not start the checkpoint.")
      if (nextKind === "claim") setScreen("claim-checkpoint")
    }
  }

  // Per-step countdown.
  useEffect(() => {
    if (screen !== "claim-checkpoint" && screen !== "addtime-checkpoint") return
    setSecondsLeft(Math.ceil((steps[step]?.minWaitMs ?? 15000) / 1000))
    const interval = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, screen])

  async function advance() {
    if (!token) return
    setAdvancing(true)
    setError(null)
    try {
      const res = await fetch("/api/plugin-license/checkpoint/advance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || "Could not continue.")

      if (data.done) {
        if (kind === "claim") await finishClaim(data.token)
        else await finishAddTime(data.token)
      } else {
        setToken(data.token)
        setStep(data.step)
        setJoinedClicked(false)
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setAdvancing(false)
    }
  }

  async function finishClaim(finalToken: string) {
    setError(null)
    try {
      const res = await fetch("/api/plugin-license/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: finalToken, plugin: PLUGIN_NAME }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || "Could not generate your key.")
      setLicenseKey(data.license.key)
      setExpiresAt(data.license.expiresAt)
      setJustClaimed(true)
      setNow(Date.now())
      setScreen("active")
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function finishAddTime(finalToken: string) {
    setError(null)
    try {
      const res = await fetch("/api/plugin-license/addtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: finalToken }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || "Could not add time.")
      setLicenseKey(data.license.key)
      setExpiresAt(data.license.expiresAt)
      setJustClaimed(false)
      setNow(Date.now())
      setScreen("active")
    } catch (e: any) {
      setError(e.message)
    }
  }

  function copyKey() {
    if (!licenseKey) return
    navigator.clipboard.writeText(licenseKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isDiscordStep = kind === "claim" && step === 0
  const canContinue = secondsLeft <= 0 && (!isDiscordStep || joinedClicked)
  const currentStepLabel = steps[step]?.label ?? "Almost there"

  const isGatedScreen =
    screen === "claim-checkpoint" || screen === "addtime-checkpoint" || screen === "addtime-pick"

  return (
    <AdBlockGate>
      <div className="mx-auto flex min-h-screen max-w-6xl items-start justify-center gap-6 px-4 py-16">
        {/* Left rail — desktop only, only while there's an ad gate to pair it with */}
        {isGatedScreen && (
          <aside className="sticky top-16 hidden shrink-0 lg:block">
            <AdsterraBanner
              adKey={ADSTERRA_SKYSCRAPER_BANNER.adKey}
              width={ADSTERRA_SKYSCRAPER_BANNER.width}
              height={ADSTERRA_SKYSCRAPER_BANNER.height}
              consent={adConsent}
            />
          </aside>
        )}

        <div className="flex w-full max-w-xl flex-col gap-6">
        <CookieConsent onChange={setAdConsent} />
        <AdsterraGlobalUnits consent={adConsent} />

        <div className="text-center">
          <h1 className="text-lg font-semibold">
            {screen === "active" ? `Your free ${PLUGIN_NAME} key` : `Get a free ${PLUGIN_NAME} key`}
          </h1>
          {(screen === "claim-checkpoint" || screen === "addtime-checkpoint") && (
            <p className="mt-1 text-sm text-muted-foreground">
              Step {Math.min(step + 1, steps.length)} of {steps.length}
            </p>
          )}
        </div>

        <AdsterraBanner
          adKey={ADSTERRA_CHECKPOINT_BANNERS[0].adKey}
          width={ADSTERRA_CHECKPOINT_BANNERS[0].width}
          height={ADSTERRA_CHECKPOINT_BANNERS[0].height}
          consent={adConsent}
        />

        {screen === "resolving" && <p className="text-center text-sm text-muted-foreground">Loading…</p>}

        {error && (
          <p className="rounded-md bg-red-500/10 px-3 py-2 text-center text-sm text-red-400">{error}</p>
        )}

        {(screen === "claim-checkpoint" || screen === "addtime-checkpoint") && (
          <div className="flex flex-col gap-4 rounded-lg border border-border p-5">
            <h2 className="text-sm font-medium">{currentStepLabel}</h2>

            {isDiscordStep && (
              <a
                href={DISCORD_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setJoinedClicked(true)}
                className="rounded-md bg-emerald-500/15 px-3 py-2 text-center text-sm font-medium text-emerald-400 hover:bg-emerald-500/25"
              >
                Open {DISCORD_INVITE.replace("https://", "")}
              </a>
            )}

            <AdsterraBanner
              adKey={ADSTERRA_CHECKPOINT_BANNERS[1].adKey}
              width={ADSTERRA_CHECKPOINT_BANNERS[1].width}
              height={ADSTERRA_CHECKPOINT_BANNERS[1].height}
              consent={adConsent}
            />

            <button
              onClick={advance}
              disabled={!canContinue || advancing}
              className="rounded-md bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {advancing
                ? "Checking…"
                : secondsLeft > 0
                  ? `Continue in ${secondsLeft}s`
                  : isDiscordStep && !joinedClicked
                    ? "Join the Discord to continue"
                    : "Continue"}
            </button>

            <AdsterraBanner
              adKey={ADSTERRA_CHECKPOINT_BANNERS[2].adKey}
              width={ADSTERRA_CHECKPOINT_BANNERS[2].width}
              height={ADSTERRA_CHECKPOINT_BANNERS[2].height}
              consent={adConsent}
            />

            <AdsterraNativeBanner consent={adConsent} />

            {kind === "addtime" && (
              <AdsterraBanner
                adKey={ADSTERRA_RECTANGLE_BANNER.adKey}
                width={ADSTERRA_RECTANGLE_BANNER.width}
                height={ADSTERRA_RECTANGLE_BANNER.height}
                consent={adConsent}
              />
            )}
          </div>
        )}

        {screen === "active" && (
          <div className="flex flex-col gap-4 rounded-lg border border-border p-5 text-center">
            <h2 className="text-sm font-medium text-emerald-400">
              {justClaimed ? "Here's your key" : "You already have a key"}
            </h2>
            <code className="rounded-md bg-emerald-500/10 px-3 py-3 text-base font-semibold text-emerald-400">
              {licenseKey}
            </code>
            <button
              onClick={copyKey}
              className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
            >
              {copied ? "Copied!" : "Copy key"}
            </button>

            <div className="rounded-md border border-border/60 px-3 py-2">
              <p className="text-xs text-muted-foreground">Time remaining</p>
              <p className="text-sm font-medium">{formatRemaining(remainingMs)}</p>
            </div>

            <p className="text-xs text-muted-foreground">
              Single activation. Paste it into the {PLUGIN_NAME} plugin in Roblox. One key per
              connection — running low? Add more time below instead of waiting it out.
            </p>

            <button
              onClick={() => setScreen("addtime-pick")}
              className="rounded-md bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/25"
            >
              Add time
            </button>

            <AdsterraBanner
              adKey={ADSTERRA_RECTANGLE_BANNER.adKey}
              width={ADSTERRA_RECTANGLE_BANNER.width}
              height={ADSTERRA_RECTANGLE_BANNER.height}
              consent={adConsent}
            />
          </div>
        )}

        {screen === "addtime-pick" && (
          <div className="flex flex-col gap-4 rounded-lg border border-border p-5">
            <h2 className="text-sm font-medium">How much time do you want to add?</h2>

            <div className="flex flex-col gap-2">
              <input
                type="range"
                min={ADD_TIME_MIN_HOURS}
                max={ADD_TIME_MAX_HOURS}
                step={1}
                value={pickedHours}
                onChange={(e) => setPickedHours(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{pickedHours} hour{pickedHours === 1 ? "" : "s"}</span>
                <span className="text-muted-foreground">
                  {gateCount} ad gate{gateCount === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              More hours means more ad gates to sit through — one gate per ~{ADD_TIME_HOURS_PER_GATE} hours
              added, from {gatesForHours(ADD_TIME_MIN_HOURS)} at {ADD_TIME_MIN_HOURS}h up to{" "}
              {gatesForHours(ADD_TIME_MAX_HOURS)} at {ADD_TIME_MAX_HOURS}h.
            </p>

            <AdsterraBanner
              adKey={ADSTERRA_CHECKPOINT_BANNERS[1].adKey}
              width={ADSTERRA_CHECKPOINT_BANNERS[1].width}
              height={ADSTERRA_CHECKPOINT_BANNERS[1].height}
              consent={adConsent}
            />

            <div className="flex gap-2">
              <button
                onClick={() => setScreen("active")}
                className="flex-1 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => startCheckpoint("addtime", pickedHours)}
                className="flex-1 rounded-md bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/25"
              >
                Start
              </button>
            </div>
          </div>
        )}

        <AdsterraBanner
          adKey={ADSTERRA_CHECKPOINT_BANNERS[3].adKey}
          width={ADSTERRA_CHECKPOINT_BANNERS[3].width}
          height={ADSTERRA_CHECKPOINT_BANNERS[3].height}
          consent={adConsent}
        />
        </div>

        {/* Right rail — desktop only, mirrors the left one */}
        {isGatedScreen && (
          <aside className="sticky top-16 hidden shrink-0 lg:block">
            <AdsterraBanner
              adKey={ADSTERRA_SKYSCRAPER_BANNER.adKey}
              width={ADSTERRA_SKYSCRAPER_BANNER.width}
              height={ADSTERRA_SKYSCRAPER_BANNER.height}
              consent={adConsent}
            />
          </aside>
        )}
      </div>
    </AdBlockGate>
  )
}
