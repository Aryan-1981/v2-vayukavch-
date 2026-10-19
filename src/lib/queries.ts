import { supabaseServer } from "@/lib/supabase-server";

export type DeviceLabel = "inner" | "outer";

export type LatestReading = {
  device: DeviceLabel;
  pm1: number | null;
  pm25: number | null;
  pm10: number | null;
  created_at: string;
};

export async function getLatest(device: DeviceLabel) {
  const { data, error } = await supabaseServer
    .from("air_data")
    .select("device, pm1, pm25, pm10, created_at")
    .eq("device", device)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    const detail = [
      `air_data query failed for device "${device}"`,
      error.message,
      error.code ? `code=${error.code}` : null,
      error.details ? `details=${error.details}` : null,
      error.hint ? `hint=${error.hint}` : null,
    ]
      .filter(Boolean)
      .join(" | ");
    throw new Error(detail);
  }

  return (data ?? null) as LatestReading | null;
}
