"use client";

import { motion } from "framer-motion";

export type HowItWorksStep = {
  title: string;
  description: string;
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as any } },
};

function StepCard({ step, index }: { step: HowItWorksStep; index: number }) {
  return (
    <motion.li variants={item} className="relative pl-10 sm:pl-14">
      {/* Node */}
      <div className="absolute left-0 top-5 sm:top-6">
        <div className="relative">
          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border border-cyan-400/30 bg-black/60 backdrop-blur-md shadow-[0_0_25px_rgba(34,211,238,0.22)]" />
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-full bg-cyan-400/15"
            animate={{ opacity: [0.25, 0.6, 0.25], scale: [1, 1.22, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" as any, delay: index * 0.15 }}
          />
        </div>
      </div>

      {/* Card */}
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="group rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-md shadow-[0_12px_60px_rgba(0,0,0,0.35)] hover:border-white/20"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-[0.26em] text-cyan-300/80">STEP {index + 1}</div>
            <h3 className="mt-2 text-lg sm:text-xl font-semibold text-white">{step.title}</h3>
          </div>

          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-white/70">
            →
          </div>
        </div>

        <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/70">{step.description}</p>

        {/* Micro sheen */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -left-24 top-0 h-full w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </motion.div>
    </motion.li>
  );
}

export default function HowItWorks({ steps }: { steps: HowItWorksStep[] }) {
  return (
    <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-10 left-1/2 h-40 w-[520px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative">
        {/* Vertical connector */}
        <div className="absolute left-[11px] sm:left-[13px] top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/0 via-cyan-400/35 to-cyan-400/0" />
        <motion.div
          aria-hidden
          className="absolute left-[11px] sm:left-[13px] top-0 h-24 w-px bg-gradient-to-b from-transparent via-cyan-300/70 to-transparent"
          animate={{ y: [0, 520, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" as any }}
        />

        <motion.ol
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          className="space-y-6 sm:space-y-7"
        >
          {steps.map((s, i) => (
            <StepCard key={`${s.title}-${i}`} step={s} index={i} />
          ))}
        </motion.ol>
      </div>
    </div>
  );
}
