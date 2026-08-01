import { getSupabaseAdmin } from "@/lib/supabase"

// Free-tier Supabase projects auto-pause after ~7 days with no API activity.
// A tiny bit of real traffic (a storage write + a DB query) resets that
// clock. This module is meant to be hit on a schedule by an external
// uptime monitor (UptimeRobot, cron-job.org, etc.) via
// /api/cron/keepalive — see SUPABASE_SETUP.md for the exact steps.

const KEEPALIVE_BUCKET = "keepalive"
const KEEPALIVE_PATH = "ping.txt"

/**
 * Writes a small timestamped file to Supabase Storage and returns its
 * public URL. Creates the bucket on first run if it doesn't exist yet.
 * Reused (upsert) on every call so this never accumulates files.
 */
export async function pingSupabaseStorage(): Promise<{ publicUrl: string }> {
  const admin = getSupabaseAdmin()

  // Make sure the bucket exists (no-op if it's already there).
  const { data: buckets } = await admin.storage.listBuckets()
  const exists = buckets?.some((b) => b.name === KEEPALIVE_BUCKET)
  if (!exists) {
    const { error: createError } = await admin.storage.createBucket(KEEPALIVE_BUCKET, {
      public: true,
    })
    // Ignore "already exists" races; surface anything else.
    if (createError && !/already exists/i.test(createError.message)) {
      throw new Error(`pingSupabaseStorage: createBucket failed: ${createError.message}`)
    }
  }

  const body = `keepalive ping @ ${new Date().toISOString()}\n`

  const { error: uploadError } = await admin.storage
    .from(KEEPALIVE_BUCKET)
    .upload(KEEPALIVE_PATH, Buffer.from(body, "utf8"), {
      contentType: "text/plain",
      upsert: true,
    })

  if (uploadError) {
    throw new Error(`pingSupabaseStorage: upload failed: ${uploadError.message}`)
  }

  const { data } = admin.storage.from(KEEPALIVE_BUCKET).getPublicUrl(KEEPALIVE_PATH)
  return { publicUrl: data.publicUrl }
}

/**
 * Deletes every plugin_licenses row whose expires_at is in the past.
 * Returns how many rows were removed.
 */
export async function deleteExpiredLicenses(): Promise<{ deletedCount: number }> {
  const admin = getSupabaseAdmin()

  const { data, error } = await admin
    .from("plugin_licenses")
    .delete()
    .lt("expires_at", new Date().toISOString())
    .not("expires_at", "is", null)
    .select("key")

  if (error) {
    throw new Error(`deleteExpiredLicenses: ${error.message}`)
  }

  return { deletedCount: data?.length ?? 0 }
}
