"use client"

import { Briefcase, BookOpen, Target, Zap } from "lucide-react"
import { ParticleBackground } from "@/components/ParticleBackground"
import { Footer } from "@/components/Footer"
import { PageHeader, StatusBadge } from "@/components/PageHeader"
import { Reveal } from "@/components/reveal"
import { OPEN_TO_WORK, AVAILABILITY } from "@/lib/config"

const LAST_UPDATED = "July 2026"

export default function Now() {
  return (
    <main className="relative min-h-screen bg-background">
      <ParticleBackground />

      <div className="relative z-10">
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:pt-24">
          <PageHeader
            badge={<StatusBadge tone="muted">Updated {LAST_UPDATED}</StatusBadge>}
            title="Now"
            description="What I'm focused on right now — current work, learning, building, and availability."
          />
        </section>

        <section className="mx-auto grid max-w-7xl items-start gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="mb-3 text-sm font-semibold text-foreground">About this page</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                This page is a snapshot of what I&apos;m working on right now — inspired by{" "}
                <a
                  href="https://nownownow.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  nownownow.com
                </a>
                . It&apos;s updated manually whenever something significant changes.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-lg border border-emerald-500/20 bg-card p-6">
              <p className="mb-4 text-sm font-semibold text-foreground">Current availability</p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="flex flex-col gap-1 rounded-md border border-border bg-secondary p-3">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Status</span>
                  {OPEN_TO_WORK ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                      Open to work
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">Unavailable</span>
                  )}
                </div>
                <div className="flex flex-col gap-1 rounded-md border border-border bg-secondary p-3">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Response</span>
                  <span className="text-xs font-medium text-foreground">{AVAILABILITY.responseTime}</span>
                </div>
                <div className="flex flex-col gap-1 rounded-md border border-border bg-secondary p-3">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Timezone</span>
                  <span className="text-xs font-medium text-foreground">{AVAILABILITY.timezone}</span>
                </div>
                <div className="flex flex-col gap-1 rounded-md border border-border bg-secondary p-3">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Active days</span>
                  <span className="text-xs font-medium text-foreground">
                    {AVAILABILITY.schedule.length === 7 ? "Every day" : AVAILABILITY.schedule.join(", ")}
                  </span>
                </div>
              </div>
              {AVAILABILITY.availableFrom && (
                <p className="mt-3 text-xs text-amber-400">
                  ↳ Available from {new Date(AVAILABILITY.availableFrom).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
          </Reveal>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">What I&apos;m up to</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Reveal className="lg:col-span-2">
              <div className="rounded-lg border-2 border-emerald-500/30 bg-card p-6">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10">
                    <Briefcase className="h-4 w-4 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-foreground">Work</h3>
                </div>
                <div className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    Currently holding <span className="font-medium text-foreground">4 concurrent roles</span> — Moderator at Bloxlfip, Support
                    Agent at GCkeys, General Manager at Madium, and Staff Team Member at RoStake.
                  </p>
                  <p>
                    Bloxflip takes up a growing share of the week: handling reports, enforcing community rules, and
                    supporting the wider moderation team.
                  </p>
                  <p>
                    The rest of my days are split between handling support queues, managing teams, and keeping
                    operations running across platforms.
                  </p>
                  {OPEN_TO_WORK && (
                    <p className="mt-1 text-emerald-400/80">
                      ↳ Still open to new positions — especially long-term roles or platforms that need a dedicated
                      support lead.
                    </p>
                  )}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex h-full flex-col rounded-lg border border-border bg-card p-6">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-secondary">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">Learning</h3>
                </div>
                <div className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
                  <p>Getting deeper into automation — writing more structured scripts to cut down on repetitive ops work.</p>
                  <p>Also improving my Spanish from basic to conversational, slowly but surely.</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex h-full flex-col rounded-lg border border-border bg-card p-6">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-secondary">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">Building</h3>
                </div>
                <div className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    Working on documentation templates and knowledge base frameworks that I can adapt quickly for new
                    clients — reusable SOPs, onboarding flows, and help article structures.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-2" delay={0.3}>
              <div className="flex h-full flex-col rounded-lg border border-border bg-card p-6">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-secondary">
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">Focus</h3>
                </div>
                <div className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    Building a more structured professional presence — better documentation of my work, clearer case
                    studies, and making it easier for people to understand what working with me actually looks like.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Footer />
        </section>
      </div>
    </main>
  )
}
