import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let _supabase: SupabaseClient | null = null

/**
 * Lazy singleton — only calls createClient() the first time it's needed,
 * so the module can be imported at build-time without requiring env vars.
 */
export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  if (!url || !key) {
    throw new Error(
      "Supabase client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env vars."
    )
  }
  _supabase = createClient(url, key)
  return _supabase
}

let _supabaseAdmin: SupabaseClient | null = null

/**
 * Lazy singleton for the service-role admin client.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
  if (!url || !key) {
    throw new Error(
      "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars."
    )
  }
  _supabaseAdmin = createClient(url, key, {
    auth: { persistSession: false },
  })
  return _supabaseAdmin
}
