import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ | Nerfine – Frequently Asked Questions",
  description:
    "Answers to common questions about Nerfine's availability, services, rates, timezone, languages, and how to get started with a support role or contract.",
  openGraph: {
    title: "FAQ | Nerfine – Frequently Asked Questions",
    description: "Availability, rates, services, and how to hire — everything you need to know before reaching out.",
    url: "https://nerfine.xyz/faq",
    siteName: "Nerfine",
    images: [{ url: "https://nerfine.xyz/og", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Nerfine",
    description: "Availability, rates, services, and how to hire.",
    images: ["https://nerfine.xyz/og"],
  },
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
