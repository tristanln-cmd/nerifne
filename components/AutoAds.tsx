"use client"

import { useEffect, useRef } from "react"
import { ADS_ENABLED, ADSENSE_PUBLISHER_ID } from "@/lib/config"

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

/**
 * Enables AdSense page-level ads (anchor + vignette/interstitial) for
 * whichever page mounts this. Pushes once per page load, and only once
 * cookie consent for ads has been granted.
 */
export default function AutoAds({ consent }: { consent: "granted" | "denied" | null }) {
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    if (consent !== "granted") return
    if (!ADS_ENABLED || !ADSENSE_PUBLISHER_ID) return

    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({
        google_ad_client: ADSENSE_PUBLISHER_ID,
        enable_page_level_ads: true,
        overlays: { bottom: true }, // anchor ad — vignette is included automatically
      })
      pushed.current = true
    } catch {
      // adsbygoogle script may not have loaded yet — fail silently
    }
  }, [consent])

  return null
}
