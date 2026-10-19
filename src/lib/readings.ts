import type { LatestReading } from "@/lib/queries";

export const READING_MAX_AGE_MS = 30_000;

export function readingAgeMs(
  reading: LatestReading | null,
  nowMs: number = Date.now()
): number | null {
  if (!reading?.created_at) return null;
  const timestamp = Date.parse(reading.created_at);
  if (!Number.isFinite(timestamp)) return null;
  return Math.max(0, nowMs - timestamp);
}

export function isReadingFresh(
  reading: LatestReading | null,
  nowMs: number = Date.now(),
  maxAgeMs: number = READING_MAX_AGE_MS
): boolean {
  const age = readingAgeMs(reading, nowMs);
  return age != null && age <= maxAgeMs;
}

export function describeReadingAge(
  reading: LatestReading | null,
  nowMs: number = Date.now()
): string {
  const age = readingAgeMs(reading, nowMs);
  if (age == null) return "no data";
  const seconds = Math.floor(age / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function pmEfficiency(
  inletPm: number | null | undefined,
  outletPm: number | null | undefined
): number | null {
  if (inletPm == null || outletPm == null) return null;
  if (!Number.isFinite(inletPm) || !Number.isFinite(outletPm)) return null;
  if (inletPm <= 0) return null;
  const efficiency = ((inletPm - outletPm) / inletPm) * 100;
  return Math.max(0, Math.min(100, efficiency));
}
