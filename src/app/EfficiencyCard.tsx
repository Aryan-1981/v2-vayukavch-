"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import type { LatestReading } from "@/lib/queries";
import { describeReadingAge, isReadingFresh, pmEfficiency } from "@/lib/readings";

interface EfficiencyCardProps {
  outer: LatestReading | null;
  inner: LatestReading | null;
}

function ageText(reading: LatestReading | null, fresh: boolean) {
  if (!reading) return "no data";
  const age = describeReadingAge(reading);
  return fresh ? age : `${age} (stale)`;
}

export default function EfficiencyCard({ outer, inner }: EfficiencyCardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const outerFresh = isReadingFresh(outer);
  const innerFresh = isReadingFresh(inner);
  const readingsFresh = outerFresh && innerFresh;

  const pm25Efficiency = readingsFresh ? pmEfficiency(outer?.pm25, inner?.pm25) : null;
  const pm10Efficiency = readingsFresh ? pmEfficiency(outer?.pm10, inner?.pm10) : null;

  let color = "#9ca3af";
  let glowClass = "shadow-[0_0_20px_rgba(156,163,175,0.2)]";

  if (pm25Efficiency != null) {
    color = "#ff4d4f"; // Red
    glowClass = "shadow-[0_0_20px_rgba(255,77,79,0.3)]";

    if (pm25Efficiency >= 70) {
      color = "#00c853"; // Green
      glowClass = "shadow-[0_0_20px_rgba(0,200,83,0.4)] animate-[pulse_3s_ease-in-out_infinite]";
    } else if (pm25Efficiency >= 40) {
      color = "#fadb14"; // Yellow
      glowClass = "shadow-[0_0_20px_rgba(250,219,20,0.3)]";
    }
  }

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    pm25Efficiency == null ? circumference : circumference - (pm25Efficiency / 100) * circumference;

  const notice =
    outer == null && inner == null
      ? "Waiting for inlet & outlet readings"
      : !readingsFresh
        ? "Live efficiency paused — readings are stale"
        : pm25Efficiency == null
          ? "Waiting for valid inlet & outlet readings"
          : null;

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 md:p-10 max-w-lg mx-auto w-full flex flex-col items-center justify-center transition-all ${glowClass}`}
    >
      {/* Micro-interactions */}
      <motion.div
        animate={{ y: [0, -12, 0], x: [0, 8, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-6 left-6 text-2xl select-none pointer-events-none"
      >
        💨
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0], x: [0, -6, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-10 right-8 text-2xl select-none pointer-events-none"
      >
        🌿
      </motion.div>

      <h3 className="text-2xl font-bold text-white mb-2 z-10 text-center tracking-tight">
        Filtration Efficiency
      </h3>
      <p className="text-sm md:text-base text-gray-400 mb-8 z-10 text-center">
        Based on real-time PM sensor data
      </p>

      <div className="relative flex items-center justify-center mt-2">
        <svg width="180" height="180" className="rotate-[-90deg]">
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="14"
            fill="transparent"
          />
          <motion.circle
            cx="90"
            cy="90"
            r={radius}
            stroke={color}
            strokeWidth="14"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          {pm25Efficiency == null ? (
            <span className="text-4xl font-black text-white/50 tracking-tighter">--</span>
          ) : (
            <span
              className="text-5xl font-black text-white tracking-tighter"
              style={{ textShadow: `0 0 24px ${color}` }}
            >
              <CountUp end={pm25Efficiency} decimals={1} duration={2.5} preserveValue />%
            </span>
          )}
          <span className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
            PM2.5
          </span>
        </div>
      </div>

      {pm25Efficiency != null ? (
        <p className="mt-6 z-10 text-center text-sm text-white/50">
          PM10 filtration:{" "}
          <span className="font-semibold text-white/85">
            {pm10Efficiency == null ? "—" : `${pm10Efficiency.toFixed(1)}%`}
          </span>
        </p>
      ) : null}

      {notice ? (
        <p className="mt-6 z-10 text-center text-xs font-medium text-amber-200/80">{notice}</p>
      ) : null}

      <p className="mt-3 z-10 text-center text-[11px] text-white/45">
        Outdoor {ageText(outer, outerFresh)}
        <span className="mx-1.5 text-white/20">·</span>
        Outlet {ageText(inner, innerFresh)}
      </p>
    </motion.div>
  );
}
