import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Positions | Nerfine – Current & Past Roles",
  description:
    "Nerfine's current and past support positions across platforms including Madium, GCkeys, LiteMM, and RoStake. 90,000+ users served across four concurrent paid roles.",
  openGraph: {
    title: "Positions | Nerfine – Current & Past Roles",
    description:
      "Current and past support positions — 90,000+ users served across four concurrent paid remote roles.",
    url: "https://nerfine.xyz/positions",
    siteName: "Nerfine",
    images: [{ url: "https://nerfine.xyz/og", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Positions | Nerfine",
    description: "Current and past support positions — 90,000+ users served across four concurrent paid remote roles.",
    images: ["https://nerfine.xyz/og"],
  },
}

export default function PositionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
