import { supabaseServer } from "@/lib/supabase-server";

export type LatestReading = {
  device_id: "outer" | "purified";
  pm1: number | null;
  pm25: number | null;
  pm10: number | null;
  created_at: string;
};

export async function getLatest(device_id: LatestReading["device_id"]) {
  const { data, error } = await supabaseServer
    .from("air_readings")
    .select("device_id, pm1, pm25, pm10, created_at")
    .eq("device_id", device_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data ?? null) as LatestReading | null;
}
