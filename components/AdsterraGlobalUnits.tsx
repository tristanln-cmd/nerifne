"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { ADSTERRA_ENABLED, ADSTERRA_SOCIAL_BAR_SRC, ADSTERRA_POPUNDER_SRC } from "@/lib/config"
import { getStoredConsent } from "./CookieConsent"

/**
 * Site-wide Adsterra units: Social Bar (In-Page Push/interstitial — the
 * highest-eCPM format for ad-gated "checkpoint" traffic) and Popunder.
 * Mount this once per page, same pattern as <AutoAds />. Only activates
 * once ad consent is granted.
 */
export default function AdsterraGlobalUnits({
  consent: consentProp,
}: {
  consent?: "granted" | "denied" | null
}) {
  const [localConsent, setLocalConsent] = useState<"granted" | "denied" | null>(null)

  useEffect(() => {
    if (consentProp === undefined) setLocalConsent(getStoredConsent())
  }, [consentProp])

  const consent = consentProp !== undefined ? consentProp : localConsent
  if (!ADSTERRA_ENABLED || consent !== "granted") return null

  return (
    <>
      {ADSTERRA_SOCIAL_BAR_SRC && (
        <Script
          id="adsterra-social-bar"
          src={ADSTERRA_SOCIAL_BAR_SRC}
          strategy="afterInteractive"
          data-cfasync="false"
        />
      )}
      {ADSTERRA_POPUNDER_SRC && (
        <Script
          id="adsterra-popunder"
          src={ADSTERRA_POPUNDER_SRC}
          strategy="afterInteractive"
          data-cfasync="false"
        />
      )}
    </>
  )
}
