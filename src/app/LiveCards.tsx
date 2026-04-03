"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

type DeviceId = "outer" | "purified";

type LatestReading = {
  device_id: DeviceId;
  pm1: number | null;
  pm25: number | null;
  pm10: number | null;
  created_at: string;
};

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type AqiLevel = "Good" | "Moderate" | "Poor";

function aqiLevelFromPm25(pm25: number | null): AqiLevel {
  // Simple status buckets (adjust later if you want full AQI math).
  if (pm25 == null) return "Moderate";
  if (pm25 <= 12) return "Good";
  if (pm25 <= 35.4) return "Moderate";
  return "Poor";
}

function levelClasses(level: AqiLevel) {
  switch (level) {
    case "Good":
      return {
        badge: "bg-emerald-500/15 text-emerald-200 ring-emerald-400/30",
        dot: "bg-emerald-400",
      };
    case "Moderate":
      return {
        badge: "bg-amber-500/15 text-amber-200 ring-amber-400/30",
        dot: "bg-amber-400",
      };
    case "Poor":
      return {
        badge: "bg-rose-500/15 text-rose-200 ring-rose-400/30",
        dot: "bg-rose-400",
      };
  }
}

function formatTimeShort(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "--";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function calcEfficiency(outdoorPm25: number | null, purifiedPm25: number | null) {
  if (outdoorPm25 == null || purifiedPm25 == null) return null;
  if (outdoorPm25 <= 0) return null;
  return ((outdoorPm25 - purifiedPm25) / outdoorPm25) * 100;
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function IconAir({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 8c3.5 0 3.5-3 7-3 2.8 0 4 1.4 4 3 0 2-1.7 3-4 3H4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M3 12h11c2.8 0 4-1.4 4-3 0-2 1.7-3 3-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M3 16h9c2.2 0 3 1 3 2 0 1.4-1.3 3-4 3-3.5 0-3.5-2-7-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2 20 6v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconAlert({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 9v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 16.8h.01" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path
        d="M10.3 4.7c.7-1.2 2.7-1.2 3.4 0l8.1 14c.8 1.4-.2 3.3-1.7 3.3H3.9c-1.6 0-2.5-1.9-1.7-3.3l8.1-14Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Metric({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value == null ? "—" : value}</div>
      <div className="mt-1 text-[11px] text-white/40">µg/m³</div>
    </div>
  );
}

function DeviceSection({
  title,
  icon,
  reading,
}: {
  title: string;
  icon: React.ReactNode;
  reading: LatestReading | null;
}) {
  const level = aqiLevelFromPm25(reading?.pm25 ?? null);
  const cls = levelClasses(level);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-white/5 text-white/80 ring-1 ring-white/10">
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
              <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 ring-1 ${cls.badge}`}>
                <span className={`size-1.5 rounded-full ${cls.dot}`} />
                AQI: {level}
              </span>
              <span className="text-white/40">•</span>
              <span className="font-mono">{reading ? formatTimeShort(reading.created_at) : "--"}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Metric label="PM1.0" value={reading?.pm1 ?? null} />
        <Metric label="PM2.5" value={reading?.pm25 ?? null} />
        <Metric label="PM10" value={reading?.pm10 ?? null} />
      </div>
    </section>
  );
}

async function fetchLatest(device_id: DeviceId) {
  const res = await fetch(`/api/latest?device_id=${device_id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const json = (await res.json()) as { reading: LatestReading | null };
  return json.reading;
}

export default function LiveCards({
  initialOuter,
  initialPurified,
  refreshMs = 5000,
}: {
  initialOuter: LatestReading | null;
  initialPurified: LatestReading | null;
  refreshMs?: number;
}) {
  const [outer, setOuter] = useState<LatestReading | null>(initialOuter);
  const [purified, setPurified] = useState<LatestReading | null>(initialPurified);
  const [status, setStatus] = useState<string>("OK");

  // Keep a small rolling window for the comparison graph (PM2.5).
  const MAX_POINTS = 60;
  const [series, setSeries] = useState<Array<{ t: string; outer: number | null; purified: number | null }>>(
    () => {
      const t = new Date().toISOString();
      return [{ t, outer: initialOuter?.pm25 ?? null, purified: initialPurified?.pm25 ?? null }];
    }
  );

  // To avoid a double point on the very first effect tick.
  const hasTickedRef = useRef(false);

  const nextRefreshLabel = useMemo(() => `${Math.round(refreshMs / 1000)}s`, [refreshMs]);

  const efficiency = useMemo(
    () => calcEfficiency(outer?.pm25 ?? null, purified?.pm25 ?? null),
    [outer?.pm25, purified?.pm25]
  );

  useEffect(() => {
    let cancelled = false;

    async function tick() {
      try {
        const [o, p] = await Promise.all([fetchLatest("outer"), fetchLatest("purified")]);
        if (cancelled) return;

        setOuter(o);
        setPurified(p);
        setStatus("OK");

        const t = new Date().toISOString();
        setSeries((prev) => {
          const nextPoint = { t, outer: o?.pm25 ?? null, purified: p?.pm25 ?? null };
          const next = hasTickedRef.current ? [...prev, nextPoint] : prev;
          hasTickedRef.current = true;

          if (next.length > MAX_POINTS) return next.slice(next.length - MAX_POINTS);
          return next;
        });
      } catch {
        if (!cancelled) setStatus("ERR");
      }
    }

    void tick();

    const id = window.setInterval(() => {
      void tick();
    }, refreshMs);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [refreshMs]);

  const chartData = useMemo(() => {
    const labels = series.map((p) => formatTimeShort(p.t));

    return {
      labels,
      datasets: [
        {
          label: "Outdoor (PM2.5)",
          data: series.map((p) => p.outer),
          borderColor: "rgba(244, 63, 94, 0.95)",
          backgroundColor: "rgba(244, 63, 94, 0.15)",
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2,
          fill: true,
        },
        {
          label: "Purified (PM2.5)",
          data: series.map((p) => p.purified),
          borderColor: "rgba(34, 197, 94, 0.95)",
          backgroundColor: "rgba(34, 197, 94, 0.12)",
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2,
          fill: true,
        },
      ],
    };
  }, [series]);

  const chartOptions = useMemo(() => {
    const suggestedMax = clamp(
      Math.max(
        10,
        ...series
          .map((p) => Math.max(p.outer ?? 0, p.purified ?? 0))
          .filter((n) => Number.isFinite(n))
      ) * 1.2,
      10,
      500
    );

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: "rgba(255,255,255,0.7)" },
          position: "top" as const,
        },
        tooltip: {
          mode: "index" as const,
          intersect: false,
        },
      },
      scales: {
        x: {
          ticks: { color: "rgba(255,255,255,0.55)", maxTicksLimit: 10 },
          grid: { color: "rgba(255,255,255,0.06)" },
        },
        y: {
          suggestedMin: 0,
          suggestedMax,
          ticks: { color: "rgba(255,255,255,0.55)" },
          grid: { color: "rgba(255,255,255,0.06)" },
        },
      },
      interaction: { mode: "index" as const, intersect: false },
    };
  }, [series]);

  const efficiencyLevel: AqiLevel = useMemo(() => {
    if (efficiency == null) return "Moderate";
    if (efficiency >= 60) return "Good";
    if (efficiency >= 30) return "Moderate";
    return "Poor";
  }, [efficiency]);

  const efficiencyCls = levelClasses(efficiencyLevel);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-white/60">
          Auto refresh: every <span className="font-mono">{nextRefreshLabel}</span>
          <span className="mx-2 text-white/30">|</span>
          Status: <span className="font-mono">{status}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/60">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 ring-1 ${efficiencyCls.badge}`}
          >
            <span className={`size-1.5 rounded-full ${efficiencyCls.dot}`} />
            Efficiency: {efficiency == null ? "—" : `${round1(efficiency)}%`}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DeviceSection title="Outdoor Air Quality" icon={<IconAlert className="size-5" />} reading={outer} />
        <DeviceSection title="Purified Air Quality" icon={<IconShield className="size-5" />} reading={purified} />
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-white/5 text-white/80 ring-1 ring-white/10">
              <IconAir className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold">Outdoor vs Purified — PM2.5 Comparison</h3>
              <p className="mt-1 text-xs text-white/60">
                Live line chart (last {Math.round((MAX_POINTS * refreshMs) / 1000)}s)
              </p>
            </div>
          </div>
        </header>

        <div className="mt-5 h-[280px] w-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold">Air Purification Efficiency</h3>
            <p className="mt-1 text-xs text-white/60">
              efficiency = ((outdoor_pm25 - purified_pm25) / outdoor_pm25) * 100
            </p>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ring-1 ${efficiencyCls.badge}`}>
            <span className={`size-1.5 rounded-full ${efficiencyCls.dot}`} />
            {efficiencyLevel}
          </div>
        </header>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="text-xs text-white/60">Outdoor PM2.5</div>
            <div className="mt-1 text-2xl font-semibold">{outer?.pm25 == null ? "—" : outer.pm25}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="text-xs text-white/60">Purified PM2.5</div>
            <div className="mt-1 text-2xl font-semibold">{purified?.pm25 == null ? "—" : purified.pm25}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="text-xs text-white/60">Efficiency</div>
            <div className="mt-1 text-2xl font-semibold">
              {efficiency == null ? "—" : `${round1(efficiency)}%`}
            </div>
            <div className="mt-1 text-[11px] text-white/40">Higher is better</div>
          </div>
        </div>
      </section>
    </div>
  );
}
