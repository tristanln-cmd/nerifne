"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import { ParticleBackground } from "@/components/ParticleBackground"
import { Footer } from "@/components/Footer"
import { PageHeader, SectionHeading, StatusBadge } from "@/components/PageHeader"
import { Reveal } from "@/components/reveal"

const TRUSTPILOT_URL = "https://www.trustpilot.com/review/nerfine.xyz"

const featured = [
  {
    name: "Peyton",
    title: "Founder @ bunni.lol",
    avatar: "/images/a_38dc6b8a7a07da08a6d8113e886af5ae.gif",
    content:
      "He is a very good staff member and communicates well with the team. He is extremely quick to respond and has an amazing level of professionalism. Customer support has never been better than this.",
  },
  {
    name: "Heatblast",
    title: "Moderator @ v3rmillion",
    avatar: "/images/heatblast-pfp.png",
    content:
      "I know this dude personally, amazing amazing person known him about 5 years probs or so, he&apos;s never let me down or betrayed me and always has a positive service, keep up the good work nerfine i been watching you build your legacy for years -HB",
  },
  {
    name: "Astra",
    title: "Community Manager",
    avatar: "/images/astra.png",
    content: "Nerfine managerz W\nW guy no jokes, best 😭",
  },
]

const reviews = [
  {
    name: "User",
    title: "Literally the best staff manager of all time",
    content:
      "Literally the best staff manager of all time. Always professional and very kind to his subordinates.",
    rating: 5,
    date: "May 21, 2026",
  },
  {
    name: "User",
    title: "Nerfine is best helper",
    content:
      "Nerfine has helped me so much so i HAVE to rate him 5 starts he helped me with so many things 10/10 support agent",
    rating: 5,
    date: "Jan 6, 2026",
  },
  {
    name: "User",
    title: "Amazing support",
    content: "His support is amazing, he is professional, patient, understanding.",
    rating: 5,
    date: "Aug 27, 2025",
  },
  {
    name: "User",
    title: "This guy didnt stop until he fixed my problem",
    content:
      "This guy didnt stop until he fixed my problem, and took his time to help me cause i had no clue what i was doing",
    rating: 5,
    date: "Aug 14, 2025",
  },
  {
    name: "User",
    title: "Best person you can find",
    content:
      "Really nice and mature person, he's very professional, he know how to write code and make .bat files in windows, he's mature, nice, professional, and a bit funny, he can also speak multiple languages which is really cool.",
    rating: 5,
    date: "Aug 13, 2025",
  },
  {
    name: "User",
    title: "Good buddy",
    content:
      "Good buddy. Very professional, always down to get dirty to fix an issue. Very chill dude otherwise, very funny guy.",
    rating: 5,
    date: "Aug 13, 2025",
  },
]

const stats = [
  { value: "4.7 / 5", label: "Average rating" },
  { value: "6+", label: "Written reviews" },
  { value: "3", label: "Featured reviews" },
  { value: "100k+", label: "Users served" },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-emerald-400 text-emerald-400" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  )
}

function TrustpilotLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={TRUSTPILOT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground ${className}`}
    >
      <svg className="h-3 w-3 text-[#00b67a]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.9 8.9H24l-7.5 5.5 2.9 8.9L12 20 2.6 25.3l2.9-8.9L-1.5 10.9H8.1z" transform="scale(0.9) translate(1.2, 1)" />
      </svg>
      Trustpilot
    </a>
  )
}

export default function ReviewsPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <ParticleBackground />

      <div className="relative z-10">
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:pt-24">
          <PageHeader
            badge={<StatusBadge>4.7 / 5 on Trustpilot</StatusBadge>}
            title="Reviews"
            description="What people say about working with me — featured reviews on top, followed by the full collection."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card p-4 text-center">
                <span className="text-lg font-bold text-emerald-400">{value}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <SectionHeading
            title="Featured reviews"
            badge={`${featured.length} featured`}
            right={<TrustpilotLink />}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {featured.map((review) => (
              <div key={review.name} className="flex h-full flex-col rounded-lg border-2 border-emerald-500/30 bg-card p-5">
                <div className="mb-3 flex items-center gap-3">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                    unoptimized
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-foreground">{review.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{review.title}</div>
                  </div>
                  <StarRating rating={5} />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{review.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">Live ratings</p>
              <TrustpilotLink />
            </div>
            <div
              className="trustpilot-widget"
              data-locale="en-US"
              data-template-id="56278e9abfbbba0bdcd568bc"
              data-businessunit-id="689b727f4bf30535fa41df04"
              data-style-height="52px"
              data-style-width="100%"
              data-token="e5ef2601-57a5-4717-aa4f-2431a5310766"
            >
              <a href={TRUSTPILOT_URL} target="_blank" rel="noopener noreferrer">
                Trustpilot
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <SectionHeading
            title="All reviews"
            badge={`${reviews.length} reviews`}
            right={<TrustpilotLink />}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <div key={review.title} className="flex h-full flex-col rounded-lg border border-border bg-card p-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <StarRating rating={review.rating} />
                  <span className="shrink-0 text-xs text-muted-foreground">{review.date}</span>
                </div>
                <h3 className="mb-2 font-medium text-foreground">{review.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{review.content}</p>
              </div>
            ))}
          </div>

          <Reveal className="mt-8">
            <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-border bg-card p-6 text-center sm:flex-row sm:text-left">
              <div>
                <p className="font-medium text-foreground">Worked with me before?</p>
                <p className="text-sm text-muted-foreground">
                  Your feedback is appreciated — a short review helps future clients.
                </p>
              </div>
              <a
                href={TRUSTPILOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
              >
                Leave a review →
              </a>
            </div>
          </Reveal>

          <Footer />
        </section>
      </div>
    </main>
  )
}
