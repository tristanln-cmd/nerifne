import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Now",
  description: "What Nerfine is focused on right now — current work, learning, and availability.",
}

export default function NowLayout({ children }: { children: React.ReactNode }) {
  return children
}
