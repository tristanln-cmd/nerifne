import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { MAINTENANCE_MODE } from "@/lib/config"
import { timingSafeEqual } from "@/lib/timing-safe-equal"

const BYPASS_SECRET = process.env.MAINTENANCE_BYPASS_SECRET ?? ""

function isPublicPath(pathname: string): boolean {
  return (
    pathname === "/maintenance" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/og") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/llms.txt"
  )
}

// The layout reads this header to decide between the dark/light CSS variables.
function applyTheme(response: NextResponse, request: NextRequest): NextResponse {
  const theme = request.cookies.get("theme")?.value
  if (theme === "light" || theme === "dark") {
    response.headers.set("x-theme", theme)
  }
  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (isPublicPath(pathname)) return NextResponse.next()

  const bypassCookie = request.cookies.get("bypass")?.value ?? ""
  const hasBypass = BYPASS_SECRET.length > 0 && timingSafeEqual(bypassCookie, BYPASS_SECRET)

  if (hasBypass) return applyTheme(NextResponse.next(), request)

  if (MAINTENANCE_MODE) {
    return NextResponse.redirect(new URL("/maintenance", request.url))
  }

  return applyTheme(NextResponse.next(), request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
