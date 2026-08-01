"use client"

import Link from "next/link"
import { Star, Users, Ticket, Globe, Clock, HeadphonesIcon, Wrench, ShieldCheck } from "lucide-react"
import { ParticleBackground } from "@/components/ParticleBackground"
import { Footer } from "@/components/Footer"
import { Reveal, StaggerContainer, StaggerItem } from "@/components/reveal"
import { SectionHeading } from "@/components/PageHeader"
import { GlareCard } from "@/components/ui/glare-card"
import { ProfileCard } from "@/components/profile-card"
import { OPEN_TO_WORK, AVAILABILITY } from "@/lib/config"

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189z" />
    </svg>
  )
}

const featureStrip = [
  { icon: Users, title: "100,000+", description: "Users served across platforms" },
  { icon: Ticket, title: "50+/day", description: "Peak ticket volume handled" },
  { icon: Clock, title: "< 5 min", description: "Average response time" },
  {
    icon: Globe,
    title: "Languages",
    description: "Languages",
    flags: [
      ["fr", "FR"],
      ["gb", "EN"],
      ["es", "ES"],
    ] as [string, string][],
  },
]

const services = [
  {
    icon: HeadphonesIcon,
    title: "Customer Support",
    description: "Ticket management, live chat, dispute resolution, and escalation handling with a focus on satisfaction.",
  },
  {
    icon: Wrench,
    title: "Technical Troubleshooting",
    description: "Windows, remote desktop, and issue diagnosis broken down into clear, actionable steps.",
  },
  {
    icon: ShieldCheck,
    title: "Community & Staff",
    description: "Moderation, staff onboarding, performance monitoring, and building healthy, engaged communities.",
  },
]

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      <ParticleBackground />

      <div className="relative z-10">
        {/* ─── Hero ─── */}
        <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
          <div className="hidden lg:block absolute right-50 top-40">
            <ProfileCard />
          </div>
          <div className="animate-fade-in-up max-w-3xl">
            {OPEN_TO_WORK ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
                </span>
                Open to work
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
                Unavailable
              </span>
            )}

            <h1 className="mt-5 text-balance text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Professional support agent. <span className="text-primary">Performative.</span>
            </h1>
            <p className="mt-5 max-w-md text-base sm:text-lg leading-relaxed text-muted-foreground sm:mt-6">
              Mathis (Nerfine) — multi-platform support specialist with 56,000+ users served across customer
              support, technical troubleshooting, and community management.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                4.7 / 5
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-400/80">
                <Clock className="h-3.5 w-3.5" />
                {AVAILABILITY.responseTime} avg response
              </span>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                {[["fr", "FR"], ["gb", "EN"], ["es", "ES"]].map(([code, label]) => (
                  <span key={code} className="flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                    <img src={`https://flagcdn.com/20x15/${code}.png`} alt={label} width={20} height={15} className="rounded-[2px]" />
                    <span>{label}</span>
                  </span>
                ))}
              </div>
              <span>·</span>
              <a
                href="https://discord.com/users/286201707346526229"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-[#5865F2]"
              >
                <DiscordIcon className="h-4 w-4" />
                @nerfine (Mathis)
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-4">
              {OPEN_TO_WORK && (
                <Link
                  href="/contact"
                  className="rounded-lg bg-emerald-500/15 border border-emerald-500/40 px-6 py-3.5 text-sm font-semibold text-emerald-400 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(96,165,250,0.15)] active:scale-[0.97] transition-transform"
                >
                  Hire me →
                </Link>
              )}
              {[
                { href: "/services", label: "Services" },
                { href: "/positions", label: "Experience" },
                { href: "/rates", label: "Rates" },
                { href: "/reviews", label: "Reviews" },
                { href: "/now", label: "Now" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Feature strip ─── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <StaggerContainer className="grid gap-8 border-t border-border pt-12 sm:grid-cols-2 lg:grid-cols-4">
            {featureStrip.map(({ icon: Icon, title, description, flags }) => (
              <StaggerItem key={title}>
                <div className="flex items-start gap-4">
                  <Icon className="mt-0.5 h-6 w-6 shrink-0 text-muted-foreground" aria-hidden />
                  <div>
                    <h4 className="font-semibold">{title}</h4>
                    {flags ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {flags.map(([code, label]) => (
                          <span key={code} className="flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                            <img src={`https://flagcdn.com/20x15/${code}.png`} alt={label} width={20} height={15} className="rounded-[2px]" />
                            {label}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ─── Services + profile card ─── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:overflow-visible overflow-hidden">
          <div className="relative">

            <section className="py-10 sm:py-16">
              <StaggerContainer className="text-center">
                <StaggerItem>
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What I do</h2>
                </StaggerItem>
                <StaggerItem>
                  <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">
                    Comprehensive support and technical assistance to keep your platform, community, and users safe and satisfied.
                  </p>
                </StaggerItem>
              </StaggerContainer>

              <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-3">
                {services.map(({ icon: Icon, title, description }) => (
                  <StaggerItem key={title}>
                    <div className="hover-scale">
                      <GlareCard className="flex flex-col items-center justify-center p-8 h-full">
                        <Icon className="h-12 w-12 text-white" aria-hidden />
                        <p className="text-white font-bold text-xl mt-4">{title}</p>
                        <p className="text-white/70 text-sm mt-2 text-center">{description}</p>
                      </GlareCard>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>            </section>
            <div className="lg:hidden flex justify-center mt-8">
              <ProfileCard />
            </div>
          </div>
        </div>

        {/* ─── Content ─── */}
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="flex flex-col gap-4">

            {/* Currently working on + Available for hire */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Reveal>
                <section className="h-full rounded-lg border border-border bg-card p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground">Currently working on</h2>
                    <Link href="/now" className="text-xs text-emerald-400/70 hover:text-emerald-400 transition-colors">See /now →</Link>
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <p>Holding 4 concurrent roles across support, community, and general management.</p>
                    <p>Building reusable documentation templates and automation scripts for faster client onboarding.</p>
                  </div>
                </section>
              </Reveal>

              {OPEN_TO_WORK && (
                <Reveal>
                  <section className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
                    <p className="mb-1 text-lg font-semibold text-foreground">Available for hire</p>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Looking for a dedicated support specialist? Let&apos;s talk about what you need.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-6 py-2.5 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/25"
                    >
                      Hire me →
                    </Link>
                  </section>
                </Reveal>
              )}
            </div>

            {/* Career timeline + Licenses & Certifications */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Reveal>
                <section className="h-full">
                  <h2 className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">Career timeline</h2>
                  <div className="rounded-lg border border-border bg-card divide-y divide-border">
                    {[
                      { period: "Jun 2026 – Present", company: "Bloxflip", role: "Moderator", active: true },
                      { period: "Mar 2026 – Present", company: "Madium", role: "General Manager", active: true },
                      { period: "Apr 2026 – Present", company: "GCkeys", role: "Support Agent", active: true },
                      { period: "Oct 2025 – Present", company: "RoStake", role: "Staff Team Member", active: true },
                      { period: "Jul 2025 – Oct 2025", company: "Bunni.lol", role: "Admin Support & Volunteer Technician", active: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5">
                        <div className={`h-2 w-2 shrink-0 rounded-full ${item.active ? "bg-emerald-400" : "bg-muted-foreground/30"}`} />
                        <span className="w-24 shrink-0 text-[11px] text-muted-foreground/60 tabular-nums sm:w-32">{item.period}</span>
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-foreground">{item.role}</span>
                          <span className="text-xs text-emerald-400/80">{item.company}</span>
                        </div>
                        {item.active && (
                          <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">Active</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <Link href="/positions" className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Full details on positions page →
                  </Link>
                </section>
              </Reveal>

              <Reveal>
                <section className="h-full">
                  <h2 className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">Licenses & Certifications</h2>
                  <div className="rounded-lg border border-border bg-card divide-y divide-border">
                    {[
                      {
                        title: "Certified Top Candidate",
                        issuer: "Resumelyn",
                        issued: "May 2026",
                        credentialId: "RML-2026-TOP5",
                        credentialUrl: "https://resumelyn.com",
                      },
                    ].map((cert, i) => (
                      <div key={i} className="flex items-start gap-4 px-5 py-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/5">
                          <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="6" />
                            <path d="M8 14l-2 7 6-3 6 3-2-7" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground">{cert.title}</p>
                          <p className="text-xs text-emerald-400/80">{cert.issuer}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Issued {cert.issued} · Credential ID {cert.credentialId}
                          </p>
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                          >
                            Show credential
                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            </div>

            {/* Case Studies + Languages */}
            <div className="grid gap-4 lg:grid-cols-3">
              <Reveal className="lg:col-span-2">
                <section className="h-full">
                  <h2 className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">Case Studies</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        company: "Bunni.lol",
                        headline: "40% faster resolution through automation",
                        description: "Wrote batch scripts to automate the most repetitive troubleshooting steps across a 50,000+ user platform. Combined with structured documentation, average resolution time dropped by 40%.",
                        metrics: ["50,000+ users", "40% faster resolution", "15+ volunteers onboarded"],
                      },
                      {
                        company: "RoStake",
                        headline: "95% satisfaction across 40,000+ users",
                        description: "Managed first-contact support for a high-volume platform, independently resolving 80% of tickets with <5 min average response time. Documented pain points into actionable product feedback.",
                        metrics: ["40,000+ users", "95% satisfaction rate", "80% independent resolution"],
                      },
                      {
                        company: "Madium",
                        headline: "Full operations lead across support, staff & community",
                        description: "Took over as General Manager across all departments — built onboarding processes, standardised escalation workflows, and aligned the team around shared standards.",
                        metrics: ["Multi-department oversight", "Staff onboarding", "Escalation frameworks"],
                      },
                    ].map((cs, i) => (
                      <div key={i} className={`rounded-lg border border-border bg-card p-5 ${i === 2 ? "sm:col-span-2" : ""}`}>
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/70 mb-0.5">{cs.company}</p>
                            <h3 className="font-semibold text-foreground">{cs.headline}</h3>
                          </div>
                        </div>
                        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{cs.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {cs.metrics.map((m) => (
                            <span key={m} className="rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-xs text-emerald-400/80">{m}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>

              <Reveal>
                <section className="h-full">
                  <h2 className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">Languages</h2>
                  <div className="flex flex-col gap-4">
                    {[
                      {
                        lang: "French",
                        code: "fr",
                        tag: "FR",
                        label: "Native",
                        pct: 100,
                        gradient: "linear-gradient(90deg, #0055A4 0%, #FFFFFF 50%, #EF4135 100%)",
                        glow: "0 0 12px rgba(239, 65, 53, 0.35)",
                      },
                      {
                        lang: "English",
                        code: "gb",
                        tag: "EN",
                        label: "Fluent",
                        pct: 90,
                        gradient: "linear-gradient(90deg, #012169 0%, #FFFFFF 50%, #C8102E 100%)",
                        glow: "0 0 12px rgba(200, 16, 46, 0.35)",
                      },
                      {
                        lang: "Spanish",
                        code: "es",
                        tag: "ES",
                        label: "Basic",
                        pct: 30,
                        gradient: "linear-gradient(90deg, #AA151B 0%, #F1BF00 50%, #AA151B 100%)",
                        glow: "0 0 12px rgba(241, 191, 0, 0.35)",
                      },
                    ].map(({ lang, code, tag, pct, label, gradient, glow }) => (
                      <div key={lang} className="rounded-lg border border-border bg-card px-5 py-4">
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground flex items-center gap-2">
                            <span className="flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                              <img src={`https://flagcdn.com/20x15/${code}.png`} alt={lang} width={20} height={15} className="rounded-[2px]" />
                              {tag}
                            </span>
                            {lang}
                          </span>
                          <span className="text-xs text-muted-foreground">{label}</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, background: gradient, boxShadow: glow }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            </div>

          <Reveal>
            <section>
              <h2 className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">Skills & Tools</h2>
              <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                <div className="grid gap-6 sm:grid-cols-2">
                {[
                  {
                    category: "Moderation (Bloxlfip)",
                    items: ["Report Review", "Rule Enforcement", "Ban Appeals", "Team Coordination"],
                  },
                  {
                    category: "Customer Support",
                    items: ["Ticket Management", "Live Chat", "Dispute Resolution", "Escalation Handling", "Escrow Support"],
                  },
                  {
                    category: "Community & Staff",
                    items: ["Team Coordination", "Staff Onboarding", "Moderation", "Performance Monitoring", "Community Engagement"],
                  },
                  {
                    category: "Technical Support",
                    items: ["Windows Troubleshooting", "Remote Desktop", "Issue Diagnosis"],
                  },
                  {
                    category: "Documentation",
                    items: ["SOPs", "Help Articles", "Knowledge Bases", "User Guides", "EN/FR Bilingual Docs"],
                  },
                  {
                    category: "Tools & Software",
                    items: ["GitHub", "Markdown", "Excel / Google Sheets", "Ticketing Systems", "Discord"],
                  },
                ].map(({ category, items }) => (
                  <div key={category}>
                    <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">{category}</p>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <span
                          key={item}
                          className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </section>
          </Reveal>

          {/* Reviews + FAQ CTAs */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal>
              <section className="flex h-full flex-col items-center justify-between gap-4 rounded-lg border border-border bg-card p-5 text-center sm:flex-row sm:text-left">
                <div>
                  <p className="mb-1 flex items-center justify-center gap-1.5 font-medium text-foreground sm:justify-start">
                    <Star className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                    4.7 / 5 — featured reviews &amp; community feedback
                  </p>
                  <p className="text-sm text-muted-foreground">What clients and teammates say about working with me.</p>
                </div>
                <Link
                  href="/reviews"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
                >
                  Read reviews →
                </Link>
              </section>
            </Reveal>

            <Reveal>
              <section className="flex h-full flex-col items-center justify-between gap-4 rounded-lg border border-border bg-card p-5 text-center sm:flex-row sm:text-left">
                <div>
                  <p className="mb-1 font-medium text-foreground">Have questions?</p>
                  <p className="text-sm text-muted-foreground">Check the FAQ for answers about availability, rates, and how I work.</p>
                </div>
                <Link
                  href="/faq"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
                >
                  View FAQ →
                </Link>
              </section>
            </Reveal>
          </div>

          <Footer />
          </div>
        </div>
      </div>
    </main>
  )
}
