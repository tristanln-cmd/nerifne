import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Get a Free Madison Key | Nerfine",
  description:
    "Get a free Madison plugin key in just two quick steps. Join the Discord, wait a moment, and claim your license instantly.",
  openGraph: {
    title: "Get a Free Madison Key | Nerfine",
    description: "Two quick steps and your free Madison license key is ready to copy and use in Roblox Studio.",
    url: "https://nerfine.xyz/get-key",
    siteName: "Nerfine",
    images: [{ url: "https://nerfine.xyz/og", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get a Free Madison Key | Nerfine",
    description: "Two quick steps and your free Madison license key is ready to copy and use.",
    images: ["https://nerfine.xyz/og"],
  },
}

export default function GetKeyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
