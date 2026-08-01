import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reviews",
  description: "Read what people say about working with Nerfine — featured reviews and community feedback on support, management, and reliability.",
  openGraph: {
    title: "Reviews | Nerfine",
    description: "Featured reviews and community feedback on working with Nerfine.",
    url: "https://nerfine.xyz/reviews",
    siteName: "Nerfine",
    images: [{ url: "https://nerfine.xyz/og", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reviews | Nerfine",
    description: "Featured reviews and community feedback on working with Nerfine.",
    images: ["https://nerfine.xyz/og"],
  },
}

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
