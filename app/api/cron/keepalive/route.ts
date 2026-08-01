import { NextRequest, NextResponse } from "next/server"
import { timingSafeEqual } from "@/lib/timing-safe-equal"
import { pingSupabaseStorage, deleteExpiredLicenses } from "@/lib/keepalive"

// Point an external uptime monitor (UptimeRobot, cron-job.org, ...) at this to
// keep the free-tier Supabase project awake. Vercel Cron sends the secret as a
// bearer token; the query param and x-cron-secret header are also accepted.
export async function GET(req: NextRequest) {
  const expected = process.env.CRON_SECRET ?? ""
  if (!expected) {
    return NextResponse.json(
      { success: false, message: "CRON_SECRET is not configured on the server." },
      { status: 500 }
    )
  }

  const url = new URL(req.url)
  const provided =
    url.searchParams.get("secret") ??
    req.headers.get("x-cron-secret") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    ""

  if (!provided || !timingSafeEqual(provided, expected)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  const [{ publicUrl }, { deletedCount }] = await Promise.all([
    pingSupabaseStorage(),
    deleteExpiredLicenses(),
  ])

  return NextResponse.json({
    success: true,
    pingedAt: new Date().toISOString(),
    publicUrl,
    expiredKeysDeleted: deletedCount,
  })
}
