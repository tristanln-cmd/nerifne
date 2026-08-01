"use client"

import { useState } from "react"

type License = {
  id: string
  key: string
  plugin: string
  customer_email: string | null
  note: string | null
  expires_at: string | null
  max_activations: number
  activation_count: number
  revoked: boolean
  created_at: string
}

export default function PluginLicenseAdminPage() {
  const [token, setToken] = useState("")
  const [unlocked, setUnlocked] = useState(false)
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [plugin, setPlugin] = useState("Madison")
  const [customerEmail, setCustomerEmail] = useState("")
  const [note, setNote] = useState("")
  const [expiresInDays, setExpiresInDays] = useState<string>("")
  const [maxActivations, setMaxActivations] = useState("1")
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)

  async function loadLicenses(t: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/plugin-license/generate", {
        headers: { "x-admin-token": t },
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load licenses")
      }
      setLicenses(data.licenses)
      setUnlocked(true)
    } catch (e: any) {
      setError(e.message)
      setUnlocked(false)
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setLastGenerated(null)
    try {
      const res = await fetch("/api/plugin-license/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({
          plugin,
          customerEmail: customerEmail || undefined,
          note: note || undefined,
          expiresInDays: expiresInDays ? Number(expiresInDays) : undefined,
          maxActivations: maxActivations ? Number(maxActivations) : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to generate key")
      }
      setLastGenerated(data.license.key)
      await loadLicenses(token)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleRevoke(key: string, revoked: boolean) {
    setError(null)
    try {
      const res = await fetch("/api/plugin-license/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ key, revoked }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update key")
      }
      await loadLicenses(token)
    } catch (e: any) {
      setError(e.message)
    }
  }

  if (!unlocked) {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
        <h1 className="mb-4 text-lg font-semibold">Plugin License Admin</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            loadLicenses(token)
          }}
          className="flex flex-col gap-3"
        >
          <input
            type="password"
            placeholder="Admin token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="rounded-md border border-border bg-card px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading || !token}
            className="rounded-md bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/25 disabled:opacity-50"
          >
            {loading ? "Checking…" : "Unlock"}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-6 text-xl font-semibold">Plugin License Admin — {plugin}</h1>

      <form onSubmit={handleGenerate} className="mb-10 grid grid-cols-2 gap-3 rounded-lg border border-border p-4">
        <label className="col-span-2 text-xs text-muted-foreground">
          Plugin name
          <input
            value={plugin}
            onChange={(e) => setPlugin(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-muted-foreground">
          Customer email (optional)
          <input
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-muted-foreground">
          Note (optional)
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-muted-foreground">
          Expires in days (blank = never)
          <input
            type="number"
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-muted-foreground">
          Max Devices (HWIDs) on this seat
          <input
            type="number"
            value={maxActivations}
            onChange={(e) => setMaxActivations(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="col-span-2 mt-2 rounded-md bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/25 disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate key"}
        </button>
        {lastGenerated && (
          <p className="col-span-2 rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
            New key: <code>{lastGenerated}</code>
          </p>
        )}
        {error && <p className="col-span-2 text-sm text-red-400">{error}</p>}
      </form>

      <h2 className="mb-3 text-sm font-medium text-muted-foreground">All licenses</h2>
      <div className="flex flex-col gap-2">
        {licenses.map((l) => (
          <div
            key={l.id}
            className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
          >
            <div>
              <code className="font-medium">{l.key}</code>
              <span className="ml-2 text-muted-foreground">{l.plugin}</span>
              {l.customer_email && <span className="ml-2 text-muted-foreground">· {l.customer_email}</span>}
              <div className="text-xs text-muted-foreground">
                {l.activation_count}/{l.max_activations} activations
                {l.expires_at ? ` · expires ${new Date(l.expires_at).toLocaleDateString()}` : " · no expiry"}
                {l.revoked && <span className="ml-1 text-red-400">· revoked</span>}
              </div>
            </div>
            <button
              onClick={() => handleRevoke(l.key, !l.revoked)}
              className="rounded-md border border-border px-2 py-1 text-xs hover:bg-secondary"
            >
              {l.revoked ? "Un-revoke" : "Revoke"}
            </button>
          </div>
        ))}
        {licenses.length === 0 && <p className="text-sm text-muted-foreground">No licenses yet.</p>}
      </div>
    </div>
  )
}