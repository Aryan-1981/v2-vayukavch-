import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

const fetchWithTimeout: typeof fetch = (input, init) =>
  fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(10_000) });

export const supabaseServer = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
  global: { fetch: fetchWithTimeout },
});
