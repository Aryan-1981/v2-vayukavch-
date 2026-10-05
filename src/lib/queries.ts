import { supabaseServer } from "@/lib/supabase-server";

export type DeviceId = "outer" | "purified";
export type Device = "outer" | "inner";

export type LatestReading = {
  id: number;
  device: Device;
  pm1: number | null;
  pm25: number | null;
  pm10: number | null;
  created_at: string;
};

function toDbDevice(deviceId: DeviceId): Device {
  return deviceId === "outer" ? "outer" : "inner";
}

export async function getLatestByDevice(device: Device) {
  const { data, error } = await supabaseServer
    .from("air_data")
    .select("id, device, pm1, pm25, pm10, created_at")
    .eq("device", device)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data ?? null) as LatestReading | null;
}

export async function getLatest(deviceId: DeviceId) {
  return getLatestByDevice(toDbDevice(deviceId));
}
