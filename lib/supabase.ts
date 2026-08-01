import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Lazy singletons: this module gets imported at build time, so the clients
// are only created once the env vars are guaranteed to be present.
let _supabase: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  if (!url || !key) {
    throw new Error("Supabase client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env vars.")
  }
  _supabase = createClient(url, key)
  return _supabase
}

// Service-role client for admin operations. Never expose this key to the browser.
export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
  if (!url || !key) {
    throw new Error("Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.")
  }
  _supabaseAdmin = createClient(url, key, {
    auth: { persistSession: false },
  })
  return _supabaseAdmin
}
