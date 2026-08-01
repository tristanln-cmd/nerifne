"use client"

import type React from "react"
import { Briefcase, Users, HeadphonesIcon, ShieldCheck, Lock, Clock } from "lucide-react"
import { ParticleBackground } from "@/components/ParticleBackground"
import { Footer } from "@/components/Footer"
import { PageHeader, SectionHeading, StatusBadge } from "@/components/PageHeader"
import { Reveal } from "@/components/reveal"

const currentPositions = [
  {
    company: "Bloxflip",
    role: "Moderator",
    type: "Paid · Part-Time · Remote",
    period: "June 2026 – Present",
    description: "Moderating community spaces for Bloxlfip, handling reports and enforcing community guidelines.",
    bullets: [
      "Review user reports and take appropriate action in line with community guidelines.",
      "Act as a trusted point of contact for members needing assistance or clarification on rules.",
      "Collaborate with the wider moderation team to keep the community safe and welcoming.",
    ],
    highlights: [
      { icon: ShieldCheck, text: "Community moderation" },
      { icon: Users, text: "Report handling" },
      { icon: Briefcase, text: "Rule enforcement" },
    ],
    companyDesc: null,
  },
  {
    company: "GCkeys",
    role: "Support Agent",
    type: "Paid · Part-Time · Remote",
    period: "April 2026 – Present",
    description: "Providing dedicated customer support for a digital products storefront specialising in executor licenses, game utilities, and digital keys — trusted by over 8,000 customers.",
    bullets: [
      "Handle support tickets and resolve customer issues, ensuring satisfaction with instant-delivery products.",
      "Verify product safety and key authenticity, acting as a trusted point of contact for all customer queries.",
      "Uphold GCkeys' core values of clear pricing and fast delivery by maintaining transparent, no-delay support.",
    ],
    highlights: [
      { icon: HeadphonesIcon, text: "Customer ticket resolution" },
      { icon: ShieldCheck, text: "Key verification & safety" },
      { icon: Briefcase, text: "8,000+ customers served" },
    ],
    companyDesc: "Built small, kept sharp — a bootstrapped storefront trusted by 8,000+ customers for executor licenses, game utilities, and digital keys with instant delivery.",
  },
  {
    company: "Madium",
    role: "General Manager · Support Manager · Community & Staff Management",
    type: "Paid · Full-Time · Remote",
    period: "March 2026 – Present",
    description: "Wearing multiple hats across the organisation. Overseeing support operations, managing community interactions, and leading the staff team.",
    bullets: [
      "Keep the team aligned and handle escalations, ensuring smooth day-to-day operations.",
      "Manage community engagement and maintain a healthy, positive environment.",
      "Oversee staff performance and support workflows across all departments.",
    ],
    highlights: [
      { icon: Users, text: "Community & staff management" },
      { icon: HeadphonesIcon, text: "Support team oversight" },
      { icon: Briefcase, text: "Operations & escalation handling" },
    ],
    companyDesc: null,
  },
  {
    company: "RoStake",
    role: "Staff Team Member",
    type: "Paid · Part-Time · Remote",
    period: "October 2025 – Present",
    description: "Paid role supporting a digital platform's user base and operational integrity.",
    bullets: [
      "Served as first point of contact for 10+ daily user inquiries via tickets and live chat, resolving 80% of issues independently with a 95% satisfaction rate across a 40,000+ user base.",
      "Triaged, prioritised, and documented support requests using internal ticketing systems, ensuring timely escalation for complex cases.",
      "Participated in weekly remote staff meetings to share insights on user pain points and contribute to platform improvements.",
    ],
    highlights: [
      { icon: HeadphonesIcon, text: "40,000+ users served" },
      { icon: ShieldCheck, text: "95% satisfaction rate" },
      { icon: Briefcase, text: "Ticket management" },
    ],
    companyDesc: null,
  },
]

const pastPositions = [
  {
    company: "Bunni.lol",
    role: "Admin Support & Volunteer Technician",
    type: "Volunteer · Remote",
    period: "July 2025 – October 2025",
    description: "Supported multiple operational areas including customer engagement, technical assistance, and facility services to ensure smooth daily functions.",
    bullets: [
      "Provided timely assistance to 50,000+ users, troubleshooting software and account issues with a focus on clarity and patience.",
      "Developed batch (.bat) scripts to automate repetitive troubleshooting steps, cutting average resolution time by 40%.",
      "Created comprehensive, easy-to-read documentation to standardise support procedures, empowering users to self-solve issues.",
      "Onboarded 15+ new volunteers, building a knowledge base of best practices to streamline team workflows.",
    ],
    highlights: [
      { icon: HeadphonesIcon, text: "50,000+ users served" },
      { icon: Briefcase, text: "40% faster resolution time" },
      { icon: Users, text: "15+ volunteers onboarded" },
    ],
    companyDesc: null,
  },
]

