"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"

const KEY = "nerfine-cookie-notice-dismissed"

export function CookieNotice() {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()

  // /get-key has its own dedicated ad-consent banner (components/CookieConsent.tsx),
  // which already covers cookies/ads for that page. Showing this one too meant two
  // bottom-sheets fought for the same fixed inset-x-3 bottom-3 spot, so visitors
  // could dismiss this one and never reach the real "Accept" button underneath —
  // leaving ad consent stuck at null and every ad on the page dark.
  const suppressed = pathname?.startsWith("/get-key")

  useEffect(() => {
    if (suppressed) return
    try {
      if (!window.localStorage.getItem(KEY)) setVisible(true)
    } catch {}
  }, [suppressed])

  function dismiss() {
    try {
      window.localStorage.setItem(KEY, "1")
    } catch {}
    setVisible(false)
  }

  if (suppressed || !visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto flex max-w-xl flex-col items-stretch gap-3 rounded-lg border border-border bg-card/95 p-4 text-sm text-muted-foreground shadow-lg backdrop-blur-sm sm:flex-row sm:items-center sm:gap-4"
    >
      <p className="flex-1 leading-relaxed">
        This site uses a few functional cookies and an embedded Trustpilot widget. See the{" "}
        <Link href="/privacy" className="text-emerald-400 hover:underline">
          privacy &amp; cookies page
        </Link>{" "}
        for details.
      </p>
      <button
        onClick={dismiss}
        aria-label="Dismiss cookie notice"
        className="inline-flex shrink-0 items-center justify-center gap-1.5 self-end rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20 sm:self-center"
      >
        Got it
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}
