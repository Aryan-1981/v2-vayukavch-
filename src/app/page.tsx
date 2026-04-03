import LiveCards from "@/app/LiveCards";
import { getLatest } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function Section(props: {
  id?: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  const { id, eyebrow, title, subtitle, children } = props;
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="inline-flex vk-pill rounded-full px-3 py-1 text-[11px] font-medium tracking-wide">
            {eyebrow}
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          {subtitle ? (
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">{subtitle}</p>
          ) : null}
        </div>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}

function Card(props: { title: string; desc: string }) {
  return (
    <div className="vk-glass rounded-2xl p-5">
      <div className="text-sm font-semibold">{props.title}</div>
      <div className="mt-1 text-xs leading-relaxed text-white/55">{props.desc}</div>
    </div>
  );
}

function Stat(props: { label: string; value: string; tint: string }) {
  return (
    <div className="vk-glass rounded-2xl px-5 py-4">
      <div className={`text-xl font-semibold ${props.tint}`}>{props.value}</div>
      <div className="mt-1 text-[11px] text-white/50">{props.label}</div>
    </div>
  );
}

export default async function Home() {
  const [outer, purified] = await Promise.all([getLatest("outer"), getLatest("purified")]);

  return (
    <div className="space-y-20">
      <section className="pt-2">
        <div className="mx-auto max-w-6xl">
          <div className="vk-glass rounded-3xl p-6 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 vk-pill rounded-full px-3 py-1 text-[11px] font-medium tracking-wide">
                  <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
                  REAL‑TIME • V2 • OUTDOOR vs PURIFIED
                </div>

                <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-6xl">
                  VayuKavach <span className="vk-gradient-text">Smart Air Protection</span>
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
                  A hardware-driven system that monitors outdoor air quality and proves purification performance in real time.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-2">
                  <a
                    href="#live"
                    className="vk-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white/85 ring-1 ring-white/10 hover:bg-white/10"
                  >
                    View Live Dashboard
                    <span className="text-white/40">→</span>
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/10"
                  >
                    Contact
                  </a>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Stat label="Sensors" value="2" tint="text-emerald-200" />
                  <Stat label="Update" value="~5s" tint="text-sky-200" />
                  <Stat label="Devices" value="2× ESP" tint="text-violet-200" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="text-xs text-white/50">Devices</div>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs text-white/50">device_id</div>
                      <div className="mt-1 font-mono text-xs text-white/80">outer</div>
                      <div className="mt-1 text-xs text-white/55">Outdoor sensor</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs text-white/50">device_id</div>
                      <div className="mt-1 font-mono text-xs text-white/80">purified</div>
                      <div className="mt-1 text-xs text-white/55">Purified output</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="text-xs text-white/50">Ingest</div>
                  <div className="mt-2 font-mono text-xs break-all text-white/80">POST /api/ingest</div>
                  <div className="mt-1 text-xs text-white/55">JSON: device_id (outer|purified), pm1, pm25, pm10</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="text-xs text-white/50">Read</div>
                  <div className="mt-2 font-mono text-xs break-all text-white/80">GET /api/latest</div>
                  <div className="mt-1 text-xs text-white/55">Auto-refresh + comparison chart included.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrow="THE PROBLEM"
        title={
          <>
            Air pollution is <span className="text-rose-200">invisible</span>. The damage isn’t.
          </>
        }
        subtitle="PM2.5 can change fast. Without continuous sensing and verification, you can’t measure real improvement."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Rapid variability" desc="Traffic, construction, and wind can spike pollution within minutes." />
          <Card title="Exposure adds up" desc="Even moderate particulate exposure over time affects health outcomes." />
          <Card title="No proof" desc="Purification without measurement is guesswork — V2 shows the delta." />
        </div>
      </Section>

      <Section
        eyebrow="THE SYSTEM"
        title={
          <>
            Measure → Purify → <span className="vk-gradient-text">Verify</span>
          </>
        }
        subtitle="Two sensors (outer/purified) enable direct comparison and a live purification efficiency score."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Outdoor sensor (outer)" desc="Tracks ambient particulate baseline in real time." />
          <Card title="Purified sensor (purified)" desc="Measures post-filtration air output for proof-of-performance." />
        </div>

        <div className="mt-4 vk-glass rounded-2xl p-5">
          <div className="text-sm font-semibold">Efficiency formula</div>
          <div className="mt-2 text-xs leading-relaxed text-white/60">
            <span className="font-mono text-white/80">((Outdoor PM2.5 − Purified PM2.5) / Outdoor PM2.5) × 100</span>
          </div>
        </div>
      </Section>

      <section id="live" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="vk-pill inline-flex rounded-full px-3 py-1 text-[11px] font-medium">LIVE</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Live Dashboard – <span className="text-emerald-200">Outdoor vs Purified</span>
              </h2>
              <p className="mt-1 text-sm text-white/55">Auto-refreshing, includes PM2.5 comparison graph + efficiency.</p>
            </div>
            <div className="text-xs text-white/40">
              Refresh interval: <span className="font-mono text-white/60">5s</span>
            </div>
          </div>

          <div className="mt-4 vk-glass rounded-3xl p-6">
            <LiveCards initialOuter={outer} initialPurified={purified} refreshMs={5000} />
          </div>
        </div>
      </section>

      <Section
        eyebrow="IMPACT"
        title={
          <>
            Better decisions with <span className="text-emerald-200">real-time proof</span>
          </>
        }
        subtitle="See baseline and purified output together to validate filtration and placement."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Operational proof" desc="Verify purifier performance under current outdoor conditions." />
          <Card title="Placement insights" desc="Optimize installation by comparing spikes vs output." />
          <Card title="Scalable" desc="Add more nodes later with the same ingestion model." />
        </div>
      </Section>

      <Section
        eyebrow="FUTURE"
        title={
          <>
            Towards a <span className="vk-gradient-text">smart air network</span>
          </>
        }
        subtitle="V2 is designed to expand: historical analytics, alerts, and more devices."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Historical ranges" desc="Daily/weekly trends via a history endpoint." />
          <Card title="Alerts" desc="Notifications when PM crosses thresholds." />
        </div>
      </Section>

      <Section
        eyebrow="TEAM"
        title={
          <>
            Built by <span className="text-sky-200">students</span>
          </>
        }
        subtitle="Send names/photos to recreate your original team section exactly."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card title="Embedded" desc="ESP firmware + sensor integration" />
          <Card title="Backend" desc="Ingest + secure server-side Supabase" />
          <Card title="Frontend" desc="Landing + live visualization" />
        </div>
      </Section>

      <Section
        id="contact"
        eyebrow="CONTACT"
        title={
          <>
            Let’s deploy <span className="vk-gradient-text">VayuKavach</span>
          </>
        }
        subtitle="Replace placeholders with your official contact info."
      >
        <div className="vk-glass rounded-3xl p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-xs text-white/50">Email</div>
              <div className="mt-1 text-sm font-semibold text-white/80">your-email@example.com</div>
            </div>
            <div>
              <div className="text-xs text-white/50">GitHub</div>
              <a
                className="mt-1 inline-block text-sm font-semibold text-white/80 underline decoration-white/20 underline-offset-4 hover:decoration-white/40"
                href="https://github.com/Aryan-1981/vayukavach"
                target="_blank"
                rel="noreferrer"
              >
                github.com/Aryan-1981/vayukavach
              </a>
            </div>
            <div>
              <div className="text-xs text-white/50">API</div>
              <div className="mt-1 font-mono text-xs text-white/80">GET /api/latest?device_id=outer</div>
              <div className="mt-1 font-mono text-xs text-white/80">GET /api/latest?device_id=purified</div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
