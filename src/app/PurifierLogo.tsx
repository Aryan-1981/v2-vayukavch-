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

        {/* ICON - Cleaner Car Design */}
        <g id="vk_icon" transform="translate(0,0)">
          {/* Incoming dirty air stream */}
          <g id="air-in" opacity={0.85}>
            <motion.path
              d="M2 32 Q12 28, 20 30"
              stroke="url(#vk_dirty)"
              strokeWidth={1.8}
              strokeLinecap="round"
              fill="none"
              {...(shouldAnimate ? { ...dashLoop, animate: { strokeDashoffset: [0, -20] }, transition: { duration: 1.4, ease: [0, 0, 1, 1] as const, repeat: Infinity } } : {})}
              strokeDasharray="5 5"
            />
            <motion.circle
              cx="8"
              cy="30"
              r="1"
              fill={COLORS.dirty}
              opacity={0.6}
              {...(shouldAnimate ? { animate: { opacity: [0.3, 0.8, 0.3], x: [0, 4, 0] }, transition: { duration: 1.5, ease: [0.65, 0, 0.35, 1] as const, repeat: Infinity } } : {})}
            />
          </g>

          {/* Car body - minimalist, clean silhouette */}
          <g id="car-body" stroke="none">
            {/* Main chassis */}
            <path
              d="M22 36 L20 42 L26 42 L24 36 Z M56 36 L54 42 L60 42 L58 36 Z"
              fill={theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(3,7,18,0.08)"}
            />
            {/* Body profile - side view */}
            <path
              d="M24 36 Q28 28, 38 26 L72 26 Q76 28, 78 36"
              fill={theme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(3,7,18,0.10)"}
              stroke={ink}
              strokeWidth={0.8}
            />
            
            {/* Windows - minimalist rectangles */}
            <rect x="30" y="30" width="8" height="4" rx="1" fill={theme === "dark" ? "rgba(100,200,255,0.15)" : "rgba(100,150,255,0.12)"} opacity={0.5} />
            <rect x="42" y="30" width="8" height="4" rx="1" fill={theme === "dark" ? "rgba(100,200,255,0.15)" : "rgba(100,150,255,0.12)"} opacity={0.5} />
            
            {/* Wheels */}
            <circle cx="28" cy="42" r="4" fill={theme === "dark" ? "rgba(255,255,255,0.10)" : "rgba(3,7,18,0.08)"} stroke={muted} strokeWidth={0.6} />
            <circle cx="74" cy="42" r="4" fill={theme === "dark" ? "rgba(255,255,255,0.10)" : "rgba(3,7,18,0.08)"} stroke={muted} strokeWidth={0.6} />
            
            {/* Wheel detail */}
            <circle cx="28" cy="42" r="2.2" fill="none" stroke={muted} strokeWidth={0.4} opacity={0.5} />
            <circle cx="74" cy="42" r="2.2" fill="none" stroke={muted} strokeWidth={0.4} opacity={0.5} />
          </g>

          {/* Rooftop purifier module - indicator */}
          <g id="purifier-module">
            <rect
              x="52"
              y="20"
              width="14"
              height="8"
              rx="2"
              fill={theme === "dark" ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.08)"}
              stroke={theme === "dark" ? "rgba(34,197,94,0.30)" : "rgba(34,197,94,0.40)"}
              strokeWidth={0.8}
            />
            {/* Purifier vents - animated */}
            <motion.line
              x1="55"
              y1="22"
              x2="55"
              y2="26"
              stroke={COLORS.clean}
              strokeWidth={0.6}
              opacity={0.7}
              {...(shouldAnimate ? { animate: { opacity: [0.4, 0.9, 0.4] }, transition: { duration: 2, repeat: Infinity } } : {})}
            />
            <motion.line
              x1="59"
              y1="22"
              x2="59"
              y2="26"
              stroke={COLORS.clean}
              strokeWidth={0.6}
              opacity={0.7}
              {...(shouldAnimate ? { animate: { opacity: [0.4, 0.9, 0.4] }, transition: { duration: 2, repeat: Infinity, delay: 0.2 } } : {})}
            />
            <motion.line
              x1="63"
              y1="22"
              x2="63"
              y2="26"
              stroke={COLORS.clean}
              strokeWidth={0.6}
              opacity={0.7}
              {...(shouldAnimate ? { animate: { opacity: [0.4, 0.9, 0.4] }, transition: { duration: 2, repeat: Infinity, delay: 0.4 } } : {})}
            />
          </g>

          {/* Outgoing clean air stream */}
          <g id="air-out" opacity={0.9}>
            <motion.path
              d="M76 30 Q84 28, 94 32"
              stroke="url(#vk_clean)"
              strokeWidth={1.8}
              strokeLinecap="round"
              fill="none"
              {...(shouldAnimate ? { animate: { strokeDashoffset: [0, -20] }, transition: { duration: 1.5, ease: [0, 0, 1, 1] as const, repeat: Infinity } } : {})}
              strokeDasharray="5 5"
            />
            <motion.circle
              cx="86"
              cy="30"
              r="1"
              fill={COLORS.clean}
              opacity={0.7}
              {...(shouldAnimate ? { animate: { opacity: [0.4, 0.85, 0.4], x: [0, -4, 0] }, transition: { duration: 1.6, ease: [0.65, 0, 0.35, 1] as const, repeat: Infinity } } : {})}
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
