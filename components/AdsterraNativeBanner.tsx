"use client"

import { useEffect, useState } from "react"
import { ADSTERRA_ENABLED, ADSTERRA_NATIVE_BANNER } from "@/lib/config"
import { getStoredConsent } from "./CookieConsent"

export default function AdsterraNativeBanner({
  consent: consentProp,
}: {
  consent?: "granted" | "denied" | null
}) {
  const [localConsent, setLocalConsent] = useState<"granted" | "denied" | null>(null)

  useEffect(() => {
    if (consentProp === undefined) setLocalConsent(getStoredConsent())
  }, [consentProp])

  const consent = consentProp !== undefined ? consentProp : localConsent
  const canShow = ADSTERRA_ENABLED && consent === "granted"

  useEffect(() => {
    if (!canShow) return
    const script = document.createElement("script")
    script.src = ADSTERRA_NATIVE_BANNER.src
    script.async = true
    script.setAttribute("data-cfasync", "false")
    document.getElementById(ADSTERRA_NATIVE_BANNER.containerId)?.appendChild(script)
    return () => {
      script.remove()
    }
  }, [canShow])

  if (!canShow) return null

  return <div id={ADSTERRA_NATIVE_BANNER.containerId} />
}
