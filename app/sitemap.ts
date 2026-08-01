import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://nerfine.xyz"
  const lastModified = new Date()

  return [
    { url: base, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/positions`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/faq`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/rates`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/now`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ]
}
