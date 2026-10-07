import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase-server";

export type LatestReading = {
  device_id: "outer" | "purified";
  pm1: number | null;
  pm25: number | null;
  pm10: number | null;
  created_at: string;
};

const latestReadingSchema = z.object({
  device_id: z.enum(["outer", "purified"]),
  pm1: z.number().nullable(),
  pm25: z.number().nullable(),
  pm10: z.number().nullable(),
  created_at: z.string(),
});

export async function getLatest(device_id: LatestReading["device_id"]) {
  const supabaseServer = getSupabaseServer();
  if (!supabaseServer) return null;

  const { data, error } = await supabaseServer
    .from("air_data")
    .select("device_id, pm1, pm25, pm10, created_at")
    .eq("device_id", device_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch latest reading", error.message);
    return null;
  }

  const parsed = latestReadingSchema.safeParse(data);
  if (!parsed.success) return null;
  return parsed.data;
}
