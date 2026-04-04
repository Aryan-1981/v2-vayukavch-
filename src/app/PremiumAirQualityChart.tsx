"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";

export type PremiumAirQualityPoint = {
  time: string;
  PM2_5: number;
  PM10: number;
};

function fmt(v: unknown) {
  if (typeof v !== "number" || Number.isNaN(v)) return "--";
  return v.toFixed(1);
}

function clampChartData(data: PremiumAirQualityPoint[]) {
  // Make sure Recharts never receives NaN/undefined
  return data.map((d) => ({
    ...d,
    PM2_5: Number.isFinite(d.PM2_5) ? d.PM2_5 : 0,
    PM10: Number.isFinite(d.PM10) ? d.PM10 : 0,
  }));
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>; // Recharts typing is loose
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const pm25 = payload.find((p) => p.name === "PM2_5");
  const pm10 = payload.find((p) => p.name === "PM10");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
    >
      <div className="text-[11px] uppercase tracking-wider text-white/50">{label}</div>
      <div className="mt-2 space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <span className="h-2.5 w-2.5 rounded-full bg-[#00e5ff] shadow-[0_0_14px_rgba(0,229,255,0.7)]" />
            PM2.5
          </div>
          <div className="text-sm font-semibold text-white">{fmt(pm25?.value)} <span className="text-white/40 font-normal">µg/m³</span></div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff4d6d] shadow-[0_0_14px_rgba(255,77,109,0.65)]" />
            PM10
          </div>
          <div className="text-sm font-semibold text-white">{fmt(pm10?.value)} <span className="text-white/40 font-normal">µg/m³</span></div>
        </div>
      </div>
    </motion.div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function PremiumAirQualityChart({
  data,
  height = 320,
  title = "Outdoor Trends (Baseline)",
  subtitle = "PM2.5 vs PM10",
}: {
  data: PremiumAirQualityPoint[];
  height?: number;
  title?: string;
  subtitle?: string;
}) {
  const safeData = useMemo(() => clampChartData(data), [data]);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Dynamic domain with headroom (keeps it premium + uncluttered)
  const domain = useMemo(() => {
    let max = 0;
    for (const d of safeData) max = Math.max(max, d.PM2_5, d.PM10);
    const headroom = max * 0.18;
    const top = Math.max(10, max + headroom);
    return [0, Math.ceil(top)];
  }, [safeData]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
      {/* Ambient edge glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-56 w-[520px] -translate-x-1/2 rounded-full bg-[#00e5ff]/10 blur-[70px]" />
        <div className="absolute -bottom-36 left-1/3 h-60 w-[520px] -translate-x-1/2 rounded-full bg-[#ff4d6d]/10 blur-[80px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">{title}</h3>
          <p className="mt-1 text-xs sm:text-sm text-white/50">{subtitle}</p>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 backdrop-blur px-3 py-1.5 text-xs text-white/70">
            <span className="h-2 w-2 rounded-full bg-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.65)]" />
            PM2.5
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 backdrop-blur px-3 py-1.5 text-xs text-white/70">
            <span className="h-2 w-2 rounded-full bg-[#ff4d6d] shadow-[0_0_12px_rgba(255,77,109,0.55)]" />
            PM10
          </div>
        </div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 mt-6"
        style={{ height }}
      >
        {/* Soft shadow under plot */}
        <div aria-hidden className="pointer-events-none absolute inset-x-6 bottom-2 h-12 bg-black/40 blur-2xl" />

        {/* Magnetic cursor overlay (smoother than Recharts' default cursor) */}
        <div
          ref={overlayRef}
          aria-hidden
          className="pointer-events-auto absolute inset-0 z-20"
          onMouseMove={(e) => {
            const el = overlayRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const x = e.clientX - r.left;
            setMouseX(clamp(x, 0, r.width));
          }}
          onMouseLeave={() => setMouseX(null)}
        >
          {mouseX != null ? (
            <div
              className="absolute top-3 bottom-7 w-px bg-gradient-to-b from-white/0 via-white/20 to-white/0"
              style={{ left: mouseX }}
            />
          ) : null}
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={safeData}
            margin={{ top: 10, right: 12, bottom: 8, left: 2 }}
            onMouseMove={(e) => {
              const label = (e as any)?.activeLabel as string | undefined;
              setActiveLabel(label ?? null);
            }}
            onMouseLeave={() => setActiveLabel(null)}
          >
            <defs>
              {/* PM2.5 */}
              <linearGradient id="vk_pm25_fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.28} />
                <stop offset="70%" stopColor="#00e5ff" stopOpacity={0.06} />
                <stop offset="100%" stopColor="#00e5ff" stopOpacity={0} />
              </linearGradient>
              {/* PM10 */}
              <linearGradient id="vk_pm10_fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff4d6d" stopOpacity={0.22} />
                <stop offset="70%" stopColor="#ff4d6d" stopOpacity={0.05} />
                <stop offset="100%" stopColor="#ff4d6d" stopOpacity={0} />
              </linearGradient>
              {/* Glow filters */}
              <filter id="vk_glow_cyan" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.9 0"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="vk_glow_pink" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.85 0"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Minimal grid */}
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />

            <XAxis
              dataKey="time"
              stroke="rgba(255,255,255,0.36)"
              tick={{ fill: "rgba(255,255,255,0.42)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              minTickGap={22}
              dy={8}
            />
            <YAxis
              domain={domain as any}
              stroke="rgba(255,255,255,0.28)"
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={34}
              dx={-6}
            />

            <Tooltip
              cursor={false}
              content={<CustomTooltip />}
            />

            {/* PM2.5 (cyan) */}
            <Area
              type="monotone"
              dataKey="PM2_5"
              name="PM2_5"
              stroke="#00e5ff"
              strokeWidth={2.5}
              fill="url(#vk_pm25_fill)"
              fillOpacity={1}
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
              dot={false}
              activeDot={{ r: 4.5, fill: "#00e5ff", stroke: "rgba(0,229,255,0.28)", strokeWidth: 10 }}
              filter="url(#vk_glow_cyan)"
            />

            {/* PM10 (pink/red) */}
            <Area
              type="monotone"
              dataKey="PM10"
              name="PM10"
              stroke="#ff4d6d"
              strokeWidth={2.5}
              fill="url(#vk_pm10_fill)"
              fillOpacity={1}
              isAnimationActive
              animationDuration={1050}
              animationEasing="ease-out"
              dot={false}
              activeDot={{ r: 4.5, fill: "#ff4d6d", stroke: "rgba(255,77,109,0.24)", strokeWidth: 10 }}
              filter="url(#vk_glow_pink)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Mobile legend */}
      <div className="relative z-10 mt-5 flex sm:hidden flex-wrap gap-2">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 backdrop-blur px-3 py-1.5 text-xs text-white/70">
          <span className="h-2 w-2 rounded-full bg-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.65)]" />
          PM2.5
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 backdrop-blur px-3 py-1.5 text-xs text-white/70">
          <span className="h-2 w-2 rounded-full bg-[#ff4d6d] shadow-[0_0_12px_rgba(255,77,109,0.55)]" />
          PM10
        </div>
      </div>
    </div>
  );
}
