"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { ParticleBackground } from "@/components/ParticleBackground"
import { Footer } from "@/components/Footer"
import { PageHeader, StatusBadge } from "@/components/PageHeader"
import { Reveal } from "@/components/reveal"
import { OPEN_TO_WORK } from "@/lib/config"

const faqs: { category: string; items: { q: string; a: string }[] }[] = [
  {
    category: "Availability",
    items: [
      {
        q: "Are you currently open to new positions?",
        a: OPEN_TO_WORK
          ? "Yes. I'm currently open to new support roles or contracts. The best way to reach me is via Discord (@nerfine) (slower responses) or through the contact form. I typically respond within a few hours."
          : "I'm not currently taking on new positions, but feel free to reach out via Discord (@nerfine) or the contact form in case something changes soon.",
      },
      {
        q: "What timezone are you in?",
        a: "I'm based in France and operate on CST/UTC-6 . I'm flexible on hours and have experience working across different time zones.",
      },
      {
        q: "Do you work weekends?",
        a: "Yes. I currently hold multiple concurrent roles and am active across the week including weekends. Availability can be discussed based on the role's needs.",
      },
      {
        q: "Can you work full-time?",
        a: "I operate as a registered sole trader (Micro-Entreprise) and can take on long-term contracts or full-time-equivalent remote positions. I'm fully set up to invoice legally.",
      },
    ],
  },
  {
    category: "Services & Work",
    items: [
      {
        q: "What platforms and tools do you support?",
        a: "I work across Discord-based communities, ticketing systems, live chat, and email. I'm comfortable with most support stacks, if you use something specific, just ask.",
      },
      {
        q: "Do you do on-site work or hardware repair?",
        a: "No, all my services are performed exclusively remotely. I don't do physical repairs, on-site intervention, or hardware sales.",
      },
      {
        q: "Can you write documentation or SOPs?",
        a: "Yes, this is one of my core services. I've authored help articles, knowledge bases, onboarding guides, and bilingual (EN/FR) technical documents. I can also standardise existing processes into written SOPs.",
      },
      {
        q: "Can you manage a support team, not just work in one?",
        a: "Yes. I currently serve as General Manager at Madium, overseeing support, community, and staff operations across departments, including onboarding, escalations, and performance monitoring.",
      },
    ],
  },
  {
    category: "Rates & Legal",
    items: [
      {
        q: "What are your rates?",
        a: "Rates depend on the scope and type of engagement. I'm open to discussing per-hour, monthly retainer, or project-based arrangements. Reach out via the contact form or Discord to discuss.",
      },
      {
        q: "Are you legally set up to invoice?",
        a: "Yes. I'm a registered Entrepreneur Individuel (Micro-Entreprise) in France — SIREN 989 428 099, APE 8211Z. I can issue proper invoices for any engagement.",
      },
      {
        q: "What languages do you work in?",
        a: "French is my native language, English is fluent (all my professional roles are conducted in English), and I have basic Spanish. I can write documentation and handle support in both French and English.",
      },
    ],
  },
  {
    category: "Getting Started",
    items: [
      {
        q: "How do I hire you?",
        a: "The fastest way is through contact form. Tell me about the role, platform, expected volume, and we'll go from there.",
      },
      {
        q: "How quickly do you respond to enquiries?",
        a: "Usually within a few hours on Mail. For contact form submissions, within 24 hours at most.",
      },
    ],
  },
]

const faqCount = faqs.reduce((acc, group) => acc + group.items.length, 0)

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-foreground transition-colors hover:text-emerald-400"
      >
        <span>{q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${open ? "max-h-96 pb-4" : "max-h-0"}`}
      >
        <p className="text-sm leading-relaxed text-muted-foreground">{a}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  return (
    <main className="relative min-h-screen bg-background">
      <ParticleBackground />

      <div className="relative z-10">
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:pt-24">
          <PageHeader
            badge={<StatusBadge>{faqCount} answers</StatusBadge>}
            title="FAQ"
            description="Common questions about availability, services, rates, and how to get started."
          />
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid gap-4 lg:grid-cols-2">
            {faqs.map(({ category, items }, gi) => (
              <Reveal key={category} delay={gi * 0.05}>
                <div className="h-full rounded-lg border border-border bg-card">
                  <p className="px-5 pt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                    {category}
                  </p>
                  <div className="px-5">
                    {items.map(({ q, a }) => (
                      <AccordionItem key={q} q={q} a={a} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <Reveal>
            <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-emerald-500/20 bg-card p-6 text-center sm:flex-row sm:text-left">
              <div>
                <p className="mb-1 font-medium text-foreground">Didn&apos;t find your answer?</p>
                <p className="text-sm text-muted-foreground">Reach out directly — I reply fast.</p>
              </div>
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

          <div className="mt-12">
            <Footer />
          </div>
        </section>
      </div>
    </main>
  )
}
