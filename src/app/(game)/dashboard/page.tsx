"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useGameStore } from "@/stores/game-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CharacterShowcase } from "@/components/game/character-showcase";
import { ExpBar } from "@/components/game/exp-bar";
import { FadeIn, SlideUp } from "@/components/animation/fade-in";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Code,
  Map,
  Trophy,
  Flame,
  Swords,
  TrendingUp,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function QuickAction({
  href,
  icon: Icon,
  label,
  color,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="glass flex flex-col items-center gap-2 rounded-xl p-4 transition-all hover:border-primary/30"
      >
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ background: color }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <span className="text-xs font-medium">{label}</span>
      </motion.div>
    </Link>
  );
}

export default function DashboardPage() {
  const supabase = createClient();
  const { setCharacter } = useGameStore();

  const { data: charData, isLoading } = useQuery({
    queryKey: ["character"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("characters")
        .select("*, classes(*)")
        .eq("profile_id", user.id)
        .single();

      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: charRow } = await supabase
        .from("characters")
        .select("id")
        .eq("profile_id", user.id)
        .single();

      if (!charRow) return null;

      const { count: solvedCount } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("character_id", charRow.id)
        .eq("status", "accepted");

      const { count: achievementCount } = await supabase
        .from("user_achievements")
        .select("*", { count: "exact", head: true })
        .eq("character_id", charRow.id);

      return {
        problemsSolved: solvedCount || 0,
        achievementsUnlocked: achievementCount || 0,
      };
    },
  });

  useEffect(() => {
    if (charData) {
      setCharacter(charData as never);
    }
  }, [charData, setCharacter]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!charData) {
    return (
      <FadeIn className="flex flex-col items-center justify-center py-24">
        <div className="mb-4 text-6xl">⚔️</div>
        <h2 className="mb-2 text-2xl font-bold">No Character Yet</h2>
        <p className="mb-6 text-muted-foreground">
          Create your hero to begin the adventure
        </p>
        <Link href="/character/create">
          <Button variant="game" size="lg">
            Create Character
          </Button>
        </Link>
      </FadeIn>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Welcome */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold">
          Welcome back,{" "}
          <span className="text-gradient-purple">{charData.name}</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Continue your adventure and level up your skills
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Character */}
        <motion.div variants={item} className="lg:col-span-2">
          <CharacterShowcase character={charData as never} />
        </motion.div>

        {/* EXP */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-exp" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ExpBar exp={charData.exp} />
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-secondary p-3 text-center">
                  <p className="text-2xl font-bold">{stats?.problemsSolved || 0}</p>
                  <p className="text-xs text-muted-foreground">Solved</p>
                </div>
                <div className="rounded-lg bg-secondary p-3 text-center">
                  <p className="text-2xl font-bold">
                    {stats?.achievementsUnlocked || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          <QuickAction href="/problems" icon={Code} label="Problems" color="#8b5cf6" />
          <QuickAction href="/map" icon={Map} label="World Map" color="#3b82f6" />
          <QuickAction href="/quests" icon={Swords} label="Quests" color="#ef4444" />
          <QuickAction href="/achievements" icon={Trophy} label="Trophies" color="#f59e0b" />
          <QuickAction href="/leaderboard" icon={Flame} label="Rankings" color="#10b981" />
          <QuickAction href="/inventory" icon={Swords} label="Inventory" color="#ec4899" />
        </div>
      </motion.div>

      {/* Daily Quests placeholder */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Swords className="h-5 w-5 text-destructive" />
              Daily Quests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Solve 3 problems", "Earn 50 EXP", "Submit 5 solutions"].map(
                (quest, i) => (
                  <SlideUp key={quest} delay={i * 0.1}>
                    <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm">
                          📜
                        </div>
                        <span className="text-sm font-medium">{quest}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        0/{i === 0 ? 3 : i === 1 ? 50 : 5}
                      </span>
                    </div>
                  </SlideUp>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
