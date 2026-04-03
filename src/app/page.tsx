import LiveCards from "@/app/LiveCards";
import { getLatest } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [outer, purified] = await Promise.all([getLatest("outer"), getLatest("purified")]);

  return (
    <div className="min-h-screen bg-[radial-gradient(80%_60%_at_50%_0%,rgba(56,189,248,0.15),transparent_55%),linear-gradient(to_bottom,#020617,#0b1222)] text-white">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                <svg viewBox="0 0 24 24" fill="none" className="size-6 text-sky-200" aria-hidden="true">
                  <path
                    d="M3 8c3.5 0 3.5-3 7-3 2.8 0 4 1.4 4 3 0 2-1.7 3-4 3H4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 12h11c2.8 0 4-1.4 4-3 0-2 1.7-3 3-3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 16h9c2.2 0 3 1 3 2 0 1.4-1.3 3-4 3-3.5 0-3.5-2-7-2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  VayuKavach V2 – Smart Air Protection System
                </h1>
                <p className="mt-1 text-sm text-white/60">
                  Two-device dashboard (Outdoor + Purified). Live updates and performance insights.
                </p>
              </div>
            </div>
          </header>

          <LiveCards initialOuter={outer} initialPurified={purified} refreshMs={5000} />

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/75">
            <div className="font-semibold text-white">ESP upload endpoint</div>
            <div className="mt-2 font-mono text-xs break-all text-white/70">POST /api/ingest</div>
            <div className="mt-3 text-white/60">
              Send JSON: <span className="font-mono">device_id</span> (outer|purified), pm1, pm25, pm10.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
