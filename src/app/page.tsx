"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ParticleBackground } from "@/components/animation/particle-background";
import { Button } from "@/components/ui/button";
import { Floating } from "@/components/animation/floating";
import { useRef } from "react";

const FEATURES = [
  {
    icon: "⚔️",
    title: "Choose Your Class",
    desc: "Warrior, Mage, Assassin, or Engineer — each masters a different language.",
    gradient: "from-purple-500 to-indigo-500",
    glow: "group-hover:shadow-purple-500/20",
  },
  {
    icon: "🗺️",
    title: "Explore the World",
    desc: "10 unique zones from Beginner Village to the Final Castle.",
    gradient: "from-cyan-500 to-blue-500",
    glow: "group-hover:shadow-cyan-500/20",
  },
  {
    icon: "💻",
    title: "Solve Challenges",
    desc: "Real coding problems with instant feedback and auto-grading.",
    gradient: "from-lime-400 to-emerald-500",
    glow: "group-hover:shadow-emerald-500/20",
  },
  {
    icon: "🐉",
    title: "Battle Bosses",
    desc: "Defeat powerful bosses to unlock new zones and earn legendary loot.",
    gradient: "from-red-500 to-orange-500",
    glow: "group-hover:shadow-red-500/20",
  },
  {
    icon: "🏆",
    title: "Earn Achievements",
    desc: "Unlock achievements, collect pets, and build your inventory.",
    gradient: "from-amber-400 to-yellow-400",
    glow: "group-hover:shadow-amber-400/20",
  },
  {
    icon: "🔥",
    title: "Maintain Streaks",
    desc: "Daily quests and streak bonuses keep you motivated.",
    gradient: "from-pink-500 to-rose-500",
    glow: "group-hover:shadow-pink-500/20",
  },
];

const STATS = [
  { value: "10K+", label: "Players", icon: "👥" },
  { value: "500+", label: "Problems", icon: "💎" },
  { value: "50+", label: "Bosses", icon: "🐲" },
  { value: "∞", label: "Fun", icon: "🎮" },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleBackground count={70} palette="battle" />

      {/* ===== HERO SECTION ===== */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center"
      >
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-pink-500/10 blur-[100px]" />

        <Floating duration={4} distance={10}>
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="mb-8 text-8xl sm:text-9xl drop-shadow-2xl"
          >
            ⚔️
          </motion.div>
        </Floating>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-6 max-w-4xl"
        >
          <span className="block font-pixel text-3xl sm:text-5xl lg:text-6xl text-gradient-purple leading-tight">
            CODE ADVENTURE
          </span>
          <span className="block mt-2 font-pixel text-2xl sm:text-4xl lg:text-5xl text-gradient-fire leading-tight">
            BATTLE RPG
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-10 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          Master programming through an epic fantasy adventure.
          <br className="hidden sm:block" />
          Solve challenges, level up your hero, and become a{" "}
          <span className="text-gradient-gold font-semibold">coding legend</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/register">
            <Button variant="game" size="xl" className="text-base min-w-[200px]">
              ⚡ Start Adventure
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="neon" size="xl" className="text-base min-w-[200px]">
              🎮 Continue Journey
            </Button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-muted-foreground/50"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ===== STATS BAR ===== */}
      <section className="relative px-4 py-12 border-y border-border/30">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex flex-col items-center gap-1 text-center"
              >
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-2xl sm:text-3xl font-bold text-gradient-purple">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-3 font-pixel text-xl sm:text-2xl text-gradient-cyber">
              YOUR QUEST AWAITS
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Everything you need to become a programming master
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUpItem}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl"
              >
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`} />

                <div className="relative">
                  <div className="mb-4 text-4xl">{feature.icon}</div>
                  <h3 className="mb-2 text-base font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl"
        >
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-10 sm:p-14 text-center shadow-xl">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/30 rounded-br-2xl" />

            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl mb-6"
            >
              🏰
            </motion.div>
            <h2 className="mb-4 font-pixel text-lg sm:text-xl text-gradient-pink">
              READY TO BEGIN?
            </h2>
            <p className="mb-8 text-muted-foreground max-w-sm mx-auto">
              Join the adventure and prove yourself as the ultimate coding warrior.
            </p>
            <Link href="/register">
              <Button variant="battle" size="xl" className="text-base min-w-[220px]">
                🔥 Create Your Character
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border/30 px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚔️</span>
            <span className="font-pixel text-[10px] text-muted-foreground">
              CODE ADVENTURE RPG
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 Code Adventure RPG. Level up your coding skills.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
