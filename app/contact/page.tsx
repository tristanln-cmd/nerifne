"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  Send, CheckCircle, AlertCircle, Loader2, ChevronDown, Mail, MessageSquare, Timer, Globe,
} from "lucide-react"
import { ParticleBackground } from "@/components/ParticleBackground"
import { Footer } from "@/components/Footer"
import { PageHeader, StatusBadge } from "@/components/PageHeader"
import { Reveal } from "@/components/reveal"
import { showToast } from "@/components/Toast"
import { AVAILABILITY } from "@/lib/config"

const COOLDOWN_MS = 60_000
const MAX_NAME    = 80
const MAX_SUBJECT = 120
const MAX_MESSAGE = 2000

function sanitize(v: string) { return v.replace(/[<>]/g, "").trim() }
function isValidEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) }

type Status = "idle" | "loading" | "success" | "error"

const inputBase = "w-full rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors disabled:opacity-50"
const selectBase = "w-full appearance-none rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground outline-none transition-colors disabled:opacity-50"
const focusGreen = "focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
const inputGreen = `${inputBase} ${focusGreen}`
const selectGreen = `${selectBase} ${focusGreen}`

const DiscordIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
)

export default function ContactPage() {
  const [name,    setName]    = useState("")
  const [email,   setEmail]   = useState("")
  const [message, setMessage] = useState("")
  const [honeypot, setHoneypot] = useState("")

  const [inquiryType, setInquiryType] = useState("")
  const [subject,     setSubject]     = useState("")

  const [status,       setStatus]       = useState<Status>("idle")
  const [errorMsg,     setErrorMsg]     = useState("")
  const [cooldownLeft, setCooldownLeft] = useState(0)
  const loadTimeRef = useRef(Date.now())
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const startCooldown = () => {
    const end = Date.now() + COOLDOWN_MS
    setCooldownLeft(Math.ceil(COOLDOWN_MS / 1000))
    timerRef.current = setInterval(() => {
      const remaining = Math.ceil((end - Date.now()) / 1000)
      if (remaining <= 0) { clearInterval(timerRef.current!); setCooldownLeft(0) }
      else setCooldownLeft(remaining)
    }, 500)
  }

  const handleSubmit = async () => {
    if (honeypot) return
    const elapsed = Date.now() - loadTimeRef.current
    if (elapsed < 2500) { setStatus("error"); setErrorMsg("Please take a moment to fill out the form."); return }
    if (cooldownLeft > 0) { setStatus("error"); setErrorMsg(`Please wait ${cooldownLeft}s before sending another message.`); return }

    const cleanName    = sanitize(name)
    const cleanEmail   = sanitize(email)
    const cleanMessage = sanitize(message)
    const cleanSubject = sanitize(subject)

    if (!cleanName || cleanName.length > MAX_NAME) { setStatus("error"); setErrorMsg("Name must be between 1 and 80 characters."); return }
    if (!cleanEmail || !isValidEmail(cleanEmail))   { setStatus("error"); setErrorMsg("Please enter a valid email address."); return }
    if (!cleanSubject || cleanSubject.length > MAX_SUBJECT) { setStatus("error"); setErrorMsg("Subject must be between 1 and 120 characters."); return }
    if (!cleanMessage || cleanMessage.length < 10 || cleanMessage.length > MAX_MESSAGE) {
      setStatus("error"); setErrorMsg("Message must be between 10 and 2,000 characters."); return
    }

    const body: Record<string, unknown> = {
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      subject: cleanSubject,
      inquiryType: inquiryType || "Not specified",
      _t: loadTimeRef.current,
    }

    setStatus("loading")
    setErrorMsg("")

    try {
      const res  = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const data = await res.json()

      if (!res.ok) {
        const msg = data.error ?? "Something went wrong. Please try again."
        setStatus("error"); setErrorMsg(msg); showToast("error", msg)
        if (res.status === 429) startCooldown()
      } else {
        setStatus("success"); showToast("success", "Message sent!")
        setName(""); setEmail(""); setMessage(""); setSubject(""); setInquiryType("")
        loadTimeRef.current = Date.now()
        startCooldown()
      }
    } catch {
      const msg = "Network error. Please check your connection."
      setStatus("error"); setErrorMsg(msg); showToast("error", msg)
    }
  }

  const isDisabled = status === "loading" || cooldownLeft > 0

  const info = [
    {
      icon: DiscordIcon,
      label: "Discord",
      value: "@nerfine (Mathis)",
      href: "https://discord.com/users/286201707346526229",
    },
    {
      icon: Mail,
      label: "Email",
      value: "contact@nerfine.xyz",
      href: "mailto:contact@nerfine.xyz",
    },
    {
      icon: Timer,
      label: "Response time",
      value: `${AVAILABILITY.responseTime} avg — form replies within 24h`,
    },
    {
      icon: Globe,
      label: "Timezone",
      value: AVAILABILITY.timezone,
    },
  ]

  return (
    <main className="relative min-h-screen bg-background">
      <ParticleBackground />

      <div className="relative z-10">
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:pt-24">
          <PageHeader
            badge={<StatusBadge>Replies within 24h</StatusBadge>}
            title="Contact"
            description="Get in touch — I usually reply within a day or two. Tell me about the role or project and I'll get back to you quickly."
          />
        </section>

        <section className="mx-auto grid max-w-7xl items-start gap-4 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_340px]">
          <Reveal>
            <div className="rounded-xl border-2 border-emerald-500/30 bg-card p-6 sm:p-8">
              <div className="flex flex-col gap-5">

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Name <span className="text-emerald-400">*</span></label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} maxLength={MAX_NAME} placeholder="Your name" disabled={isDisabled} className={inputGreen} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Email <span className="text-emerald-400">*</span></label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" disabled={isDisabled} className={inputGreen} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="relative flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Inquiry type</label>
                    <select value={inquiryType} onChange={e => setInquiryType(e.target.value)} disabled={isDisabled} className={selectGreen}>
                      <option value="">Select a type…</option>
                      <option>Support role</option><option>Management role</option>
                      <option>Documentation</option><option>Automation</option><option>Other</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 bottom-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Subject <span className="text-emerald-400">*</span></label>
                    <input type="text" value={subject} onChange={e => setSubject(e.target.value)} maxLength={MAX_SUBJECT} placeholder="What is this about?" disabled={isDisabled} className={inputGreen} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Message <span className="text-emerald-400">*</span></label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} maxLength={MAX_MESSAGE} rows={5} placeholder="Write your message here..." disabled={isDisabled} className={`resize-none ${inputGreen}`} />
                  <span className="self-end text-xs text-muted-foreground/50">{message.length}/{MAX_MESSAGE}</span>
                </div>

                <input type="text" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} aria-hidden="true" autoComplete="off" style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} />

                {status === "error" && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{errorMsg}
                  </div>
                )}
                {status === "success" && (
                  <div className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />Message sent! I'll get back to you soon.
                  </div>
                )}

                <button
                  onClick={handleSubmit} disabled={isDisabled}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-2.5 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {cooldownLeft > 0 ? `Wait ${cooldownLeft}s` : status === "loading" ? "Sending…" : "Send Message"}
                </button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-4">
              {info.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="rounded-lg border border-border bg-card p-5">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                    <Icon />
                    {label}
                  </div>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm font-medium text-foreground transition-colors hover:text-emerald-400"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-foreground">{value}</p>
                  )}
                </div>
              ))}

              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5 text-sm text-muted-foreground">
                <p className="mb-1 font-medium text-foreground">Prefer Discord?</p>
                <p>
                  Ping me at <span className="text-emerald-400">@nerfine</span> — faster for quick questions.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <Footer />
        </section>
      </div>
    </main>
  )
}
