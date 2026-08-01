import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact | Nerfine – Get in Touch",
  description:
    "Reach out to Nerfine for support roles, freelance contracts, or technical assistance enquiries. Fast response via Discord or email.",
  openGraph: {
    title: "Contact | Nerfine – Get in Touch",
    description: "Reach out for support roles, freelance contracts, or technical assistance enquiries.",
    url: "https://nerfine.xyz/contact",
    siteName: "Nerfine",
    images: [{ url: "https://nerfine.xyz/og", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Nerfine",
    description: "Reach out for support roles, freelance contracts, or technical assistance enquiries.",
    images: ["https://nerfine.xyz/og"],
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
