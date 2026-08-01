import { NextRequest, NextResponse } from "next/server"
import { timingSafeEqual } from "@/lib/timing-safe-equal"
import { pingSupabaseStorage, deleteExpiredLicenses } from "@/lib/keepalive"

// GET /api/cron/keepalive?secret=<CRON_SECRET>
// Also accepts the secret as a `x-cron-secret` header (Vercel Cron sends
// Authorization: Bearer <CRON_SECRET> automatically — that's checked too).
//
// This is the URL you point an external uptime monitor at (UptimeRobot,
// cron-job.org, Better Uptime, etc). Every hit:
//   1. Writes/overwrites a tiny file in Supabase Storage + reads it back
//      -> real API activity, resets the free-tier auto-pause timer.
//   2. Deletes any plugin_licenses rows that have expired.
//
// See SUPABASE_SETUP.md for step-by-step monitor setup.
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

  try {
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
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
