import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/env";

let supabaseServerClient: ReturnType<typeof createClient> | null | undefined;

export function getSupabaseServer() {
  if (supabaseServerClient !== undefined) return supabaseServerClient;

  const env = getSupabaseEnv();
  if (!env) {
    console.error("Missing SUPABASE_URL and/or SUPABASE_SECRET_KEY.");
    supabaseServerClient = null;
    return supabaseServerClient;
  }

  supabaseServerClient = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false },
  });
  return supabaseServerClient;
}
