"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Briefcase, User, Star, HelpCircle, Clock, Coins, Mail } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { cn } from "@/lib/utils"

const desktopLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Services", href: "/services", icon: Briefcase },
  { label: "Positions", href: "/positions", icon: User },
  { label: "Reviews", href: "/reviews", icon: Star },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
]

const mobileLinks = [
  ...desktopLinks,
  { label: "Now", href: "/now", icon: Clock },
  { label: "Rates", href: "/rates", icon: Coins },
  { label: "Contact", href: "/contact", icon: Mail },
]

export function SiteNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  if (pathname.startsWith("/get-key")) return null

  return (
    <header className="sticky top-0 z-50 px-3 py-3 sm:px-6">
      <div className="relative mx-auto flex max-w-4xl items-center justify-between gap-2 rounded-full border border-emerald-400/10 bg-background/60 px-2.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(59,130,246,0.03),0_8px_32px_rgba(0,0,0,0.45),0_0_40px_rgba(59,130,246,0.04)] backdrop-blur-xl sm:px-3">
        <Link href="/" className="shrink-0 pl-2 text-base font-bold tracking-tight text-foreground">
          Nerfine<span className="text-emerald-400">.xyz</span>
        </Link>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {desktopLinks.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all duration-200",
                      isActive
                        ? "bg-emerald-500/15 font-medium text-emerald-300"
                        : "text-muted-foreground hover:bg-emerald-500/5 hover:text-emerald-200"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle className="border-emerald-500/25 text-emerald-400/80 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300 hover:shadow-[0_0_14px_rgba(59,130,246,0.2)]" />

          <Link
            href="/contact"
            className="hidden items-center gap-1.5 rounded-full border border-emerald-500/40 px-4 py-1.5 text-sm font-medium text-emerald-400 transition-all duration-200 hover:bg-emerald-500/10 hover:shadow-[0_0_18px_rgba(59,130,246,0.25)] sm:inline-flex"
          >
            Contact us →
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className={`block h-0.5 w-5 bg-foreground transition-transform duration-200 ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-foreground transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-foreground transition-transform duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
        <div
          className={cn(
            "overflow-hidden rounded-2xl border border-emerald-400/10 bg-background/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-all duration-300 ease-out",
            open ? "mt-2 max-h-96 opacity-100" : "mt-0 max-h-0 border-transparent opacity-0 shadow-none"
          )}
        >
          <ul className="flex flex-col gap-1 p-2 lg:hidden">
            {mobileLinks.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-emerald-500/15 font-medium text-emerald-300"
                        : "text-muted-foreground hover:bg-emerald-500/5 hover:text-emerald-200"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </header>
  )
}
