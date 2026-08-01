"use client"

import Link from "next/link"
import { Clock, RefreshCw, Wrench, Check } from "lucide-react"
import { ParticleBackground } from "@/components/ParticleBackground"
import { Footer } from "@/components/Footer"
import { PageHeader, StatusBadge } from "@/components/PageHeader"
import { Reveal } from "@/components/reveal"

const engagements = [
  {
    icon: Clock,
    title: "Hourly",
    tagline: "Pay as you go",
    description: "Best for one-off tasks, short bursts of support, or trying things out before committing.",
    includes: [
      "Ticket handling or live support",
      "Technical troubleshooting sessions",
      "Documentation writing",
      "Automation scripting",
    ],
    note: "Minimum 1 hour per session. Invoiced after delivery.",
    cta: "Ask for my rate →",
  },
  {
    icon: RefreshCw,
    title: "Monthly retainer",
    tagline: "Ongoing partnership",
    description: "Best for platforms that need a reliable, always-available support presence every month.",
    includes: [
      "Agreed weekly availability",
      "Ticket & community management",
      "Staff oversight if needed",
      "Monthly invoice (Micro-Entreprise)",
    ],
    note: "Rates depend on volume and scope. Discounts for longer commitments.",
    cta: "Discuss a retainer →",
    highlight: true,
  },
  {
    icon: Wrench,
    title: "Project-based",
    tagline: "Scoped deliverable",
    description: "Best for a defined output: a knowledge base, a set of SOPs, an automation script.",
    includes: [
      "Fixed price agreed upfront",
      "Clear scope & deliverables",
      "EN/FR bilingual if needed",
      "Revisions included",
    ],
    note: "Quote provided after a short brief. No surprises.",
    cta: "Get a quote →",
  },
]

const notes = [
  "All rates are in EUR and exclude any applicable taxes.",
  "I'm a registered Entrepreneur Individuel (SIREN 989 428 099) — proper invoices issued for every engagement.",
  "I don't publicly list exact rates because scope varies widely. Reach out and I'll give you a clear number quickly.",
  "Trial periods or paid test tasks are welcome — I'd rather prove value first.",
]

export default function Rates() {
  return (
    <main className="relative min-h-screen bg-background">
      <ParticleBackground />

      <div className="relative z-10">
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:pt-24">
          <PageHeader
            badge={<StatusBadge>3 ways to work together</StatusBadge>}
            title="Rates"
            description="Three ways to work together — pick the one that fits your needs."
          />
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {engagements.map(({ icon: Icon, title, tagline, description, includes, note, cta, highlight }, i) => (
              <Reveal key={title} delay={i * 0.05} className="h-full">
                <div
                  className={`flex h-full flex-col rounded-lg p-5 ${
                    highlight
                      ? "border-2 border-emerald-500/40 bg-emerald-500/5"
                      : "border border-border bg-card"
                  }`}
                >
                  {highlight && (
                    <span className="mb-3 self-start rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      Most common
                    </span>
                  )}
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10">
                    <Icon className="h-4 w-4 text-emerald-400" />
                  </div>
                  <h2 className="mb-0.5 font-semibold text-foreground">{title}</h2>
                  <p className="mb-3 text-xs text-emerald-400/80">{tagline}</p>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{description}</p>
                  <ul className="mb-4 flex flex-col gap-2">
                    {includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400/70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mb-4 mt-auto text-xs italic text-muted-foreground/60">{note}</p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
                  >
                    {cta}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl items-stretch gap-4 px-4 pb-16 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-sm font-semibold text-foreground">Good to know</h2>
              <ul className="flex flex-col gap-3">
                {notes.map((note) => (
                  <li key={note} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/50" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-emerald-500/30 bg-card p-6 text-center">
              <h2 className="mb-2 text-lg font-semibold text-foreground">Ready to talk numbers?</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Tell me what you need and I&apos;ll come back with a clear proposal.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
                >
                  Contact form →
                </Link>
                <a
                  href="https://discord.com/users/286201707346526229"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Discord @nerfine →
                </a>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-2">
            <Footer />
          </div>
        </section>
      </div>
    </main>
  )
}
