import LegacyLanding from "@/app/LegacyLanding";
import { getLatest } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const [initialOuter, initialPurified] = await Promise.all([getLatest("outer"), getLatest("purified")]);

  return <LegacyLanding initialOuter={initialOuter} initialPurified={initialPurified} refreshMs={5000} />;
}
