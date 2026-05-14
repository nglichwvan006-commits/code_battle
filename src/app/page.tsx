"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ParticleBackground } from "@/components/animation/particle-background";
import { Button } from "@/components/ui/button";
import { Floating } from "@/components/animation/floating";

const FEATURES = [
  {
    icon: "⚔️",
    title: "Choose Your Class",
    desc: "Warrior, Mage, Assassin, or Engineer — each masters a different language.",
  },
  {
    icon: "🗺️",
    title: "Explore the World",
    desc: "10 unique zones from Beginner Village to the Final Castle.",
  },
  {
    icon: "💻",
    title: "Solve Challenges",
    desc: "Real coding problems with instant feedback and auto-grading.",
  },
  {
    icon: "🐉",
    title: "Battle Bosses",
    desc: "Defeat powerful bosses to unlock new zones and earn legendary loot.",
  },
  {
    icon: "🏆",
    title: "Earn Achievements",
    desc: "Unlock achievements, collect pets, and build your inventory.",
  },
  {
    icon: "🔥",
    title: "Maintain Streaks",
    desc: "Daily quests and streak bonuses keep you motivated.",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleBackground count={60} />

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-600/20 blur-[128px]" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-600/15 blur-[128px]" />

        <Floating duration={4} distance={8}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 text-8xl drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]"
          >
            ⚔️
          </motion.div>
        </Floating>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-6 max-w-4xl font-pixel text-4xl tracking-tight sm:text-6xl animate-glitch"
        >
          <span className="text-neon-purple drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">Code Adventure</span><br />
          <span className="text-neon-gold drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">BATTLE RPG</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-12 max-w-2xl text-lg font-pixel-ui text-muted-foreground sm:text-xl uppercase tracking-widest"
        >
          Master programming through an epic fantasy adventure. Solve challenges,
          level up your hero, and become a coding legend.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Link href="/register">
            <Button variant="pixel-gold" size="pixel" className="text-lg">
              [ Start Adventure ]
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="pixel-outline" size="pixel" className="text-lg">
              [ Continue Journey ]
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
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-primary font-pixel text-xl"
          >
            [ V ]
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center text-3xl font-bold sm:text-4xl"
          >
            Your Quest Awaits
          </motion.h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="pixel-card bg-card/80 p-8 transition-all hover:bg-card"
              >
                <div className="mb-4 text-5xl">{feature.icon}</div>
                <h3 className="mb-3 font-pixel text-xs tracking-tighter text-primary uppercase">{feature.title}</h3>
                <p className="font-pixel-ui text-md text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="pixel-card mx-auto max-w-2xl bg-card p-12 text-center"
        >
          <h2 className="mb-6 font-pixel text-2xl text-neon-pink">Ready to Begin?</h2>
          <p className="mb-8 font-pixel-ui text-lg text-muted-foreground uppercase tracking-wider">
            Join thousands of adventurers who are leveling up their coding skills.
          </p>
          <Link href="/register">
            <Button variant="pixel-danger" size="pixel" className="text-xl px-12 py-6">
              [ Create Character ]
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-border/30 px-4 py-12">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-6">
          <p className="font-pixel-ui text-sm text-muted-foreground uppercase tracking-widest">
            © 2026 Code Adventure BATTLE RPG
          </p>
          <div className="flex gap-8 font-pixel-ui text-sm text-muted-foreground uppercase tracking-widest">
            <Link href="#" className="hover:text-neon-cyan transition-colors">
              About
            </Link>
            <Link href="#" className="hover:text-neon-cyan transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-neon-cyan transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
