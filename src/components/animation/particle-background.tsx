"use client";

import { useCallback, useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
}

const PALETTES = {
  battle: [
    "#c084fc", "#818cf8", "#a78bfa",
    "#22d3ee", "#f472b6", "#fbbf24",
    "#a3e635", "#fb923c",
  ],
  fire: ["#f87171", "#fb923c", "#fbbf24", "#ef4444"],
  ice: ["#22d3ee", "#60a5fa", "#818cf8", "#a5b4fc"],
  nature: ["#34d399", "#a3e635", "#22d3ee", "#4ade80"],
};

type PaletteKey = keyof typeof PALETTES;

export function ParticleBackground({
  count = 50,
  className = "",
  palette = "battle",
  speed = 1,
}: {
  count?: number;
  className?: string;
  palette?: PaletteKey;
  speed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const colors = PALETTES[palette];

  const createParticle = useCallback(
    (width: number, height: number): Particle => {
      const baseSize = Math.random() * 4 + 2;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4 * speed,
        vy: -Math.random() * 0.6 * speed - 0.1,
        size: baseSize,
        opacity: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 250 + 100,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      };
    },
    [colors, speed]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    particlesRef.current = Array.from({ length: count }, () =>
      createParticle(canvas.offsetWidth, canvas.offsetHeight)
    );

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      particlesRef.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.rotation += p.rotationSpeed;

        if (p.life > p.maxLife || p.y < -10 || p.x < -10 || p.x > w + 10) {
          particlesRef.current[i] = createParticle(w, h);
          particlesRef.current[i].y = h + 10;
          return;
        }

        const lifeRatio = 1 - p.life / p.maxLife;
        const fadeIn = Math.min(p.life / 20, 1);
        ctx.globalAlpha = p.opacity * lifeRatio * fadeIn;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Draw pixel-style square with glow
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 2;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [count, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
