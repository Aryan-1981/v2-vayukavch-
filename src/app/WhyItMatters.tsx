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

function FloatingIcon({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      aria-hidden
      className="relative grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" as any }}
    >
      {children}
    </motion.div>
  );
}

function RefreshGlyph() {
  return (
    <motion.svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-emerald-300"
      animate={{ rotate: 360 }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" as any }}
    >
      <path
        d="M21 12a9 9 0 1 1-2.64-6.36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21 3v6h-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function Card({
  accent,
  glow,
  icon,
  title,
  text,
  footer,
}: {
  accent: string;
  glow: string;
  icon: React.ReactNode;
  title: string;
  text: React.ReactNode;
  footer?: React.ReactNode;
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
      {/* Gradient border */}
      <div className="pointer-events-none absolute inset-0 rounded-[20px] p-px opacity-70">
        <div className={`h-full w-full rounded-[19px] ${accent}`} />
      </div>

      {/* Card body */}
      <div className="relative">
        <div className="flex items-start gap-4">
          {icon}
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-white/70">{text}</p>

        {footer ? (
          <div className="mt-5 flex items-center justify-between">
            <div className="text-xs font-semibold tracking-wide text-white/50">{footer}</div>
            <div className="h-px flex-1 mx-3 bg-gradient-to-r from-white/0 via-white/15 to-white/0" />
          </div>
        ) : null}
      </div>

      {/* Subtle sheen */}
      <div className="pointer-events-none absolute -left-24 top-0 h-full w-24 bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
}

export default function WhyItMatters() {
  return (
    <section
      id="impact"
      className="relative overflow-hidden py-16 sm:py-24"
    >
      {/* Deep dark gradient background */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#05060a] via-[#050914] to-[#02030a]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.12),transparent_55%)]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_15%_55%,rgba(56,189,248,0.10),transparent_55%)]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_85%_50%,rgba(168,85,247,0.10),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
            Why It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-500">Matters</span>
          </h2>
          <p className="text-base sm:text-xl text-white/65 max-w-3xl mx-auto leading-relaxed">
            Hardware-driven purification with real-time proof of performance
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          <Card
            accent="bg-gradient-to-br from-emerald-500/25 via-emerald-400/5 to-transparent"
            glow="hover:shadow-[0_0_32px_rgba(16,185,129,0.35)]"
            icon={
              <FloatingIcon>
                <RefreshGlyph />
              </FloatingIcon>
            }
            title="Active Purification"
            text={
              <>
                <span className="font-semibold text-white">HEPA filters</span> running{" "}
                <span className="font-semibold text-emerald-300">24/7</span> actively cleaning air, not just monitoring it
              </>
            }
          />

          <Card
            accent="bg-gradient-to-br from-sky-500/25 via-sky-400/5 to-transparent"
            glow="hover:shadow-[0_0_32px_rgba(56,189,248,0.35)]"
            icon={
              <FloatingIcon>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-sky-300" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M2 12h20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 2c2.8 2.74 4.4 6.3 4.4 10S14.8 19.26 12 22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 2c-2.8 2.74-4.4 6.3-4.4 10S9.2 19.26 12 22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </FloatingIcon>
            }
            title="Smart Urban Impact"
            text={
              <>Each rooftop-mounted purifier actively cleans outdoor urban air as the vehicle moves through the city</>
            }
            footer={<>Moving Air Purifier</>}
          />

          <Card
            accent="bg-gradient-to-br from-fuchsia-500/25 via-violet-400/5 to-transparent"
            glow="hover:shadow-[0_0_32px_rgba(168,85,247,0.35)]"
            icon={
              <FloatingIcon>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-violet-300" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 19V5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 19V9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 19V13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M22 19V7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </FloatingIcon>
            }
            title="Verified Results"
            text={
              <>
                <span className="font-semibold text-violet-200">100%</span> real-time proof via PM7003 sensor—no guesswork, just data
              </>
            }
          />

          <Card
            accent="bg-gradient-to-br from-amber-500/25 via-orange-400/5 to-transparent"
            glow="hover:shadow-[0_0_32px_rgba(251,146,60,0.35)]"
            icon={
              <FloatingIcon>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-orange-300" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7 7h10v10H7V7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 12h10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 7v10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 4l3 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M20 4l-3 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 20l3-3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M20 20l-3-3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </FloatingIcon>
            }
            title="Scalable Network"
            text={
              <>
                Deployable across entire vehicle fleets to create city-wide purification{" "}
                <span className="font-semibold text-orange-200">∞</span>
              </>
            }
          />
        </motion.div>
      </div>
    </section>
  );
}
