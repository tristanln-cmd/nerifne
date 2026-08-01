"use client"

import Link from "next/link"
import { ArrowLeft, Mail, Cookie, Database, ShieldCheck, Clock, FileText } from "lucide-react"
import { ParticleBackground } from "@/components/ParticleBackground"
import { Footer } from "@/components/Footer"

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10">
          <Icon className="h-4 w-4 text-emerald-400" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      <div className="rounded-lg border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  )
}

const cookies = [
  {
    name: "theme",
    purpose: "Remembers your light/dark mode preference.",
    type: "Necessary",
    duration: "1 year",
  },
  {
    name: "bypass",
    purpose: "Lets the site owner preview pages while maintenance mode is on. Not set for regular visitors.",
    type: "Necessary",
    duration: "Session",
  },
  {
    name: "site-ad-consent",
    purpose: "Remembers your accept/decline choice for personalized-ad cookies.",
    type: "Necessary",
    duration: "Until cleared",
  },
  {
    name: "Trustpilot widget cookies",
    purpose: "Set by Trustpilot's script to display and manage the reviews widget embedded on this site.",
    type: "Third-party / functional",
    duration: "Set by Trustpilot",
  },
  {
    name: "Google AdSense cookies",
    purpose:
      "Not currently active — ads are disabled site-wide. If enabled in the future, these would support ad delivery and personalization, gated by the on-page consent banner.",
    type: "Third-party / advertising",
    duration: "Set by Google, if enabled",
  },
]

export default function PrivacyPolicy() {
  return (
    <main className="relative min-h-screen bg-background">
      <ParticleBackground />

      <div className="relative z-10 mx-auto max-w-3xl px-4 pt-20 pb-16">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <section className="mb-10">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Privacy Policy &amp; Cookies</h1>
          <p className="text-muted-foreground">
            What personal data this site collects, why, and which cookies and third-party
            services are used across nerfine.xyz.
          </p>
          <p className="mt-2 text-xs text-muted-foreground/60">Last updated: July 2026</p>
        </section>

        <Section icon={FileText} title="Who this applies to">
          <p>
            This policy covers nerfine.xyz, operated by MDL Digital
            Support (Entrepreneur Individuel, SIREN 989 428 099, France). See the{" "}
            <Link href="/legal" className="text-emerald-400 hover:underline">
              legal information page
            </Link>{" "}
            for company registration details.
          </p>
        </Section>

        <Section icon={Mail} title="Data collected through forms">
          <ul className="flex flex-col gap-3">
            <li>
              <span className="font-medium text-foreground">Contact form</span> — name, email
              address, inquiry type, and message. Used only to read and reply to your message,
              sent by email via Resend. Not sold, shared, or used for marketing.
            </li>
            <li>
              <span className="font-medium text-foreground">Basic spam prevention</span> — a hidden
              honeypot field and the time taken to submit a form are checked automatically to
              filter out bots. This isn&apos;t used to identify you and isn&apos;t stored beyond
              that check.
            </li>
          </ul>
        </Section>

        <Section icon={Cookie} title="Cookies in use">
          <p className="mb-4">
            This site uses a small number of first-party cookies for basic functionality, plus
            cookies set by embedded third-party scripts. No cookies are used to build advertising
            profiles unless you actively opt in via the ad-consent banner, and that only
            applies once AdSense is enabled.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground/70">
                  <th className="py-2 pr-3 font-medium">Cookie</th>
                  <th className="py-2 pr-3 font-medium">Purpose</th>
                  <th className="py-2 pr-3 font-medium">Type</th>
                  <th className="py-2 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {cookies.map((c) => (
                  <tr key={c.name} className="align-top">
                    <td className="py-2.5 pr-3 font-medium text-foreground whitespace-nowrap">{c.name}</td>
                    <td className="py-2.5 pr-3">{c.purpose}</td>
                    <td className="py-2.5 pr-3 whitespace-nowrap">{c.type}</td>
                    <td className="py-2.5 whitespace-nowrap">{c.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section icon={Database} title="Third-party services">
          <ul className="flex flex-col gap-2">
            <li>
              <span className="font-medium text-foreground">Trustpilot</span> — embeds the
              reviews widget shown on this site. Trustpilot may set its own cookies; see{" "}
              <a
                href="https://legal.trustpilot.com/end-user-privacy-terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline"
              >
                Trustpilot&apos;s privacy terms
              </a>
              .
            </li>
            <li>
              <span className="font-medium text-foreground">Resend</span> — delivers emails sent
              through the contact and appointment forms.
            </li>
            <li>
              <span className="font-medium text-foreground">Supabase</span> — hosts the database
              used to store license and support-related requests.
            </li>
            <li>
              <span className="font-medium text-foreground">Google AdSense</span> — currently
              disabled. If enabled in the future, it would only run after you accept the cookie
              banner.
            </li>
          </ul>
        </Section>

        <Section icon={Clock} title="How long data is kept">
          <p>
            Messages and appointment requests are kept only as long as needed to respond to and
            follow up on your inquiry, and are deleted or anonymized afterward unless a longer
            retention is required by law (for example, invoicing records for registered clients).
          </p>
        </Section>

        <Section icon={ShieldCheck} title="Your rights">
          <p className="mb-3">
            As this site operates from France, you have the right under GDPR to access, correct,
            or request deletion of your personal data, and to object to or restrict its
            processing. To exercise any of these rights, reach out via the{" "}
            <Link href="/contact" className="text-emerald-400 hover:underline">
              contact form
            </Link>{" "}
            or Discord — see the{" "}
            <Link href="/contact" className="text-emerald-400 hover:underline">
              contact page
            </Link>{" "}
            for details.
          </p>
          <p>
            This site is not directed at children, and personal data is not knowingly collected
            from minors.
          </p>
        </Section>

        <section className="rounded-lg border-2 border-emerald-500/30 bg-card p-6 text-center">
          <h2 className="mb-2 text-lg font-semibold text-foreground">Questions about your data?</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Reach out any time and I&apos;ll get back to you.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
          >
            Contact form →
          </Link>
        </section>

        <Footer />
      </div>
    </main>
  )
}
