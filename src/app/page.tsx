import LegacyLanding from "@/app/LegacyLanding";
import { getLatest, type LatestReading } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function safeGetLatest(device_id: LatestReading["device_id"]) {
  try {
    return await getLatest(device_id);
  } catch (error) {
    console.error(
      `[page] Supabase query for "${device_id}" failed:`,
      error instanceof Error ? (error.cause ?? error) : error
    );
    return null;
  }
}

export default async function Page() {
  const [initialOuter, initialPurified] = await Promise.all([
    safeGetLatest("outer"),
    safeGetLatest("purified"),
  ]);

  return <LegacyLanding initialOuter={initialOuter} initialPurified={initialPurified} refreshMs={5000} />;
}
