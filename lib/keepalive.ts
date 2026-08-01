import { getSupabaseAdmin } from "@/lib/supabase"

// Free-tier Supabase projects auto-pause after ~7 days with no API activity.
// Hitting this endpoint on a schedule (UptimeRobot, cron-job.org, ...) writes
// a file to storage + touches the DB, which resets that clock.
const KEEPALIVE_BUCKET = "keepalive"
const KEEPALIVE_PATH = "ping.txt"

export async function pingSupabaseStorage(): Promise<{ publicUrl: string }> {
  const admin = getSupabaseAdmin()

  const { data: buckets } = await admin.storage.listBuckets()
  const exists = buckets?.some((b) => b.name === KEEPALIVE_BUCKET)
  if (!exists) {
    const { error: createError } = await admin.storage.createBucket(KEEPALIVE_BUCKET, {
      public: true,
    })
    // Ignore "already exists" races; surface anything else.
    if (createError && !/already exists/i.test(createError.message)) {
      throw new Error(`createBucket failed: ${createError.message}`)
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
    throw new Error(`upload failed: ${uploadError.message}`)
  }

  const { data } = admin.storage.from(KEEPALIVE_BUCKET).getPublicUrl(KEEPALIVE_PATH)
  return { publicUrl: data.publicUrl }
}

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
