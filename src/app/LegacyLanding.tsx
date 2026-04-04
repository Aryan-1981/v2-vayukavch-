"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import EfficiencyCard from "./EfficiencyCard";
import PremiumAirQualityChart from "./PremiumAirQualityChart";
import HowItWorks from "./HowItWorks";
import Section from "./Section";
import ParticleField from "./ParticleField";
import AnimatedLogo from "./AnimatedLogo";
import PurifierLogo from "./PurifierLogo";

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

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

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
    <div className="w-screen min-h-screen bg-[#0a0a0a] text-white selection:bg-green-500/30 overflow-x-hidden">
      {/* Nature ambience background */}
      <div aria-hidden="true" className="vk-nature-bg" />
      {/* Ambient / Particles - Full Screen Fixed */}
      <div aria-hidden="true" className="fixed inset-0 -z-10 w-screen h-screen pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,197,94,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(56,189,248,0.08),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.28)_1px,transparent_1px)] [background-size:90px_90px] animate-[vk-rotate_180s_linear_infinite]" />
        <div className="absolute inset-0 opacity-70">
          <ParticleField className="absolute inset-0 w-full h-full" density={46} />
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
        <div className="w-screen px-4 sm:px-6 px-4 sm:px-6 flex justify-between items-center">
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
      <section id="home" className="relative w-screen min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#112211] to-[#0a0a0a] z-0" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-green-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />

        <motion.div 
          className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto py-20"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
            <span className="px-3 sm:px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-sm">
              SMART ROOFTOP AIR PURIFICATION
            </span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8">
            Purifying Air <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">On The Move</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2">
            A rooftop-mounted air purification system for urban vehicles. Actively cleans polluted air while driving, verified by
            real-time PM7003 sensor readings.
          </motion.p>

          {/* Car Logo */}
          <motion.div variants={fadeInUp} className="mx-auto mb-12 flex justify-center">
            <PurifierLogo animated size={120} variant="icon" theme="dark" />
          </motion.div>

          <motion.div variants={fadeInUp} className="mx-auto mb-8 flex max-w-xl items-center justify-center gap-6 text-xs">
            <span className="text-orange-400">Polluted Air In</span>
            <span className="text-white/30">•</span>
            <span className="text-emerald-300">Clean Air Out</span>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center px-4">
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
          </motion.div>
        </motion.div>
      </section>

            {/* Problem */}
      <section id="problem" className={`min-h-screen py-16 sm:py-24 relative ${visibleSections.problem ? "scroll-reveal" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* WHAT MAKES US DIFFERENT Banner - Sleek Card Style */}
          <div className="mb-20 sm:mb-32">
            <div className="rounded-2xl p-6 sm:p-8 border border-white/10 bg-black/40 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-colors">
              {/* Left green accent border */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-green-600 rounded-l-2xl" />
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Lightning Icon */}
                <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-2xl">
                  ⚡
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="text-xs sm:text-sm font-semibold text-green-400 tracking-wide mb-2 uppercase">
                    WHAT MAKES US DIFFERENT
                  </div>
                  <p className="text-white text-sm sm:text-base leading-relaxed">
                    Unlike traditional air monitoring systems, VayuKavach <span className="text-green-400 font-semibold">actively purifies outdoor air</span> in real-time as vehicles move through the city, and <span className="text-green-400 font-semibold">verifies performance</span> using PM7003 sensor data—delivering proven results, not just observations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* THE URBAN CHALLENGE Section */}
          <div className="text-center mb-16">
            <span className="px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-sm inline-block mb-4">
              THE URBAN CHALLENGE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Vehicles: From <span className="text-red-400">Polluters</span> to <span className="text-green-400">Purifiers</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto mb-16">
              Modern cities face a dense concentration of pollution at ground level. VayuKavach specifically targets the most harmful zones—the roads—using simple aerodynamics.
            </p>
          </div>

          {/* 3 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl p-8 border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-6 text-2xl border border-red-500/30">
                💨
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Traffic Exhaust Zones</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                The highest levels of toxic PM2.5 and PM10 particles hang in layers exactly where pedestrians, cyclists, and drivers commute.
              </p>
            </div>
            
            <div className="rounded-3xl p-8 border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6 text-2xl border border-blue-500/30">
                ⚡
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Passive Air Intake</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Moving vehicles naturally encounter immense air resistance. We capture this incoming air through passive scoops, relying less on internal fans.
              </p>
            </div>
            
            <div className="rounded-3xl p-8 border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-6 text-2xl border border-green-500/30">
                🚌
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Wasted Rooftop Space</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Millions of buses, cabs, and delivery trucks drive empty, flat roofs around the city all day. We transform this unused asset into an active filtration grid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section id="dashboard" className={`py-16 sm:py-24 relative ${visibleSections.dashboard ? "scroll-reveal" : ""}`}>
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

          <div className="-mx-4 sm:mx-0 mb-10 sm:mb-12">
            <div className="flex gap-4 px-4 sm:px-0 overflow-x-auto sm:overflow-visible sm:grid sm:grid-cols-4 sm:gap-6 [scrollbar-width:none] [-ms-overflow-style:none]">
              <div className="min-w-[280px] sm:min-w-0 rounded-3xl p-6 sm:p-10 border border-white/10 bg-white/5">
                <div className="text-sm sm:text-base text-gray-400">Outdoor PM2.5</div>
                <div className="mt-3 sm:mt-4 text-4xl sm:text-6xl font-bold">{outer?.pm25 != null ? <CountUp end={outer.pm25} decimals={1} duration={1.5} preserveValue /> : "--"}</div>
                <div className="mt-2 sm:mt-3 text-sm text-gray-500">µg/m³</div>
              </div>

              <div className="min-w-[280px] sm:min-w-0 rounded-3xl p-6 sm:p-10 border border-white/10 bg-white/5">
                <div className="text-sm sm:text-base text-gray-400">Purified PM2.5</div>
                <div className="mt-3 sm:mt-4 text-4xl sm:text-6xl font-bold">{purified?.pm25 != null ? <CountUp end={purified.pm25} decimals={1} duration={1.5} preserveValue /> : "--"}</div>
                <div className="mt-2 sm:mt-3 text-sm text-gray-500">µg/m³</div>
                <div className={`mt-2 sm:mt-3 text-sm font-medium ${status.color}`}>{status.text}</div>
              </div>

              <div className="min-w-[280px] sm:min-w-0 rounded-3xl p-6 sm:p-10 border border-white/10 bg-white/5">
                <div className="text-sm sm:text-base text-gray-400">Outdoor PM10</div>
                <div className="mt-3 sm:mt-4 text-4xl sm:text-6xl font-bold">{outer?.pm10 != null ? <CountUp end={outer.pm10} decimals={1} duration={1.5} preserveValue /> : "--"}</div>
                <div className="mt-2 sm:mt-3 text-sm text-gray-500">µg/m³</div>
              </div>

              <div className="min-w-[280px] sm:min-w-0 rounded-3xl p-6 sm:p-10 border border-white/10 bg-white/5">
                <div className="text-sm sm:text-base text-gray-400">Purified PM10</div>
                <div className="mt-3 sm:mt-4 text-4xl sm:text-6xl font-bold">{purified?.pm10 != null ? <CountUp end={purified.pm10} decimals={1} duration={1.5} preserveValue /> : "--"}</div>
                <div className="mt-2 sm:mt-3 text-sm text-gray-500">µg/m³</div>
              </div>
            </div>
          </div>

          <EfficiencyCard outerPM={outer?.pm25 ?? null} purifiedPM={purified?.pm25 ?? null} />

          <div className="mt-10 sm:mt-12">
            <PremiumAirQualityChart data={outerHistory} height={320} title="Outdoor Trends (Baseline)" subtitle="PM2.5 vs PM10" />
          </div>
        </div>
      </section>

      <section id="system" className={`py-16 sm:py-24 relative `}>
        <div className="w-screen px-4 sm:px-6 px-4 sm:px-6">
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

          <HowItWorks
            steps={[
              { title: "Polluted Air In", description: "Intake scoop captures high-density road pollution as the vehicle moves." },
              { title: "Filtration", description: "Air passes through a multi-stage filtration stack designed to trap PM2.5 and PM10." },
              { title: "PM7003 Sensor", description: "A sensor measures particulate levels on the outlet path for verified performance." },
              { title: "Blower Fan", description: "A controlled fan maintains steady flow across the filters and through the device." },
              { title: "Clean Air Out", description: "Purified air is released back into the environment—measurable and repeatable." },
            ]}
          />
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
