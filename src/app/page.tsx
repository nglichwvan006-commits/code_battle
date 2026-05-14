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
            className="mb-4 text-7xl"
          >
            ⚔️
          </motion.div>
        </Floating>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-4 max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl"
        >
          <span className="text-gradient-purple">Code Adventure</span>{" "}
          <span className="text-gradient-gold">RPG</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          Master programming through an epic fantasy adventure. Solve challenges,
          level up your hero, defeat bosses, and become a coding legend.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex gap-4"
        >
          <Link href="/register">
            <Button variant="game" size="xl">
              Start Your Adventure
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="xl">
              Continue Journey
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
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-muted-foreground"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
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

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass rounded-xl p-6 transition-all"
              >
                <div className="mb-3 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
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
          className="glass-strong mx-auto max-w-2xl rounded-2xl p-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold">Ready to Begin?</h2>
          <p className="mb-8 text-muted-foreground">
            Join thousands of adventurers who are leveling up their coding skills.
          </p>
          <Link href="/register">
            <Button variant="game" size="xl">
              Create Your Character
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-4 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2026 Code Adventure RPG
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
