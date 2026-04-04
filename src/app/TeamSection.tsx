"use client";

import { motion } from "framer-motion";

type Member = {
  name: string;
  role: string;
  description: string;
  meta: string;
  accent: "green" | "cyan" | "violet" | "amber";
};

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } },
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

function tone(accent: Member["accent"]) {
  switch (accent) {
    case "green":
      return {
        ring: "ring-emerald-400/20",
        glow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.25)]",
        tag: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
        orb: "from-emerald-400/35 via-emerald-400/10 to-transparent",
        avatar: "from-emerald-300 to-green-500",
      };
    case "cyan":
      return {
        ring: "ring-cyan-400/20",
        glow: "hover:shadow-[0_0_40px_rgba(34,211,238,0.22)]",
        tag: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
        orb: "from-cyan-400/35 via-cyan-400/10 to-transparent",
        avatar: "from-cyan-300 to-sky-500",
      };
    case "violet":
      return {
        ring: "ring-violet-400/20",
        glow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.22)]",
        tag: "border-violet-400/25 bg-violet-400/10 text-violet-200",
        orb: "from-violet-400/35 via-violet-400/10 to-transparent",
        avatar: "from-violet-300 to-fuchsia-500",
      };
    case "amber":
    default:
      return {
        ring: "ring-amber-400/20",
        glow: "hover:shadow-[0_0_40px_rgba(251,146,60,0.18)]",
        tag: "border-amber-400/25 bg-amber-400/10 text-amber-200",
        orb: "from-amber-400/35 via-amber-400/10 to-transparent",
        avatar: "from-amber-200 to-orange-500",
      };
  }
}

function TeamCard({ member, large }: { member: Member; large?: boolean }) {
  const t = tone(member.accent);

  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.03, y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={
        "group relative overflow-hidden rounded-[22px] border border-emerald-400/15 bg-white/5 p-6 sm:p-7 backdrop-blur-xl ring-1 " +
        t.ring +
        " transition-all duration-300 " +
        t.glow
      }
    >
      {/* ambient orb */}
      <div aria-hidden className={`pointer-events-none absolute -top-20 right-[-60px] h-56 w-56 rounded-full bg-gradient-to-br ${t.orb} blur-3xl`} />

      {/* gradient border wash */}
      <div className="pointer-events-none absolute inset-0 rounded-[22px] p-px opacity-70">
        <div className="h-full w-full rounded-[21px] bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
      </div>

      <div className="relative flex flex-col items-center text-center">
        {/* Avatar */}
        <motion.div
          aria-hidden
          className="relative"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" as any }}
        >
          <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-full bg-gradient-to-br from-white/10 to-white/5 p-[2px] shadow-[0_0_25px_rgba(16,185,129,0.12)]">
            <div className={`grid h-full w-full place-items-center rounded-full bg-gradient-to-br ${t.avatar} text-black font-bold`}>{initials(member.name)}</div>
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-full blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.25), transparent 60%)" }} />
        </motion.div>

        <div className="mt-5">
          <div className={"inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide " + t.tag}>
            {member.role}
          </div>
          <h3 className={"mt-3 font-semibold text-white " + (large ? "text-xl sm:text-2xl" : "text-lg")}>{member.name}</h3>
          <p className={"mt-3 text-sm leading-relaxed text-white/70 " + (large ? "max-w-[46ch]" : "max-w-[40ch]")}>
            {member.description}
          </p>

          <div className="mt-5 inline-flex items-center rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold text-white/60">
            {member.meta}
          </div>
        </div>
      </div>

      {/* subtle sheen */}
      <div className="pointer-events-none absolute -left-24 top-0 h-full w-24 bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
}

export default function TeamSection() {
  const top: Member[] = [
    {
      name: "Aryan Kumar Bhargava",
      role: "Web & ESP32 Lead",
      description: "Leading full-stack development and ESP32 firmware integration for real-time system performance.",
      meta: "UG Student, CSE, MITS Gwalior",
      accent: "green",
    },
    {
      name: "Tejaswa Singh Rana",
      role: "Hardware Specialist",
      description: "Expert in sensor calibration, circuit design, and hardware integration.",
      meta: "UG Student, CSE, MITS Gwalior",
      accent: "cyan",
    },
  ];

  const bottom: Member[] = [
    {
      name: "Vansh Trivedi",
      role: "Communication & Hardware",
      description: "Managing system communication and assisting in hardware assembly and implementation.",
      meta: "UG Student, CSE, MITS Gwalior",
      accent: "violet",
    },
    {
      name: "Vansh Shrivastava",
      role: "Innovation Lead",
      description: "Driving project ideas and overseeing practical implementation of hardware solutions.",
      meta: "UG Student, CSE, MITS Gwalior",
      accent: "amber",
    },
  ];

  return (
    <section id="team" className="relative overflow-hidden py-16 sm:py-24">
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#05060a] via-[#082015] to-[#02030a]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.14),transparent_55%)]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_15%_55%,rgba(56,189,248,0.08),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold tracking-[0.28em] text-emerald-200">
            TEAM
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white">
            Student Development Team
          </h2>
          <p className="mt-4 text-base sm:text-xl text-white/65 max-w-3xl mx-auto leading-relaxed">
            The core team building VayuKavach from concept to reality
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          className="space-y-6 sm:space-y-7"
        >
          {/* Top row (2 large, centered) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:max-w-5xl mx-auto">
            {top.map((m) => (
              <TeamCard key={m.name} member={m} large />
            ))}
          </div>

          {/* Bottom row (smaller) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:max-w-5xl mx-auto">
            {bottom.map((m) => (
              <TeamCard key={m.name} member={m} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
