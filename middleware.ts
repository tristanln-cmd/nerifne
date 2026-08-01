import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { MAINTENANCE_MODE } from "@/lib/config"
import { timingSafeEqual } from "@/lib/timing-safe-equal"

const BYPASS_SECRET = process.env.MAINTENANCE_BYPASS_SECRET ?? ""

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const bypassCookie = request.cookies.get("bypass")?.value ?? ""
  const hasBypass = BYPASS_SECRET.length > 0 && timingSafeEqual(bypassCookie, BYPASS_SECRET)

  if (
    pathname === "/maintenance" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/og") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/llms.txt"
  ) {
    return NextResponse.next()
  }

  if (hasBypass) {
    const response = NextResponse.next()
    const theme = request.cookies.get("theme")?.value
    if (theme === "light" || theme === "dark") {
      response.headers.set("x-theme", theme)
    }
    return response
  }

  if (MAINTENANCE_MODE) {
    return NextResponse.redirect(new URL("/maintenance", request.url))
  }

  const response = NextResponse.next()
  const theme = request.cookies.get("theme")?.value
  if (theme === "light" || theme === "dark") {
    response.headers.set("x-theme", theme)
  }
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
