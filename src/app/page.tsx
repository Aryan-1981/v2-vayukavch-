import LegacyLanding from "@/app/LegacyLanding";
import { getLatest, type DeviceLabel } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function safeGetLatest(device: DeviceLabel) {
  try {
    return await getLatest(device);
  } catch (error) {
    console.error(
      `[page] Supabase query for "${device}" failed:`,
      error instanceof Error ? (error.cause ?? error.message) : error
    );
    return null;
  }
}

export default async function Page() {
  const [initialOuter, initialInner] = await Promise.all([
    safeGetLatest("outer"),
    safeGetLatest("inner"),
  ]);

  return <LegacyLanding initialOuter={initialOuter} initialInner={initialInner} refreshMs={5000} />;
}
