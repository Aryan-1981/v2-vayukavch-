"use client";

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as any } },
};

function FloatingIcon({ children, tone }: { children: React.ReactNode; tone: string }) {
  return (
    <motion.div
      aria-hidden
      className={
        "relative grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md " +
        tone
      }
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3.3, repeat: Infinity, ease: "easeInOut" as any }}
    >
      {children}
    </motion.div>
  );
}

function Card({
  accent,
  glow,
  icon,
  title,
  text,
}: {
  accent: string;
  glow: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className={
        "group relative overflow-hidden rounded-[20px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 " +
        glow
      }
    >
      {/* Gradient border wash */}
      <div className="pointer-events-none absolute inset-0 rounded-[20px] p-px opacity-70">
        <div className={`h-full w-full rounded-[19px] ${accent}`} />
      </div>

      <div className="relative">
        <div className="flex items-start gap-4">
          {icon}
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-white/70">{text}</p>
      </div>

      {/* Subtle sheen */}
      <div className="pointer-events-none absolute -left-24 top-0 h-full w-24 bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
}

export default function AboutVayuKavach() {
  return (
    <section id="about" className="relative overflow-hidden py-16 sm:py-24">
      {/* Dark gradient background */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#04050a] via-[#050a18] to-[#02030a]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.10),transparent_55%)]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_12%_60%,rgba(56,189,248,0.10),transparent_55%)]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_88%_55%,rgba(168,85,247,0.10),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-500">
              VayuKavach
            </span>
          </h2>
          <p className="text-base sm:text-xl text-white/65 max-w-3xl mx-auto leading-relaxed">
            Vehicle-mounted real-time air purification system for smarter cities
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6"
        >
          <Card
            accent="bg-gradient-to-br from-emerald-500/25 via-emerald-400/5 to-transparent"
            glow="hover:shadow-[0_0_32px_rgba(16,185,129,0.30)]"
            icon={
              <FloatingIcon tone="shadow-[0_0_18px_rgba(16,185,129,0.18)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-emerald-300" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 14l2-5h14l2 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M6 14v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M18 14v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 18h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 6c2.5 0 3.5 2 6 2s3.5-2 6-2 3.5 2 6 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </FloatingIcon>
            }
            title="Mobile Air Purification"
            text="Mounted on vehicle rooftops, the system actively purifies urban air as the vehicle moves through the city."
          />

          <Card
            accent="bg-gradient-to-br from-sky-500/25 via-sky-400/5 to-transparent"
            glow="hover:shadow-[0_0_32px_rgba(56,189,248,0.30)]"
            icon={
              <FloatingIcon tone="shadow-[0_0_18px_rgba(56,189,248,0.18)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-sky-300" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 9h6v6H9V9Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 9h2M4 15h2M18 9h2M18 15h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M9 4v2M15 4v2M9 18v2M15 18v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </FloatingIcon>
            }
            title="Dual ESP32 System"
            text="Two ESP32 controllers manage real-time processing and communication for accurate and reliable operation."
          />

          <Card
            accent="bg-gradient-to-br from-fuchsia-500/25 via-violet-400/5 to-transparent"
            glow="hover:shadow-[0_0_32px_rgba(168,85,247,0.30)]"
            icon={
              <FloatingIcon tone="shadow-[0_0_18px_rgba(168,85,247,0.18)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-violet-300" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 12c3-6 13-6 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 12c3 6 13 6 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 12h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </FloatingIcon>
            }
            title="Dual Air Monitoring"
            text="Two PMS7003 sensors measure both polluted and purified air, providing real-time proof of effectiveness."
          />

          <Card
            accent="bg-gradient-to-br from-amber-500/25 via-orange-400/5 to-transparent"
            glow="hover:shadow-[0_0_32px_rgba(251,146,60,0.28)]"
            icon={
              <FloatingIcon tone="shadow-[0_0_18px_rgba(251,146,60,0.16)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-orange-300" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M7 8c3-2 7-2 10 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M6 21l6-3 6 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 9v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </FloatingIcon>
            }
            title="Enhanced Airflow"
            text="Integrated blower increases air intake and output, improving purification efficiency during motion."
          />

          <Card
            accent="bg-gradient-to-br from-emerald-500/18 via-sky-400/6 to-transparent"
            glow="hover:shadow-[0_0_32px_rgba(34,197,94,0.22)]"
            icon={
              <FloatingIcon tone="shadow-[0_0_18px_rgba(34,197,94,0.14)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-emerald-200" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 5h16v14H4V5Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 15l3-3 2 2 4-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 9h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </FloatingIcon>
            }
            title="Live Data & Transparency"
            text="Real-time air quality data is displayed on onboard OLED screens and a live web dashboard for monitoring and analysis."
          />
        </motion.div>

        {/* On lg, 5 cards is dense; add a subtle note area for spacing consistency. */}
        <div className="mt-10 sm:mt-12 h-px w-full bg-gradient-to-r from-white/0 via-white/10 to-white/0" />
      </div>
    </section>
  );
}
