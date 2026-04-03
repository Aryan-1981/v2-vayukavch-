import { getLatest } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function Card({
  title,
  reading,
}: {
  title: string;
  reading: Awaited<ReturnType<typeof getLatest>>;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      {!reading ? (
        <p className="mt-3 text-sm text-white/70">No data yet.</p>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-black/20 p-3">
            <div className="text-xs text-white/70">PM1.0</div>
            <div className="text-2xl font-semibold">{reading.pm1 ?? "-"}</div>
          </div>
          <div className="rounded-lg bg-black/20 p-3">
            <div className="text-xs text-white/70">PM2.5</div>
            <div className="text-2xl font-semibold">{reading.pm25 ?? "-"}</div>
          </div>
          <div className="rounded-lg bg-black/20 p-3">
            <div className="text-xs text-white/70">PM10</div>
            <div className="text-2xl font-semibold">{reading.pm10 ?? "-"}</div>
          </div>
          <div className="col-span-3 mt-1 text-xs text-white/60">
            Last update: {new Date(reading.created_at).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}

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

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card title="Outer Air" reading={outer} />
          <Card title="Purified Air" reading={purified} />
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
