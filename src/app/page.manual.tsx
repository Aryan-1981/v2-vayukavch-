import LiveCards from "@/app/LiveCards";
import { getLatest } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="vk-glass rounded-3xl p-6 sm:p-10">
          <div className="text-xs font-semibold tracking-[0.28em] text-white/55">{eyebrow}</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="vk-gradient-text">{title}</span>
          </h2>
          <div className="mt-6 text-sm leading-relaxed text-white/70">{children}</div>
        </div>
      </div>
    </section>
  );
}

function ParticleBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-1/2 top-[-200px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute left-[-180px] top-[20%] h-[520px] w-[520px] rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute right-[-220px] top-[45%] h-[560px] w-[560px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.10),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.28)_1px,transparent_1px)] [background-size:80px_80px]" />
    </div>
  );
}

function Nav() {
  const links: Array<{ href: string; label: string }> = [
    { href: "#home", label: "Home" },
    { href: "#problem", label: "Problem" },
    { href: "#dashboard", label: "Dashboard" },
    { href: "#system", label: "System" },
    { href: "#impact", label: "Impact" },
    { href: "#future", label: "Future" },
    { href: "#about", label: "About" },
    { href: "#team", label: "Team" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#home" className="text-sm font-semibold tracking-tight">
          <span className="vk-gradient-text">VayuKavach</span> <span className="text-white/60">V2</span>
        </a>
        <nav className="hidden gap-4 text-xs text-white/70 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#dashboard"
          className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/15"
        >
          Live
        </a>
      </div>
    </div>
  );
}

export default async function Page() {
  const [initialOuter, initialPurified] = await Promise.all([getLatest("outer"), getLatest("purified")]);

  return (
    <main className="vk-bg relative">
      <ParticleBackdrop />
      <Nav />

      <section id="home" className="relative scroll-mt-24 pb-12 pt-16 sm:pb-16 sm:pt-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="vk-glass rounded-3xl p-8 sm:p-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              Heavy animated single-page experience • Updated for V2
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
              Breathe <span className="vk-gradient-text">cleaner air</span>.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              Two devices—<span className="text-white">Outdoor</span> and <span className="text-white">Purified</span>—
              live-updating every few seconds.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#dashboard"
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-white/90"
              >
                View Live Dashboard
              </a>
              <a
                href="#system"
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                How it works
              </a>
            </div>
          </div>
        </div>
      </section>

      <Section id="problem" eyebrow="AIR QUALITY" title="The Problem">
        Urban air pollution impacts health, productivity, and quality of life. Fine particulate matter (PM1/PM2.5/PM10)
        penetrates deep into the lungs—often without being noticed day-to-day.
      </Section>

      <section id="dashboard" className="relative scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="vk-glass rounded-3xl p-6 sm:p-10">
            <div className="text-xs font-semibold tracking-[0.28em] text-white/55">LIVE</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              <span className="vk-gradient-text">Outdoor vs Purified</span> (V2)
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-white/70">
              Devices: <span className="font-semibold text-white">outer</span> &{" "}
              <span className="font-semibold text-white">purified</span>. Includes a PM2.5 comparison chart and
              purification efficiency.
            </p>

            <div className="mt-8">
              <LiveCards initialOuter={initialOuter} initialPurified={initialPurified} refreshMs={5000} />
            </div>
          </div>
        </div>
      </section>

      <Section id="system" eyebrow="V2 EQUIPMENT" title="System">
        V2 measures particulate matter outdoors and after purification. The dashboard calculates purification efficiency
        from PM2.5 reduction and visualizes both time-series streams.
      </Section>

      <Section id="impact" eyebrow="OUTCOMES" title="Impact">
        Cleaner indoor air can reduce exposure to harmful particulates and support better sleep, comfort, and overall
        wellbeing—especially in pollution-prone environments.
      </Section>

      <Section id="future" eyebrow="ROADMAP" title="Future">
        Next steps include longer retention charts, alerts, and deeper insights—without exposing secrets client-side.
      </Section>

      <Section id="about" eyebrow="PROJECT" title="About">
        This recreates a single-page flow while modernizing the data layer for V2 (outer/purified) with safe server-side
        access.
      </Section>

      <Section id="team" eyebrow="PEOPLE" title="Team">
        A small team of builders iterating quickly—hardware, firmware and software—to deliver measurable improvements in
        air quality.
      </Section>

      <Section id="contact" eyebrow="GET IN TOUCH" title="Contact">
        Reach out for pilots, deployments, and collaborations.
      </Section>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            © {new Date().getFullYear()} <span className="text-white/70">VayuKavach</span>
          </div>
          <div className="font-mono">live: /api/latest?device_id=outer|purified</div>
        </div>
      </div>
    </main>
  );
}
