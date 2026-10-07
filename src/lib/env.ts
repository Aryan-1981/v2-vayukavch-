import { z } from "zod";

const supabaseEnvSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SECRET_KEY: z.string().min(10),
});

const ingestTokenSchema = z.string().min(8);

export function getSupabaseEnv() {
  const parsed = supabaseEnvSchema.safeParse({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  });

  return parsed.success ? parsed.data : null;
}

export function getIngestToken() {
  const parsed = ingestTokenSchema.safeParse(process.env.INGEST_TOKEN);
  return parsed.success ? parsed.data : null;
}
