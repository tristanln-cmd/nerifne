"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Blocks interaction with the page behind it until it can confirm ads are
 * not being blocked. Uses two independent signals so it isn't fooled by
 * either alone:
 *
 *  1. Bait element — a div styled/classed like a typical ad unit
 *     (class names from EasyList-style filters). If an ad blocker's
 *     cosmetic filters hide it, its rendered size collapses to 0.
 *  2. Network probe — a real request to the ad network script URL we use
 *     elsewhere on the site. Network-level blockers (uBlock, Brave shields,
 *     Pi-hole, etc.) reject this before it ever loads.
 *
 * Re-checks on an interval and whenever the tab regains focus, so a user
 * can disable their blocker and continue without reloading the page.
 */

const PROBE_SCRIPT_URL = "https://www.highperformanceformat.com/8acde9673fbbd53949219b4d5e668a64/invoke.js"
const RECHECK_INTERVAL_MS = 4000

async function probeViaBaitElement(): Promise<boolean> {
  const bait = document.createElement("div")
  bait.className = "adsbox ad-banner ad-placement adsbygoogle pub_300x250 textads banner-ad"
  bait.style.cssText =
    "position:absolute;top:-9999px;left:-9999px;width:120px;height:60px;pointer-events:none;"
  document.body.appendChild(bait)

  await new Promise((r) => setTimeout(r, 120))

  const rect = bait.getBoundingClientRect()
  const style = window.getComputedStyle(bait)
  const hidden =
    rect.height === 0 ||
    style.display === "none" ||
    style.visibility === "hidden" ||
    bait.offsetParent === null

  document.body.removeChild(bait)
  return hidden
}

async function probeViaNetwork(): Promise<boolean> {
  try {
    await fetch(PROBE_SCRIPT_URL, { mode: "no-cors", cache: "no-store" })
    return false
  } catch {
    return true
  }
}

async function detectAdBlock(): Promise<boolean> {
  const [baitBlocked, networkBlocked] = await Promise.all([
    probeViaBaitElement(),
    probeViaNetwork(),
  ])
  return baitBlocked || networkBlocked
}

export default function AdBlockGate({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [rechecking, setRechecking] = useState(false)
  const mounted = useRef(true)

  async function runCheck(showSpinner = false) {
    if (showSpinner) setRechecking(true)
    const result = await detectAdBlock()
    if (mounted.current) {
      setBlocked(result)
      setChecked(true)
      setRechecking(false)
    }
  }

  useEffect(() => {
    mounted.current = true
    runCheck()

    const interval = setInterval(() => runCheck(), RECHECK_INTERVAL_MS)
    const onFocus = () => runCheck()
    window.addEventListener("focus", onFocus)
    document.addEventListener("visibilitychange", onFocus)

    return () => {
      mounted.current = false
      clearInterval(interval)
      window.removeEventListener("focus", onFocus)
      document.removeEventListener("visibilitychange", onFocus)
    }
  }, [])

  return (
    <>
      {children}

      {checked && blocked && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="adblock-gate-title"
        >
          <div className="w-full max-w-sm rounded-lg border border-border bg-background p-6 text-center shadow-xl">
            <h2 id="adblock-gate-title" className="text-base font-semibold">
              Please disable your ad blocker
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This page is free thanks to ads. Turn off your ad blocker for this
              site, then hit recheck to continue.
            </p>
            <button
              onClick={() => runCheck(true)}
              disabled={rechecking}
              className="mt-4 w-full rounded-md bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {rechecking ? "Checking…" : "I've disabled it — Recheck"}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
