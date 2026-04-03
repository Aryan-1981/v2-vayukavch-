"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function AnimatedLogo({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div className={className} aria-label="VayuKavach">
      <svg viewBox="0 0 240 64" role="img" aria-hidden="true" className="h-9 w-auto">
        <defs>
          <linearGradient id="vkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#22c55e" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
          <filter id="vkGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 14 -6"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Car silhouette */}
        <path
          d="M36 42c3.2-10.2 9.8-16 20.8-16h30.3c7.5 0 12.5 3.3 16.4 10.2l2.2 3.8H40.4c-1.8 0-3.3 1.5-3.3 3.3V46H30v-3.2c0-0.4 0-0.6 0-0.8Z"
          fill="rgba(255,255,255,0.14)"
          stroke="rgba(255,255,255,0.18)"
        />

        {/* Rooftop module */}
        <rect x="95" y="20" width="22" height="10" rx="3" fill="rgba(34,197,94,0.18)" stroke="rgba(34,197,94,0.35)" />

        {/* Wheels */}
        <circle cx="64" cy="46" r="6" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)" />
        <circle cx="112" cy="46" r="6" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)" />

        {/* Airflow trails */}
        <g filter="url(#vkGlow)">
          <motion.path
            d="M126 24c18 0 22 10 38 10 12.5 0 17-5.5 26-5.5"
            fill="none"
            stroke="url(#vkGrad)"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeDasharray="10 10"
            animate={
              reduce
                ? undefined
                : {
                    strokeDashoffset: [0, -40],
                    opacity: [0.65, 0.95, 0.65],
                  }
            }
            transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M126 32c14 0 20 9 34 9 11 0 15-4.5 22-4.5"
            fill="none"
            stroke="url(#vkGrad)"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeDasharray="8 10"
            animate={reduce ? undefined : { strokeDashoffset: [0, -36], opacity: [0.45, 0.85, 0.45] }}
            transition={reduce ? undefined : { duration: 2.8, repeat: Infinity, ease: "linear", delay: 0.2 }}
          />
        </g>

        {/* Wordmark */}
        <text x="30" y="16" fill="url(#vkGrad)" fontSize="14" fontWeight="700" fontFamily="ui-sans-serif, system-ui">
          VayuKavach
        </text>
      </svg>
    </div>
  );
}
