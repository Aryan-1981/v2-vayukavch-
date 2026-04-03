"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Section from "./Section";
import ParticleField from "./ParticleField";
import AnimatedLogo from "./AnimatedLogo";

type DeviceId = "outer" | "purified";

type LatestReading = {
  device_id: DeviceId;
  pm1: number | null;
  pm25: number | null;
  pm10: number | null;
  created_at: string;
};

type HistoryPoint = {
  time: string;
  PM1: number;
  PM2_5: number;
  PM10: number;
};

function formatTimeLabel(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "--";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function calcEfficiency(outdoorPm25: number | null, purifiedPm25: number | null) {
  if (outdoorPm25 == null || purifiedPm25 == null) return null;
  if (outdoorPm25 <= 0) return null;
  return ((outdoorPm25 - purifiedPm25) / outdoorPm25) * 100;
}

function aqiStatus(pm25: number | null) {
  if (pm25 == null) {
    return { text: "Loading", color: "text-gray-400", desc: "Waiting for sensor data..." };
  }
  if (pm25 <= 12) return { text: "Pristine", color: "text-green-400", desc: "Perfect for outdoor activities." };
  if (pm25 <= 35) return { text: "Moderate", color: "text-yellow-400", desc: "Acceptable air quality." };
  if (pm25 <= 55)
    return { text: "Unhealthy (Sensitive)", color: "text-orange-400", desc: "Sensitive groups should reduce exertion." };
  if (pm25 <= 150) return { text: "Unhealthy", color: "text-red-400", desc: "Everyone may experience health effects." };
  return { text: "Hazardous", color: "text-purple-400", desc: "Health warnings of emergency conditions." };
}

async function fetchLatest(device_id: DeviceId) {
  const res = await fetch(`/api/latest?device_id=${device_id}`, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  const json = (await res.json()) as { reading: LatestReading | null };
  return json.reading;
}

export default function LegacyLanding({
  initialOuter,
  initialPurified,
  refreshMs = 5000,
}: {
  initialOuter: LatestReading | null;
  initialPurified: LatestReading | null;
  refreshMs?: number;
}) {
  const [outer, setOuter] = useState<LatestReading | null>(initialOuter);
  const [purified, setPurified] = useState<LatestReading | null>(initialPurified);
  const [outerHistory, setOuterHistory] = useState<HistoryPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});

  const efficiency = useMemo(() => calcEfficiency(outer?.pm25 ?? null, purified?.pm25 ?? null), [outer, purified]);
  const status = useMemo(() => aqiStatus(purified?.pm25 ?? null), [purified?.pm25]);

  // Intersection observer for reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = (entry.target as HTMLElement).id;
          if (!id) return;
          setVisibleSections((prev) => ({ ...prev, [id]: true }));
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    const sections = Array.from(document.querySelectorAll("section[id]"));
    sections.forEach((s) => observer.observe(s));

    return () => {
      sections.forEach((s) => observer.unobserve(s));
      observer.disconnect();
    };
  }, []);

  // Scroll active section + nav bg
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const ids = ["home", "problem", "dashboard", "system", "impact", "future", "about", "team", "contact"];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 300) setActiveSection(id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Data refresh + history rolling buffer for OUTER (baseline)
  useEffect(() => {
    let cancelled = false;

    const MAX_POINTS = 30;

    async function tick() {
      try {
        const [o, p] = await Promise.all([fetchLatest("outer"), fetchLatest("purified")]);
        if (cancelled) return;

        setOuter(o);
        setPurified(p);
        setError(null);

        if (o) {
          setOuterHistory((prev) => {
            const next: HistoryPoint = {
              time: formatTimeLabel(o.created_at),
              PM1: o.pm1 ?? 0,
              PM2_5: o.pm25 ?? 0,
              PM10: o.pm10 ?? 0,
            };
            const merged = [...prev, next];
            if (merged.length > MAX_POINTS) return merged.slice(merged.length - MAX_POINTS);
            return merged;
          });
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load data");
      }
    }

    tick();
    const interval = window.setInterval(tick, refreshMs);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [refreshMs]);

  const links = [
    "Home",
    "Problem",
    "Dashboard",
    "System",
    "Impact",
    "Future",
    "About",
    "Team",
    "Contact",
  ].map((label) => ({ label, href: `#${label.toLowerCase()}` }));

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen selection:bg-green-500/30 overflow-x-hidden">
      {/* Ambient / Particles */}
      <div aria-hidden="true" className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,197,94,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(56,189,248,0.08),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.28)_1px,transparent_1px)] [background-size:90px_90px]" />
        <div className="absolute inset-0 opacity-70">
          <ParticleField className="absolute inset-0" density={46} />
        </div>
      </div>

      {/* Error Banner */}
      {error ? (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Unable to load sensor data.</span>
            <span className="hidden sm:inline text-xs text-white/70">{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      ) : null}

      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled ? "bg-black/80 backdrop-blur-lg border-b border-white/10 py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AnimatedLogo className="-ml-2" />
          </div>

          <div className="hidden md:flex gap-8 text-sm font-medium text-white/80">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`transition-colors hover:text-green-400 ${activeSection === l.href.slice(1) ? "text-green-400" : ""}`}
              >
                {l.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden p-2 text-white/80 hover:text-green-400 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-lg border-b border-white/10">
            <div className="px-4 py-6 space-y-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-base font-medium transition-colors hover:text-green-400 ${
                    activeSection === l.href.slice(1) ? "text-green-400" : "text-white/80"
                  }`}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </nav>

      {/* Hero */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#112211] to-[#0a0a0a] z-0" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-green-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto py-20">
          <div className="mb-6 flex justify-center">
            <span className="px-3 sm:px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-sm">
              SMART ROOFTOP AIR PURIFICATION • V2
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8">
            Outdoor vs Purified <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">in real time</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2">
            Same single-page experience, updated for V2 equipment: <span className="text-white">outer</span> (baseline) and{" "}
            <span className="text-white">purified</span> (outlet).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <a
              href="#dashboard"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-medium text-sm sm:text-base transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transform hover:-translate-y-1"
            >
              View Live Performance
            </a>
            <a
              href="#system"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-medium text-sm sm:text-base transition-all backdrop-blur-md"
            >
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className={`min-h-screen py-16 sm:py-24 relative ${visibleSections.problem ? "scroll-reveal" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="px-3 sm:px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-sm inline-block mb-4 sm:mb-6">
              THE URBAN CHALLENGE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 text-white px-4">
              Air pollution is <span className="text-red-400">invisible</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
              Fine particulate matter (PM1/PM2.5/PM10) penetrates deep into the lungs. V2 proves purification performance by
              measuring before (outer) and after (purified).
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section id="dashboard" className={`min-h-screen py-16 sm:py-24 relative ${visibleSections.dashboard ? "scroll-reveal" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 gap-4">
            <div>
              <span className="px-3 sm:px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-sm inline-block mb-3 sm:mb-4">
                LIVE FROM V2 DEVICES
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Purification Performance</h2>
              <p className="text-sm sm:text-base text-gray-400">
                Outdoor baseline vs purified outlet. Updates every {Math.round(refreshMs / 1000)}s.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 border border-white/10 bg-white/5 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live data
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="rounded-3xl p-8 border border-white/10 bg-white/5">
              <div className="text-sm text-gray-400">Outdoor PM2.5</div>
              <div className="mt-3 text-5xl font-bold">{outer?.pm25 != null ? outer.pm25.toFixed(1) : "--"}</div>
              <div className="mt-2 text-sm text-gray-500">µg/m³</div>
            </div>
            <div className="rounded-3xl p-8 border border-white/10 bg-white/5">
              <div className="text-sm text-gray-400">Purified PM2.5</div>
              <div className="mt-3 text-5xl font-bold">{purified?.pm25 != null ? purified.pm25.toFixed(1) : "--"}</div>
              <div className="mt-2 text-sm text-gray-500">µg/m³</div>
              <div className={`mt-2 text-sm font-medium ${status.color}`}>{status.text}</div>
            </div>
            <div className="rounded-3xl p-8 border border-white/10 bg-white/5">
              <div className="text-sm text-gray-400">Efficiency</div>
              <div className="mt-3 text-5xl font-bold">
                {efficiency == null ? "--" : `${Math.max(0, Math.min(100, efficiency)).toFixed(0)}%`}
              </div>
              <div className="mt-2 text-sm text-gray-500">PM2.5 reduction</div>
            </div>
          </div>

          <div className="rounded-3xl p-6 md:p-8 border border-white/10 bg-white/5">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-500 rounded-full" />
              Outdoor Trends (Baseline)
            </h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={outerHistory}>
                  <defs>
                    <linearGradient id="colorPM25" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPM1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} opacity={0.3} />
                  <XAxis dataKey="time" stroke="#666" tick={{ fill: "#666", fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#666" tick={{ fill: "#666", fontSize: 12 }} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.9)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid #222",
                      borderRadius: "12px",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Area type="monotone" dataKey="PM2_5" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorPM25)" />
                  <Area type="monotone" dataKey="PM1" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorPM1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section id="system" className={`py-16 sm:py-24 relative ${visibleSections.system ? "scroll-reveal" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="px-3 sm:px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-sm inline-block mb-4 sm:mb-6">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 px-4">
              How It <span className="text-cyan-400">Works</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto px-4">
              Intake → filtration → verified output. V2 uses two sensors to validate purification results.
            </p>
          </div>
        </div>
      </section>

      <Section id="impact" eyebrow="WHY" title="Why it matters">
        {status.desc}
      </Section>

      <Section id="future" eyebrow="COMING SOON" title="Smart City Air Network">
        Expand to multiple nodes, longer history, and alerts.
      </Section>

      <Section id="about" eyebrow="ABOUT" title="About">
        Modern Next.js V2 site with safe server-side data fetching.
      </Section>

      <Section id="team" eyebrow="TEAM" title="Team">
        Team cards can be reintroduced next.
      </Section>

      <Section id="contact" eyebrow="CONTACT" title="Get in Touch">
        Contact form will be re-added next.
      </Section>

      <footer className="py-12 border-t border-white/10 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} VayuKavach Project</p>
      </footer>
    </div>
  );
}
