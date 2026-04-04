"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

interface EfficiencyCardProps {
  outerPM: number | null;
  purifiedPM: number | null;
}

export default function EfficiencyCard({ outerPM, purifiedPM }: EfficiencyCardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  let efficiency = 0;
  if (outerPM !== null && purifiedPM !== null && outerPM > 0) {
    efficiency = ((outerPM - purifiedPM) / outerPM) * 100;
  }
  efficiency = Math.max(0, Math.min(100, Math.round(efficiency)));

  let color = "#ff4d4f"; // Red
  let glowClass = "shadow-[0_0_20px_rgba(255,77,79,0.3)]";
  
  if (efficiency >= 70) {
    color = "#00c853"; // Green
    glowClass = "shadow-[0_0_20px_rgba(0,200,83,0.4)] animate-[pulse_3s_ease-in-out_infinite]";
  } else if (efficiency >= 40) {
    color = "#fadb14"; // Yellow
    glowClass = "shadow-[0_0_20px_rgba(250,219,20,0.3)]";
  }

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (efficiency / 100) * circumference;

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
          <span 
            className="text-5xl font-black text-white tracking-tighter" 
            style={{ textShadow: `0 0 24px ${color}` }}
          >
            <CountUp end={efficiency} duration={2.5} preserveValue />%
          </span>
        </div>
      </div>
    </motion.div>
  );
}
