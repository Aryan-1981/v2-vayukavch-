"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

export type PurifierLogoVariant = "lockup" | "icon" | "wordmark";
export type PurifierLogoTheme = "dark" | "light";

export type PurifierLogoProps = {
  /** Whether to animate (will still respect prefers-reduced-motion). */
  animated?: boolean;
  /** `lockup` = icon + wordmark, `icon` = icon only, `wordmark` = text only */
  variant?: PurifierLogoVariant;
  /** Background the logo sits on; affects stroke/fills for contrast. */
  theme?: PurifierLogoTheme;
  /** Pixel size for the icon height. (Lockup scales proportionally.) */
  size?: number;
  /** Controls if loop runs continuously (navbar) or plays once (splash). */
  loop?: boolean;
  /** Force reduced motion behavior regardless of user setting. */
  reducedMotion?: boolean;
  className?: string;
  title?: string;
};

const COLORS = {
  dirty: "#fb7185", // rose-400
  dirty2: "#f97316", // orange-500
  clean: "#22c55e", // green-500
  clean2: "#38bdf8", // sky-400
  inkDark: "rgba(255,255,255,0.86)",
  inkLight: "rgba(3,7,18,0.85)",
  mutedDark: "rgba(255,255,255,0.28)",
  mutedLight: "rgba(3,7,18,0.22)",
};

function useEffectiveReducedMotion(forced?: boolean) {
  const systemReduced = useReducedMotion();
  return forced ?? systemReduced;
}

