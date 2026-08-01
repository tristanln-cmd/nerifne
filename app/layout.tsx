import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import { headers } from "next/headers"
import "./globals.css"
import { ToastContainer } from "@/components/Toast"
import { CookieNotice } from "@/components/CookieNotice"
import { SiteNavbar } from "@/components/SiteNavbar"
import { PageTransition } from "@/components/PageTransition"
import { ADS_ENABLED, ADSENSE_PUBLISHER_ID } from "@/lib/config"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://nerfine.xyz"),
  title: {
    default: "Mathis | Professional Support Agent",
    template: "%s | Mathis",
  },
  description:
    "Multi-platform support specialist with 90,000+ users served. Experienced in ticket management, technical troubleshooting, community moderation, and automation scripting. Available for remote roles.",
  openGraph: {
  title: "Mathis | Professional Support Agent",
  description:
    "Professional Support Agent with experience assisting over 90,000 users, specializing in customer support, technical troubleshooting, community management, and automation.",
  url: "https://nerfine.xyz",
  siteName: "Mathis",
  images: [
    {
      url: "/og",
      width: 1200,
      height: 630,
      alt: "Mathis – Professional Support Agent",
    },
  ],
  locale: "en_US",
  type: "website",
},
  twitter: {
  card: "summary_large_image",
  title: "Mathis | Professional Support Agent",
  description:
    "Professional Support Agent with experience assisting over 90,000 users.",
  images: ["/og"],
},
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://nerfine.xyz",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const theme = (headersList.get("x-theme") ?? "dark") as "dark" | "light"

  return (
    <html lang="en" className={theme}>
      <head>
        {ADS_ENABLED && ADSENSE_PUBLISHER_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
          />
        )}
        <Script src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" strategy="afterInteractive" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Mathis",
              url: "https://nerfine.xyz",
              jobTitle: "Professional Support Agent",
              description:
                "Professional Support Agent with experience assisting over 90,000 users, specializing in customer support, technical troubleshooting, community management, and automation.",
              knowsLanguage: ["French", "English", "Spanish"],
              address: { "@type": "PostalAddress", addressCountry: "FR" },
              sameAs: ["https://discord.com/users/286201707346526229"],
            }),
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        <SiteNavbar />
        <PageTransition>{children}</PageTransition>
        <ToastContainer />
        <CookieNotice />
      </body>
    </html>
  )
}
