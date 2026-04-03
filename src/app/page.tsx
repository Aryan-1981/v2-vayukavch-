import LiveCards from "@/app/LiveCards";
import { getLatest } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [outer, purified] = await Promise.all([
    getLatest("outer"),
    getLatest("purified"),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-bold">Air Monitor</h1>
        <p className="mt-2 text-sm text-white/70">
          Latest readings from your two ESP devices.
        </p>

        <div className="mt-8">
          <LiveCards initialOuter={outer} initialPurified={purified} refreshMs={10000} />
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
          <div className="font-semibold">ESP upload endpoint</div>
          <div className="mt-2 font-mono text-xs break-all">POST /api/ingest</div>
          <div className="mt-3 text-white/70">
            Send JSON: <span className="font-mono">device_id</span> (outer|purified), pm1, pm25, pm10.
          </div>
        </div>
      </div>
    </div>
  );
}