export default function PurifierLogo({
  animated = true,
  variant = "lockup",
  theme = "dark",
  size = 28,
  loop = true,
  reducedMotion,
  className,
  title = "VayuKavach",
}: PurifierLogoProps) {
  const reduce = useEffectiveReducedMotion(reducedMotion);

  const ink = theme === "dark" ? COLORS.inkDark : COLORS.inkLight;
  const muted = theme === "dark" ? COLORS.mutedDark : COLORS.mutedLight;

  const shouldAnimate = animated && !reduce;

  // Animation profiles
  const dashLoop = loop
    ? {
        transition: { duration: 1.6, ease: [0, 0, 1, 1] as const, repeat: Infinity },
        animate: { strokeDashoffset: [0, -42] },
      }
    : {
        transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1] as const },
        animate: { strokeDashoffset: [0, -42] },
      };

  const particleLoop = loop
    ? {
        transition: { duration: 1.8, ease: [0.65, 0, 0.35, 1] as const, repeat: Infinity },
        animate: { opacity: [0.25, 0.85, 0.25], y: [0, -1, 0] },
      }
    : {
        transition: { duration: 1.9, ease: [0.16, 1, 0.3, 1] as const },
        animate: { opacity: [0.2, 0.9, 0.15], y: [0, -1.25, 0] },
      };

  const viewBox = variant === "icon" ? "0 0 96 64" : "0 0 260 64";

  return (
    <div className={className} style={{ height: size }} aria-label={title}>
      <svg
        viewBox={viewBox}
        role="img"
        aria-hidden={title ? undefined : true}
        aria-label={title}
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{title}</title>
        <defs>
          <linearGradient id="vk_clean" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={COLORS.clean} />
            <stop offset="1" stopColor={COLORS.clean2} />
          </linearGradient>
          <linearGradient id="vk_dirty" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={COLORS.dirty2} />
            <stop offset="1" stopColor={COLORS.dirty} />
          </linearGradient>
          <filter id="vk_glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
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

        {/* ICON */}
        <g id="vk_icon" transform="translate(0,0)">
          {/* incoming dirty airflow */}
          <g id="air-in" opacity={0.92} filter={theme === "dark" ? "url(#vk_glow)" : undefined}>
            <motion.path
              id="air-in-path"
              d="M2 34c14 0 18-10 34-10 10 0 14 4 20 7"
              stroke="url(#vk_dirty)"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeDasharray="10 10"
              {...(shouldAnimate ? dashLoop : {})}
            />
            <motion.circle
              id="particles-dirty"
              cx="16"
              cy="30"
              r="1.5"
              fill={COLORS.dirty}
              opacity={0.5}
              {...(shouldAnimate ? particleLoop : {})}
            />
            <motion.circle
              cx="24"
              cy="28"
              r="1.2"
              fill={COLORS.dirty2}
              opacity={0.35}
              {...(shouldAnimate ? { ...particleLoop, transition: { ...(particleLoop as any).transition, delay: 0.15 } } : {})}
            />
            <motion.circle
              cx="30"
              cy="32"
              r="1.1"
              fill={COLORS.dirty}
              opacity={0.25}
              {...(shouldAnimate ? { ...particleLoop, transition: { ...(particleLoop as any).transition, delay: 0.3 } } : {})}
            />
          </g>

          {/* car */}
          <g id="car" stroke={muted}>
            <path
              id="car-body"
              d="M20 42c2.8-9.2 8.9-14.6 18.8-14.6h23.8c7.2 0 11.4 2.8 15.1 9.2l2.2 3.8H26.3c-1.7 0-3.1 1.4-3.1 3.1V46H16v-3.1c0-0.3 0-0.6 0-0.8Z"
              fill={theme === "dark" ? "rgba(255,255,255,0.10)" : "rgba(3,7,18,0.06)"}
            />
            <circle
              id="wheel-front"
              cx="40"
              cy="46"
              r="5.6"
              fill={theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(3,7,18,0.06)"}
            />
            <circle
              id="wheel-rear"
              cx="68"
              cy="46"
              r="5.6"
              fill={theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(3,7,18,0.06)"}
            />

            {/* rooftop purifier module */}
            <rect
              id="roof-unit"
              x="56"
              y="21"
              width="18"
              height="9"
              rx="3"
              fill={theme === "dark" ? "rgba(34,197,94,0.14)" : "rgba(34,197,94,0.12)"}
              stroke={theme === "dark" ? "rgba(34,197,94,0.35)" : "rgba(34,197,94,0.45)"}
            />
            <path id="roof-rail" d="M40 26h36" stroke={muted} strokeLinecap="round" />
          </g>

          {/* outgoing clean airflow */}
          <g id="air-out" opacity={0.95} filter={theme === "dark" ? "url(#vk_glow)" : undefined}>
            <motion.path
              id="air-out-path"
              d="M76 26c10 0 14 10 27 10 9 0 12-4 18-4"
              stroke="url(#vk_clean)"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeDasharray="10 10"
              {...(shouldAnimate ? { ...dashLoop, transition: { ...(dashLoop as any).transition, duration: 1.8 } } : {})}
            />
            <motion.circle
              id="particles-clean"
              cx="88"
              cy="30"
              r="1.5"
              fill={COLORS.clean2}
              opacity={0.55}
              {...(shouldAnimate ? { ...particleLoop, transition: { ...(particleLoop as any).transition, duration: 1.7, delay: 0.08 } } : {})}
            />
            <motion.circle
              cx="96"
              cy="33"
              r="1.2"
              fill={COLORS.clean}
              opacity={0.35}
              {...(shouldAnimate ? { ...particleLoop, transition: { ...(particleLoop as any).transition, duration: 1.9, delay: 0.25 } } : {})}
            />
          </g>
        </g>

        {/* WORDMARK */}
        {variant === "lockup" || variant === "wordmark" ? (
          <g id="wordmark" transform={variant === "wordmark" ? "translate(0,0)" : "translate(104,0)"}>
            <text
              id="wordmark-text"
              x={0}
              y={28}
              fontSize={18}
              fontWeight={700}
              fontFamily="var(--font-geist-sans), ui-sans-serif, system-ui"
              fill={ink}
              letterSpacing="-0.02em"
            >
              VayuKavach
            </text>
            <text
              id="wordmark-sub"
              x={0}
              y={46}
              fontSize={11}
              fontWeight={500}
              fontFamily="var(--font-geist-sans), ui-sans-serif, system-ui"
              fill={muted}
              letterSpacing="0.12em"
            >
              AIR PURIFICATION
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  );
}
