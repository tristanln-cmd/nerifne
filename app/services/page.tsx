"use client"

import Link from "next/link"
import { ParticleBackground } from "@/components/ParticleBackground"
import { Footer } from "@/components/Footer"
import { PageHeader, SectionHeading, StatusBadge } from "@/components/PageHeader"
import { Reveal } from "@/components/reveal"
import {
  HeadphonesIcon,
  ShieldCheck,
  Wrench,
  Users,
  UserCog,
  Zap,
  Sheet,
  FileText,
  Globe,
} from "lucide-react"

const services = [
  {
    category: "Support & Operations",
    items: [
      {
        icon: HeadphonesIcon,
        title: "Customer Support & Ticket Resolution",
        description:
          "End-to-end handling of support queues; from first contact to full resolution. I manage tickets efficiently, communicate clearly with users, and keep satisfaction high.",
        tags: ["Ticket management", "Live support", "Escalation handling"],
      },
      {
        icon: ShieldCheck,
        title: "Dispute Handling & Transaction Protection",
        description:
          "Experienced in mediating disputes on P2P and escrow-based platforms. I ensure both parties are treated fairly and that transactions are resolved with integrity.",
        tags: ["Dispute mediation", "Escrow support", "Transaction safety"],
      },
      {
        icon: Wrench,
        title: "Technical Troubleshooting & User Guidance",
        description:
          "Breaking down complex technical issues into clear, actionable steps. I guide users through problems patiently; whether it's software, accounts, or platform-specific workflows.",
        tags: ["Technical support", "User guidance", "Issue diagnosis"],
      },
    ],
  },
  {
    category: "Management",
    items: [
      {
        icon: Users,
        title: "Community Management",
        description:
          "Building and maintaining healthy, engaged communities. I handle moderation, foster positive culture, and act as the bridge between users and the team.",
        tags: ["Moderation", "Engagement", "Community health"],
      },
      {
        icon: UserCog,
        title: "Staff Management",
        description:
          "Overseeing staff teams: from onboarding and training to performance monitoring and day-to-day coordination. I keep teams aligned and operations running smoothly.",
        tags: ["Team coordination", "Onboarding", "Performance oversight"],
      },
    ],
  },
  {
    category: "Automation & Systems",
    items: [
      {
        icon: Zap,
        title: "Workflow Automation",
        description:
          "Identifying repetitive tasks and building automations to eliminate them. From scripts to structured workflows, I help teams save time and reduce human error.",
        tags: ["Script automation", "Process optimisation", "Efficiency"],
      },
      {
        icon: Sheet,
        title: "Accounting Spreadsheet Automation",
        description:
          "Creating intelligent spreadsheet systems that handle calculations, reporting, and data organisation automatically; reducing manual entry and improving accuracy.",
        tags: ["Excel / Google Sheets", "Formula logic", "Automated reporting"],
      },
    ],
  },
  {
    category: "Documentation",
    items: [
      {
        icon: FileText,
        title: "Technical Documentation & User Guides",
        description:
          "Writing clear, structured documentation that users and teams can actually follow. From internal SOPs to user-facing help centres, I make complex things simple.",
        tags: ["SOPs", "Help articles", "Knowledge bases"],
      },
      {
        icon: Globe,
        title: "French Accounting & Bilingual (EN/FR) Documentation",
        description:
          "Producing professional documentation in both English and French, including French accounting documents. Fully fluent in both languages.",
        tags: ["French accounting", "EN/FR bilingual", "Professional docs"],
      },
    ],
  },
]

const serviceCount = services.reduce((acc, group) => acc + group.items.length, 0)

export default function Services() {
  return (
    <main className="relative min-h-screen bg-background">
      <ParticleBackground />

      <div className="relative z-10">
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:pt-24">
          <PageHeader
            badge={<StatusBadge>{serviceCount} services offered</StatusBadge>}
            title="Services"
            description="What I offer: from frontline support and team management to automation and bilingual documentation."
          />
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex flex-col gap-12">
            {services.map((group, gi) => (
              <div key={group.category}>
                <SectionHeading title={group.category} badge={`${group.items.length}`} />
                <div className="grid gap-4 md:grid-cols-2">
                  {group.items.map((service, i) => (
                    <Reveal key={service.title} delay={(gi + i) * 0.05}>
                      <div className="flex h-full flex-col rounded-lg border-2 border-emerald-500/30 bg-card p-5 transition-colors hover:border-emerald-500/50">
                        <div className="mb-3 flex items-start gap-3">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10">
                            <service.icon className="h-4 w-4 text-emerald-400" />
                          </div>
                          <h3 className="font-semibold text-foreground">{service.title}</h3>
                        </div>
                        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                        <div className="mt-auto flex flex-wrap gap-2">
                          {service.tags.map((tag, j) => (
                            <span
                              key={j}
                              className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl items-stretch gap-4 px-4 pb-16 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-lg border border-border bg-card p-6">
              <h2 className="mb-1 text-lg font-semibold text-foreground">What I don&apos;t do</h2>
              <p className="mb-4 text-sm text-muted-foreground">To avoid any ambiguity before you reach out:</p>
              <div className="flex flex-col gap-2.5">
                {[
                  "No on-site work or physical intervention — all services are 100% remote",
                  "No hardware sales, repair, or diagnostics",
                  "No custom software development or full-stack engineering",
                  "No phone or voice support — text-based channels only",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-0.5 shrink-0 text-red-400/70">✕</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-emerald-500/30 bg-card p-6 text-center">
              <h2 className="mb-2 text-lg font-semibold text-foreground">Interested in working together?</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Reach out via the contact form or Discord and let&apos;s talk about what you need.
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
