"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/animation/fade-in";
import { ScaleIn } from "@/components/animation/fade-in";
import { Lock, CheckCircle2 } from "lucide-react";
import type { Tables } from "@/types/database";

export default function AchievementsPage() {
  const supabase = createClient();

  const { data: character } = useQuery({
    queryKey: ["character-for-achievements"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from("characters")
        .select("id")
        .eq("profile_id", user.id)
        .single();
      return data;
    },
  });

  const { data: allAchievements, isLoading } = useQuery({
    queryKey: ["all-achievements"],
    queryFn: async () => {
      const { data } = await supabase
        .from("achievements")
        .select("*")
        .order("condition_value");
      return data || [];
    },
  });

  const { data: unlockedIds } = useQuery({
    queryKey: ["unlocked-achievements"],
    enabled: !!character,
    queryFn: async () => {
      if (!character) return new Set<string>();
      const { data } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("character_id", character.id);
      return new Set(data?.map((ua) => ua.achievement_id) || []);
    },
  });

  const unlocked = allAchievements?.filter((a) => unlockedIds?.has(a.id)) || [];
  const locked = allAchievements?.filter((a) => !unlockedIds?.has(a.id)) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-bold">Achievements</h1>
        <p className="text-sm text-muted-foreground">
          {unlockedIds?.size || 0} of {allAchievements?.length || 0} unlocked
        </p>
      </FadeIn>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <FadeIn delay={0.1}>
          <h2 className="text-lg font-semibold mb-3 text-gradient-gold">
            🏆 Unlocked ({unlocked.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {unlocked.map((achievement, i) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked
                delay={i * 0.05}
              />
            ))}
          </div>
        </FadeIn>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <FadeIn delay={0.2}>
          <h2 className="text-lg font-semibold mb-3 text-muted-foreground">
            🔒 Locked ({locked.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {locked.map((achievement, i) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={false}
                delay={i * 0.03}
              />
            ))}
          </div>
        </FadeIn>
      )}
    </div>
  );
}

function AchievementCard({
  achievement,
  unlocked,
  delay,
}: {
  achievement: Tables<"achievements">;
  unlocked: boolean;
  delay: number;
}) {
  return (
    <ScaleIn delay={delay}>
      <Card
        className={`transition-all duration-300 ${
          unlocked
            ? "border-gold/30 hover:glow-gold"
            : "opacity-60 hover:opacity-80"
        }`}
      >
        <CardContent className="flex items-start gap-4 p-4">
          <motion.div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
              unlocked ? "bg-gold/10" : "bg-secondary"
            }`}
            whileHover={unlocked ? { scale: 1.1, rotate: 10 } : {}}
          >
            {achievement.icon}
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-semibold text-sm truncate">{achievement.name}</h4>
              {unlocked && <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />}
              {!unlocked && <Lock className="h-3 w-3 text-muted-foreground shrink-0" />}
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {achievement.description}
            </p>
            {(achievement.exp_reward > 0 || achievement.gold_reward > 0) && (
              <div className="flex gap-3 text-xs">
                {achievement.exp_reward > 0 && (
                  <span className="text-exp">+{achievement.exp_reward} EXP</span>
                )}
                {achievement.gold_reward > 0 && (
                  <span className="text-gold">+{achievement.gold_reward} Gold</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </ScaleIn>
  );
}
