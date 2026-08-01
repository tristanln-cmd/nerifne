"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const CONSENT_KEY = "site-ad-consent"

export function getStoredConsent(): "granted" | "denied" | null {
  if (typeof window === "undefined") return null
  const v = window.localStorage.getItem(CONSENT_KEY)
  return v === "granted" || v === "denied" ? v : null
}

export default function CookieConsent({ onChange }: { onChange?: (consent: "granted" | "denied") => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const existing = getStoredConsent()
    if (existing) {
      onChange?.(existing)
    } else {
      setVisible(true)
    }
  }, [])

  function choose(consent: "granted" | "denied") {
    window.localStorage.setItem(CONSENT_KEY, consent)
    setVisible(false)
    onChange?.(consent)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[200] mx-auto flex max-w-md flex-col gap-3 rounded-lg border border-border bg-card/95 p-4 text-sm text-muted-foreground shadow-lg backdrop-blur-sm"
    >
      <p className="leading-relaxed">
        This site uses cookies to show personalized ads. You can accept or decline without
        affecting how you browse.{" "}
        <Link href="/privacy" className="text-emerald-400 hover:underline">
          Learn more
        </Link>
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => choose("denied")}
          className="flex-1 rounded-md border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary/70"
        >
          Decline
        </button>
        <button
          onClick={() => choose("granted")}
          className="flex-1 rounded-md border border-emerald-500/30 bg-emerald-500/15 px-3 py-2 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/25"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
