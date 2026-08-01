"use client"

import { useEffect, useState } from "react"
import { ADSTERRA_ENABLED } from "@/lib/config"
import { getStoredConsent } from "./CookieConsent"

/**
 * Renders one Adsterra "Banner" ad unit.
 *
 * Adsterra's banner snippet sets a global `window.atOptions` before loading
 * invoke.js. If you render more than one banner on the same page, each
 * mount overwrites the last one's atOptions and only the final ad loads.
 * We sidestep that by giving each banner its own iframe (srcDoc), so each
 * one gets its own isolated `window`.
 */
export default function AdsterraBanner({
  adKey,
  width,
  height,
  consent: consentProp,
}: {
  adKey?: string
  width: number
  height: number
  consent?: "granted" | "denied" | null
}) {
  const [mounted, setMounted] = useState(false)
  const [localConsent, setLocalConsent] = useState<"granted" | "denied" | null>(null)

  useEffect(() => {
    setMounted(true)
    if (consentProp === undefined) setLocalConsent(getStoredConsent())
  }, [consentProp])

  const consent = consentProp !== undefined ? consentProp : localConsent
  const canShow = mounted && ADSTERRA_ENABLED && !!adKey && consent === "granted"

  if (!canShow) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: width,
          height,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed rgba(255,255,255,0.1)",
          borderRadius: 10,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
          {consent === "denied" ? "Ads disabled (cookie preference)" : "Ad slot"}
        </span>
      </div>
    )
  }

  const atOptions = { key: adKey, format: "iframe", height, width, params: {} }
  const srcDoc = `<!DOCTYPE html><html><head><style>html,body{margin:0;padding:0;overflow:hidden}</style></head><body>
<script type="text/javascript">atOptions = ${JSON.stringify(atOptions)};</script>
<script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script>
</body></html>`

  return (
    <iframe
      title="advertisement"
      srcDoc={srcDoc}
      width={width}
      height={height}
      scrolling="no"
      style={{ border: "none", display: "block", margin: "0 auto", maxWidth: "100%" }}
    />
  )
}
