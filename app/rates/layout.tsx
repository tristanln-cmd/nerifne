import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rates | Nerfine – Pricing & Engagement Types",
  description:
    "Transparent pricing and engagement options for Nerfine's support, management, documentation, and automation services. Hourly, retainer, and project-based arrangements available.",
  openGraph: {
    title: "Rates | Nerfine",
    description: "Pricing and engagement options for support, management, and documentation services.",
    url: "https://nerfine.xyz/rates",
    siteName: "Nerfine",
    images: [{ url: "https://nerfine.xyz/og", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rates | Nerfine",
    description: "Pricing and engagement options for support, management, and documentation services.",
    images: ["https://nerfine.xyz/og"],
  },
}

export default function RatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
