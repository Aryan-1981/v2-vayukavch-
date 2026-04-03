import LiveCards from "@/app/LiveCards";
import { getLatest } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function FeatureCard({
  title,
  desc,
  color,
  icon,
}: {
  title: string;
  desc: string;
  color: "emerald" | "sky" | "violet" | "amber";
  icon: React.ReactNode;
}) {
  const tint =
    color === "emerald"
      ? "text-emerald-200"
      : color === "sky"
        ? "text-sky-200"
        : color === "violet"
          ? "text-violet-200"
          : "text-amber-200";

  const ring =
    color === "emerald"
      ? "ring-emerald-400/20"
      : color === "sky"
        ? "ring-sky-400/20"
        : color === "violet"
          ? "ring-violet-400/20"
          : "ring-amber-400/20";

  return (
    <div className={`vk-glass rounded-2xl p-5 ring-1 ${ring}`}>
      <div className="flex items-start gap-3">
        <div className={`grid size-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 ${tint}`}>
          {icon}
        </div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="mt-1 text-xs leading-relaxed text-white/55">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tint }: { label: string; value: string; tint: string }) {
  return (
    <div className="vk-glass rounded-2xl px-5 py-4">
      <div className={`text-xl font-semibold ${tint}`}>{value}</div>
      <div className="mt-1 text-[11px] text-white/50">{label}</div>
    </div>
  );
}

export default async function Home() {
  const [outer, purified] = await Promise.all([getLatest("outer"), getLatest("purified")]);

  return (
    <div className="space-y-12">
      {/* HERO (older-site style) */}
      <section className="pt-4">
        <div className="mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="vk-pill rounded-full px-3 py-1 text-[11px] font-medium tracking-wide">
              COMING SOON
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
              Smart City <span className="text-sky-300">Air Network</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              Real-time monitoring with proof-of-performance purification. This V2 dashboard compares your
              <span className="text-white/80"> Outdoor</span> air versus the <span className="text-white/80">Purified</span> air
              produced by your system.
            </p>

            <div className="mt-7 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
              <Stat label="Sensors" value="2" tint="text-emerald-200" />
              <Stat label="Data" value="Real‑time" tint="text-sky-200" />
              <Stat label="Devices" value="2 ESP" tint="text-violet-200" />
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <FeatureCard
              title="City‑Wide Coverage"
              desc="Deployable nodes that visualize outdoor pollution patterns and trends." 
              color="sky"
              icon={
                <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                  <path d="M4 7h7v13H4V7Z" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M13 4h7v16h-7V4Z" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              }
            />
            <FeatureCard
              title="Instant Alerts"
              desc="Flag poor conditions quickly and compare against purified output." 
              color="amber"
              icon={
                <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                  <path
                    d="M12 9v4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path d="M12 16.8h.01" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                  <path
                    d="M10.3 4.7c.7-1.2 2.7-1.2 3.4 0l8.1 14c.8 1.4-.2 3.3-1.7 3.3H3.9c-1.6 0-2.5-1.9-1.7-3.3l8.1-14Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            <FeatureCard
              title="Predictive Analytics"
              desc="Prepare for spikes by tracking PM trends over time (PM2.5 chart)." 
              color="violet"
              icon={
                <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                  <path d="M5 19V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M12 19V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M19 19v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              }
            />
            <FeatureCard
              title="Community Driven"
              desc="Transparent data for awareness, research, and local action." 
              color="emerald"
              icon={
                <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                  <path
                    d="M7 11a3 3 0 1 1 6 0v1"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M5 20v-1a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v1"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="vk-pill inline-flex rounded-full px-3 py-1 text-[11px] font-medium">LIVE</div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              VayuKavach V2 – <span className="text-emerald-200">Smart Air Protection</span>
            </h2>
            <p className="mt-1 text-sm text-white/55">
              Two sensors (Outdoor + Purified) with real-time comparison and efficiency.
            </p>
          </div>

          <div className="text-xs text-white/40">
            Refresh interval: <span className="font-mono text-white/60">5s</span>
          </div>
        </div>

        <div className="vk-glass rounded-3xl p-6">
          <LiveCards initialOuter={outer} initialPurified={purified} refreshMs={5000} />
        </div>

        <div className="vk-glass rounded-3xl p-6 text-sm text-white/70">
          <div className="font-semibold text-white">ESP upload endpoint</div>
          <div className="mt-2 font-mono text-xs break-all text-white/70">POST /api/ingest</div>
          <div className="mt-3 text-white/55">
            Send JSON: <span className="font-mono">device_id</span> (outer|purified), pm1, pm25, pm10.
          </div>
        </div>
      </section>
    </div>
  );
}
