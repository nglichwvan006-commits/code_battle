"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useGameStore } from "@/stores/game-store";
import { useI18nStore } from "@/stores/i18n-store";
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
  Backpack,
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
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.95 }}
        className="glass-strong flex flex-col items-center gap-3 rounded-xl p-5 transition-all hover:border-primary/40 relative group overflow-hidden"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ background: color }} />
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl shadow-md"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}80)` }}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">{label}</span>
      </motion.div>
    </Link>
  );
}

export default function DashboardPage() {
  const supabase = createClient();
  const { setCharacter } = useGameStore();
  const { t } = useI18nStore();

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
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6 text-7xl drop-shadow-lg"
        >
          ⚔️
        </motion.div>
        <h2 className="mb-2 font-pixel text-xl text-gradient-purple">{t("noCharacter")}</h2>
        <p className="mb-8 text-muted-foreground text-sm">
          {t("createCharacter")}
        </p>
        <Link href="/character/create">
          <Button variant="game" size="xl" className="font-pixel-accent text-sm">
            {t("createBtn")}
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
      className="space-y-8"
    >
      {/* Welcome */}
      <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent p-6 sm:p-8">
        <h1 className="font-pixel text-xl sm:text-2xl mb-2">
          {t("welcomeBack")},{" "}
          <span className="text-gradient-purple">{charData.name}</span>
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          {t("continueAdventure")}
        </p>
        <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 blur-sm pointer-events-none">
          🐉
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Character */}
        <motion.div variants={item} className="lg:col-span-2">
          <CharacterShowcase character={charData as never} />
        </motion.div>

        {/* EXP */}
        <motion.div variants={item}>
          <Card className="h-full border-primary/20 bg-gradient-to-br from-card to-card/50" glow>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <span className="font-bold text-gradient-green">{t("progress")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ExpBar exp={charData.exp} />
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border/50 bg-secondary/50 p-4 text-center transition-colors hover:border-primary/30">
                  <p className="text-3xl font-bold font-pixel-accent text-primary">{stats?.problemsSolved || 0}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("solved")}</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-secondary/50 p-4 text-center transition-colors hover:border-amber-500/30">
                  <p className="text-3xl font-bold font-pixel-accent text-amber-500">
                    {stats?.achievementsUnlocked || 0}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("unlocked")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="mb-5 font-pixel text-sm sm:text-base text-muted-foreground">[{t("quickActions")}]</h2>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          <QuickAction href="/problems" icon={Code} label={t("problems")} color="#8b5cf6" />
          <QuickAction href="/map" icon={Map} label={t("map")} color="#3b82f6" />
          <QuickAction href="/quests" icon={Swords} label={t("quests")} color="#ef4444" />
          <QuickAction href="/achievements" icon={Trophy} label={t("achievements")} color="#f59e0b" />
          <QuickAction href="/leaderboard" icon={Flame} label={t("leaderboard")} color="#10b981" />
          <QuickAction href="/inventory" icon={Backpack} label={t("inventory")} color="#ec4899" />
        </div>
      </motion.div>

      {/* Daily Quests placeholder */}
      <motion.div variants={item}>
        <Card className="border-red-500/20 bg-gradient-to-br from-card to-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Swords className="h-5 w-5 text-red-500" />
              <span className="font-bold text-gradient-fire">{t("dailyQuests")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Solve 3 problems", "Earn 50 EXP", "Submit 5 solutions"].map(
                (quest, i) => (
                  <SlideUp key={quest} delay={i * 0.1}>
                    <div className="group flex items-center justify-between rounded-xl border border-border/50 bg-secondary/30 p-4 transition-colors hover:border-red-500/30 hover:bg-red-500/5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-lg shadow-inner">
                          📜
                        </div>
                        <span className="text-sm font-bold group-hover:text-red-400 transition-colors">{quest}</span>
                      </div>
                      <span className="font-pixel-accent text-xs text-muted-foreground">
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