const pendingPositions: {
  company: string
  role: string
  type: string
  expectedStart: string
  description: string
  bullets?: string[]
  companyDesc?: string | null
  highlights: { icon: React.ElementType; text: string }[]
}[] = [
  {
    company: "LiteMM",
    role: "Support Agent",
    type: "Paid · Part-Time · Remote",
    expectedStart: "2026",
    description: "Providing dedicated customer support for a secure peer-to-peer marketplace built around automated escrow and digital goods trading.",
    bullets: [
      "Handle tickets and resolve disputes, ensuring both buyers and sellers complete deals with full escrow protection.",
      "Support users through automated escrow workflows; funds are locked until both sides confirm, guaranteeing instant settlement.",
      "Act as a trusted point of contact for all platform queries, maintaining confidence in secure peer-to-peer transactions.",
    ],
    highlights: [
      { icon: Lock, text: "Automated escrow support" },
      { icon: ShieldCheck, text: "Transaction protection" },
      { icon: HeadphonesIcon, text: "P2P marketplace support" },
    ],
    companyDesc: "Securely trade digital goods with complete protection and instant settlement — your transactions, protected by automated escrow.",
  },
]

interface PositionCardProps {
  pos: {
    company: string
    role: string
    type: string
    period?: string
    expectedStart?: string
    description: string
    bullets?: string[]
    companyDesc?: string | null
    highlights: { icon: React.ElementType; text: string }[]
  }
  tone: "active" | "pending" | "past"
}

function PositionCard({ pos, tone }: PositionCardProps) {
  const tones = {
    active: {
      card: "border-2 border-emerald-500/30",
      company: "text-emerald-400",
      badge: "flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400 whitespace-nowrap",
      dot: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block",
      bullet: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/60",
      chip: "border-border bg-secondary text-muted-foreground",
      chipIcon: "text-emerald-400",
    },
    pending: {
      card: "border-2 border-amber-500/30",
      company: "text-amber-400",
      badge: "flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-400 whitespace-nowrap",
      dot: "",
      bullet: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/60",
      chip: "border-amber-500/20 bg-amber-500/5 text-amber-400/80",
      chipIcon: "",
    },
    past: {
      card: "border border-border opacity-80",
      company: "text-muted-foreground",
      badge: "rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground whitespace-nowrap",
      dot: "",
      bullet: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40",
      chip: "border-border bg-secondary text-muted-foreground",
      chipIcon: "",
    },
  }[tone]

  const tag = tone === "active" ? "Active" : tone === "pending" ? "Onboarding pending" : "Past"
  const period = pos.period ?? `Starts ${pos.expectedStart}`

  return (
    <div className={`flex h-full flex-col rounded-lg bg-card p-5 ${tones.card}`}>
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground">{pos.role}</h3>
          <p className={`text-sm font-medium ${tones.company}`}>{pos.company}</p>
          <p className="mt-0.5 text-xs text-muted-foreground/60">{pos.type}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className={tones.badge}>
            {tone === "active" && <span className={tones.dot} />}
            {tone === "pending" && <Clock className="h-3 w-3" />}
            {tag}
          </span>
          <span className="text-xs text-muted-foreground/60 whitespace-nowrap">{period}</span>
        </div>
      </div>

      {pos.companyDesc && <p className="mb-3 text-xs italic text-muted-foreground/70">{pos.companyDesc}</p>}

      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{pos.description}</p>

      {pos.bullets && pos.bullets.length > 0 && (
        <ul className="mb-4 flex flex-col gap-1.5">
          {pos.bullets.map((b, j) => (
            <li key={j} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
              <span className={tones.bullet} />
              {b}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-wrap gap-2">
        {pos.highlights.map((h, j) => (
          <span key={j} className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs ${tones.chip}`}>
            <h.icon className={`h-3.5 w-3.5 ${tones.chipIcon}`} />
            {h.text}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Positions() {
  return (
    <main className="relative min-h-screen bg-background">
      <ParticleBackground />

      <div className="relative z-10">
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:pt-24">
          <PageHeader
            badge={<StatusBadge>{currentPositions.length} active roles</StatusBadge>}
            title="Positions"
            description="A record of my current and past roles across support, management, and community work."
          />

          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { value: "< 5 min", label: "Avg. first response" },
              { value: "95%", label: "Satisfaction rate" },
              { value: "80%", label: "Independent resolution" },
              { value: "50+/day", label: "Peak ticket volume" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 rounded-lg border border-emerald-500/20 bg-card p-4 text-center">
                <span className="text-lg font-bold text-emerald-400">{value}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <SectionHeading title="Current" badge={`${currentPositions.length} active`} />
          <div className="grid gap-4 lg:grid-cols-2">
            {currentPositions.map((pos, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <PositionCard pos={pos} tone="active" />
              </Reveal>
            ))}
          </div>
        </section>

        {pendingPositions.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
            <SectionHeading title="Onboarding Pending" badge={`${pendingPositions.length} upcoming`} />
            <div className="grid gap-4 lg:grid-cols-2">
              {pendingPositions.map((pos, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <PositionCard pos={pos} tone="pending" />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <SectionHeading title="Past" badge={`${pastPositions.length} listed`} />
          {pastPositions.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              No past positions listed yet.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {pastPositions.map((pos, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <PositionCard pos={pos} tone="past" />
                </Reveal>
              ))}
            </div>
          )}

          <Footer />
        </section>
      </div>
    </main>
  )
}
