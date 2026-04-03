"use client";

import { useEffect, useMemo, useRef } from "react";

type Props = {
  density?: number; // number of particles
  className?: string;
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export default function ParticleField({ density = 42, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const seed = useMemo(() => Math.random() * 10_000, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx0 = canvasRef.current?.getContext("2d");
    if (!ctx0) return;
    const ctx: CanvasRenderingContext2D = ctx0;

    let raf = 0;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
      tint: "g" | "c" | "w";
    }> = [];

    function rand(min: number, max: number) {
      return min + Math.random() * (max - min);
    }

    function resize() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      particles.length = 0;
      const { width, height } = canvas.getBoundingClientRect();
      for (let i = 0; i < density; i++) {
        const tint: "g" | "c" | "w" = i % 7 === 0 ? "g" : i % 11 === 0 ? "c" : "w";
        particles.push({
          x: rand(0, width),
          y: rand(0, height),
          vx: rand(-0.08, 0.08),
          vy: rand(-0.05, 0.05),
          r: rand(0.8, 1.8),
          a: rand(0.08, 0.22),
          tint,
        });
      }
    }

    function color(tint: "g" | "c" | "w", a: number) {
      if (tint === "g") return `rgba(34,197,94,${a})`;
      if (tint === "c") return `rgba(56,189,248,${a})`;
      return `rgba(255,255,255,${a})`;
    }

    function frame() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      const grd = ctx.createRadialGradient(
        width * 0.5,
        height * 0.25,
        0,
        width * 0.5,
        height * 0.25,
        Math.max(width, height)
      );
      grd.addColorStop(0, "rgba(34,197,94,0.05)");
      grd.addColorStop(0.5, "rgba(56,189,248,0.03)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.beginPath();
        ctx.fillStyle = color(p.tint, p.a);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = window.requestAnimationFrame(frame);
    }

    const onResize = () => {
      resize();
      init();
    };

    resize();
    init();
    frame();

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(raf);
    };
  }, [density, seed]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" style={{ width: "100%", height: "100%" }} />;
}
