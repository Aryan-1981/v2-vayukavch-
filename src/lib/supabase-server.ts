import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export const supabaseServer = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});
