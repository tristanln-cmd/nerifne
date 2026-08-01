import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy & Cookies | Nerfine",
  description:
    "How Nerfine (MDL Digital Support) collects and uses personal data via the contact form, and what cookies and third-party services (Trustpilot, Google AdSense) are used on this site.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy & Cookies | Nerfine",
    description:
      "How this site collects and uses personal data, and which cookies and third-party services are in use.",
    url: "https://nerfine.xyz/privacy",
    siteName: "Nerfine",
    images: [{ url: "https://nerfine.xyz/og", width: 1200, height: 630 }],
    type: "website",
  },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
