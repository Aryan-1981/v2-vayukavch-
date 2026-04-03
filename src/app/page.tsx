import LiveCards from "@/app/LiveCards";
import { getLatest } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid size-11 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10 text-white/80">
      {children}
    </div>
  );
}

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

function SectionTitle({ pill, title, subtitle }: { pill: string; title: React.ReactNode; subtitle: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex vk-pill rounded-full px-3 py-1 text-[11px] font-medium tracking-wide">{pill}</div>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">{subtitle}</p>
    </div>
  );
}

export default async function Home() {
  const [outer, purified] = await Promise.all([getLatest("outer"), getLatest("purified")]);

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="pt-2">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 vk-pill rounded-full px-3 py-1 text-[11px] font-medium tracking-wide">
            <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
            REAL‑TIME • V2
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-6xl">
            Smart City <span className="text-sky-300">Air Network</span>
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/60 sm:text-base">
            A hardware-driven air protection system with proof-of-performance.
            <span className="text-white/80"> Outdoor</span> vs <span className="text-white/80">Purified</span> readings update every few seconds.
          </p>

          <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Sensors" value="2" tint="text-emerald-200" />
            <Stat label="Update" value="5s" tint="text-sky-200" />
            <Stat label="Devices" value="2× ESP" tint="text-violet-200" />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <a
              href="#dashboard"
              className="vk-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white/85 ring-1 ring-white/10 hover:bg-white/10"
            >
              View Dashboard
              <span className="text-white/40">→</span>
            </a>
            <a
              href="https://github.com/Aryan-1981/vayukavach"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/10"
            >
              View on GitHub
            </a>
          </div>

          <div className="mt-10 w-full max-w-5xl vk-glass rounded-3xl p-5 sm:p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3">
                  <Icon>
                    <svg viewBox="0 0 24 24" fill="none" className="size-6 text-emerald-200" aria-hidden="true">
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
                  </Icon>
                  <div>
                    <div className="text-sm font-semibold">Invisible Threats, Visibly Managed.</div>
                    <div className="mt-1 text-xs text-white/55">
                      Track particulate pollution and verify purification effectiveness on the same screen.
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                  <div className="text-xs text-white/50">PM1</div>
                  <div className="mt-1 font-mono text-sm text-white/80">Live</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                  <div className="text-xs text-white/50">PM2.5</div>
                  <div className="mt-1 font-mono text-sm text-white/80">Chart</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                  <div className="text-xs text-white/50">PM10</div>
                  <div className="mt-1 font-mono text-sm text-white/80">AQI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="space-y-8">
        <SectionTitle
          pill="WHY IT MATTERS"
          title={
            <>
              Cleaner Air, <span className="vk-gradient-text">Proven</span>
            </>
          }
          subtitle="Hardware-driven purification with real-time proof of performance — built for outdoor monitoring + indoor purification validation."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            title="Active Purification"
            desc="Continuous purification with real-time monitoring — not guesswork." 
            color="emerald"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path
                  d="M21 12a9 9 0 1 1-9-9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            }
          />
          <FeatureCard
            title="Smart Urban Impact"
            desc="Designed for outdoor use-cases where air quality changes rapidly." 
            color="sky"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                <path d="M4 20V8l4-2v14" stroke="currentColor" strokeWidth="1.8" />
                <path d="M10 20V4l4 2v14" stroke="currentColor" strokeWidth="1.8" />
                <path d="M16 20v-9l4 2v7" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            }
          />
          <FeatureCard
            title="Verified Results"
            desc="Outdoor vs Purified comparison + efficiency calculation using PM2.5." 
            color="violet"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                <path d="M7 12l3 3 7-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path
                  d="M21 12a9 9 0 1 1-9-9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            }
          />
          <FeatureCard
            title="Scalable Network"
            desc="Extend to more devices later without changing the dashboard architecture." 
            color="amber"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                <path d="M7 7h10v10H7V7Z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M4 12h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M17 12h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            }
          />
        </div>
      </section>

      {/* DASHBOARD */}
      <section id="dashboard" className="space-y-4 scroll-mt-24">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="vk-pill inline-flex rounded-full px-3 py-1 text-[11px] font-medium">LIVE</div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              VayuKavach V2 – <span className="text-emerald-200">Live Dashboard</span>
            </h2>
            <p className="mt-1 text-sm text-white/55">
              Outdoor Air Quality vs Purified Air Quality — continuously updated.
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
