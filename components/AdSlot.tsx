"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { ADS_ENABLED, ADSENSE_PUBLISHER_ID } from "@/lib/config"
import { getStoredConsent } from "./CookieConsent"

export default function AdSlot({
  slotId,
  minHeight = 250,
  consent: consentProp,
}: {
  slotId?: string
  minHeight?: number
  consent?: "granted" | "denied" | null
}) {
  const [mounted, setMounted] = useState(false)
  const [localConsent, setLocalConsent] = useState<"granted" | "denied" | null>(null)

  useEffect(() => {
    setMounted(true)
    if (consentProp === undefined) setLocalConsent(getStoredConsent())
  }, [consentProp])

  const consent = consentProp !== undefined ? consentProp : localConsent
  const canShow = mounted && ADS_ENABLED && !!ADSENSE_PUBLISHER_ID && !!slotId && consent === "granted"

  return (
    <div
      style={{
        minHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px dashed rgba(255,255,255,0.1)",
        borderRadius: 10,
        background: "rgba(255,255,255,0.02)",
        overflow: "hidden",
      }}
    >
      {canShow ? (
        <>
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", minHeight }}
            data-ad-client={ADSENSE_PUBLISHER_ID}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          <Script id={`adsbygoogle-init-${slotId}`} strategy="afterInteractive">
            {`(window.adsbygoogle=window.adsbygoogle||[]).push({});`}
          </Script>
        </>
      ) : (
        <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
          {consent === "denied" ? "Ads disabled (cookie preference)" : "Ad slot"}
        </span>
      )}
    </div>
  )
}
