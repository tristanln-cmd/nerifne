import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Legal Information | Nerfine – MDL Digital Support",
  description:
    "Legal notice and company registration details for MDL Digital Support, SIREN 989 428 099, registered sole trader in France.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Legal Information | Nerfine",
    description: "Company registration details for MDL Digital Support — SIREN 989 428 099, sole trader in France.",
    url: "https://nerfine.xyz/legal",
    siteName: "Nerfine",
    images: [{ url: "https://nerfine.xyz/og", width: 1200, height: 630 }],
    type: "website",
  },
}

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
