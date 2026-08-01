"use client"

import { useEffect, useState } from "react"
import AdSlot from "@/components/AdSlot"
import { ADSENSE_CHECKPOINT_SLOTS } from "@/lib/config"

const DISCORD_INVITE = "https://discord.gg/olemad"
const PLUGIN_NAME = "Madison"
const STEP_LABELS = ["Join the Discord server", "Thanks for the support"]
const STEP_WAIT_SECONDS = [15, 15]

export default function GetKeyPage() {
  const [token, setToken] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(STEP_LABELS.length)
  const [secondsLeft, setSecondsLeft] = useState(STEP_WAIT_SECONDS[0])
  const [joinedClicked, setJoinedClicked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [advancing, setAdvancing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [licenseKey, setLicenseKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch("/api/plugin-license/checkpoint/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plugin: PLUGIN_NAME }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message)
        setToken(data.token)
        setTotalSteps(data.totalSteps)
        setLoading(false)
      })
      .catch((e: any) => {
        setError(e.message || "Could not start the checkpoint.")
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (loading || licenseKey) return
    setSecondsLeft(STEP_WAIT_SECONDS[step] ?? 10)
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [step, loading, licenseKey])

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
        await claim(data.token)
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

  async function claim(finalToken: string) {
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

  const isDiscordStep = step === 0
  const canContinue = secondsLeft <= 0 && (!isDiscordStep || joinedClicked)

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-6 py-16">
      <div className="text-center">
        <h1 className="text-lg font-semibold">Get a free {PLUGIN_NAME} key</h1>
        {!licenseKey && (
          <p className="mt-1 text-sm text-muted-foreground">
            Step {Math.min(step + 1, totalSteps)} of {totalSteps}
          </p>
        )}
      </div>

      <AdSlot slotId={ADSENSE_CHECKPOINT_SLOTS[0]} />

      {loading && <p className="text-center text-sm text-muted-foreground">Loading…</p>}

      {error && (
        <p className="rounded-md bg-red-500/10 px-3 py-2 text-center text-sm text-red-400">{error}</p>
      )}

      {!loading && !licenseKey && (
        <div className="flex flex-col gap-4 rounded-lg border border-border p-5">
          <h2 className="text-sm font-medium">{STEP_LABELS[step] ?? "Almost there"}</h2>

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

          <AdSlot slotId={ADSENSE_CHECKPOINT_SLOTS[1]} />

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

          <AdSlot slotId={ADSENSE_CHECKPOINT_SLOTS[2]} />
        </div>
      )}

      {licenseKey && (
        <div className="flex flex-col gap-4 rounded-lg border border-border p-5 text-center">
          <h2 className="text-sm font-medium text-emerald-400">Here's your key</h2>
          <code className="rounded-md bg-emerald-500/10 px-3 py-3 text-base font-semibold text-emerald-400">
            {licenseKey}
          </code>
          <button
            onClick={copyKey}
            className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
          >
            {copied ? "Copied!" : "Copy key"}
          </button>
          <p className="text-xs text-muted-foreground">
            Valid for 2 days, locked to 1 device. Paste it into the Madison hub.
          </p>
        </div>
      )}

      <AdSlot slotId={ADSENSE_CHECKPOINT_SLOTS[3]} />
    </div>
  )
}