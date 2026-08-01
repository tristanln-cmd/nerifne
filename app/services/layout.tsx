import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services | Nerfine – Support & Technical Assistance",
  description:
    "Explore the remote support services offered by Nerfine: ticket handling, technical troubleshooting, community moderation, documentation writing, and scripting automation.",
  openGraph: {
    title: "Services | Nerfine – Support & Technical Assistance",
    description:
      "Remote support services: ticket management, technical troubleshooting, community moderation, and automation scripting.",
    url: "https://nerfine.xyz/services",
    siteName: "Nerfine",
    images: [{ url: "https://nerfine.xyz/og", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | Nerfine",
    description: "Remote support services: ticket management, troubleshooting, moderation, and automation.",
    images: ["https://nerfine.xyz/og"],
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
