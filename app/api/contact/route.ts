import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 60_000
const MAX_REQUESTS = 3
const MIN_ELAPSED_MS = 2000
const MAX_NAME = 80
const MAX_SUBJECT = 120
const MAX_MESSAGE = 2000

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  )
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= MAX_REQUESTS) return false
  entry.count++
  return true
}

function sanitize(value: unknown): string {
  if (typeof value !== "string") return ""
  return value.replace(/[<>]/g, "").trim()
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

function detectIntent(subject: string): string {
  const text = subject.toLowerCase()
  const keywords: Record<string, string[]> = {
    support: ["help","issue","problem","bug","error","broken","not working","support","fix","crash","ticket","trouble","failed","unable","can't","cannot","refund","complaint"],
    sales: ["buy","purchase","order","interested","demo","trial","sign up","onboard","get started","upgrade","plan","subscribe","subscription","sales","product","features"],
    pricing: ["price","pricing","cost","quote","quotation","invoice","contract","proposal","budget","rates","fee","fees","charge","billing","enterprise","discount"],
    contact: ["hello","hi","hey","greetings","enquiry","inquiry","question","information","more info","learn more","partnership","collaborate","press","media","general"],
  }
  const scores = Object.entries(keywords).map(([intent, kws]) => ({
    intent,
    score: kws.filter(kw => text.includes(kw)).length,
  }))
  const top = scores.sort((a, b) => b.score - a.score)[0]
  return top.score > 0 ? top.intent : "fallback"
}

function buildAutoReplyHtml(name: string, intent: string, subject: string): { replySubject: string; html: string } {
  const templates: Record<string, { color: string; title: string; body: string; sla: string }> = {
    support: { color: "#4F46E5", title: "We've received your support request", body: "Thank you for reaching out. nerfine will get back to you", sla: "within 24 hours" },
    sales:   { color: "#059669", title: "Thanks for your interest!", body: "I'm excited about the possibility of working together. nerfine will be in touch", sla: "within 4 business hours" },
    pricing: { color: "#D97706", title: "Pricing & contract enquiry received", body: "Thank you for your enquiry. I'll prepare a tailored quote and reach out", sla: "within 24 hours" },
    contact: { color: "#0EA5E9", title: "Thanks for getting in touch!", body: "I have received your message and will get back to you", sla: "within 1–2 business days" },
    fallback:{ color: "#6B7280", title: "Message received", body: "Thank you for reaching out. I have received your email and will respond", sla: "as soon as possible" },
  }
  const t = templates[intent] ?? templates.fallback
  const replySubject = intent === "support"
    ? `Re: ${subject} — Support Request Received`
    : intent === "sales"
    ? `Re: ${subject} — Thanks for Your Interest`
    : intent === "pricing"
    ? `Re: ${subject} — Pricing & Contract Info`
    : `Re: ${subject} — We Got Your Message`

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;">
<tr><td style="background:${t.color};padding:28px 36px;"><p style="margin:0;color:#fff;font-size:20px;font-weight:600;">MDL Digital Support</p></td></tr>
<tr><td style="padding:36px;">
<h1 style="margin:0 0 16px;font-size:22px;color:#111;">${t.title}</h1>
<p style="margin:0 0 12px;color:#444;line-height:1.6;">Hi ${name},</p>
<p style="margin:0 0 24px;color:#444;line-height:1.6;">${t.body} <strong>${t.sla}</strong>.</p>
<a href="https://nerfine.xyz/" style="display:inline-block;background:${t.color};color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px;">Visit Our Website</a>
<hr style="margin:36px 0;border:none;border-top:1px solid #eee;">
<p style="margin:0;color:#888;font-size:13px;">MDL Digital Support · <a href="https://nerfine.xyz/" style="color:${t.color};">https://nerfine.xyz/</a></p>
</td></tr>
</table></td></tr></table>
</body></html>`

  return { replySubject, html }
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Server misconfiguration: missing API key." }, { status: 500 })
    }

    const resend = new Resend(apiKey)
    const ip = getIp(req)

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before sending another message." },
        { status: 429 }
      )
    }

    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
    }

    const loadTime = typeof body._t === "number" ? body._t : 0
    if (Date.now() - loadTime < MIN_ELAPSED_MS) {
      return NextResponse.json({ error: "Submission too fast." }, { status: 400 })
    }

    const name = sanitize(body.name)
    const email = sanitize(body.email)
    const subject = sanitize(body.subject)
    const message = sanitize(body.message)

    if (!name || name.length > MAX_NAME)
      return NextResponse.json({ error: "Name must be between 1 and 80 characters." }, { status: 400 })
    if (!email || !isValidEmail(email))
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
    if (!subject || subject.length > MAX_SUBJECT)
      return NextResponse.json({ error: "Subject must be between 1 and 120 characters." }, { status: 400 })
    if (!message || message.length < 10 || message.length > MAX_MESSAGE)
      return NextResponse.json({ error: "Message must be between 10 and 2000 characters." }, { status: 400 })

    const intent = detectIntent(subject)
    const { replySubject, html: autoReplyHtml } = buildAutoReplyHtml(name, intent, subject)

    const notify = await resend.emails.send({
      from: "contact@nerfine.xyz",
      to: "hello@nerfine.xyz",
      replyTo: email,
      subject: `[${intent.charAt(0).toUpperCase() + intent.slice(1)}] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><hr /><p>${message.replace(/\n/g, "<br>")}</p>`,
    })

    if (notify.error) {
      console.error("Resend notify error:", JSON.stringify(notify.error))
      return NextResponse.json(
        { error: `Send failed: ${notify.error.message}` },
        { status: 500 }
      )
    }

    resend.emails.send({
      from: "noreply@nerfine.xyz",
      to: email,
      subject: replySubject,
      html: autoReplyHtml,
    }).catch((err: unknown) => console.error("Auto-reply failed (non-fatal):", err))

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("Contact route crash:", message)
    return NextResponse.json({ error: `Server error: ${message}` }, { status: 500 })
  }
}
