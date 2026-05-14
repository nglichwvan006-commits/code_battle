"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn, SlideUp } from "@/components/animation/fade-in";
import { Swords, Flame, Calendar, CheckCircle2, Gift } from "lucide-react";
import type { DailyQuest } from "@/types/game";

const DEFAULT_DAILY_QUESTS: DailyQuest[] = [
  {
    id: "dq1",
    title: "Problem Solver",
    description: "Solve 3 problems today",
    type: "solve_problems",
    targetValue: 3,
    currentValue: 0,
    completed: false,
    reward: { exp: 30, gold: 15 },
  },
  {
    id: "dq2",
    title: "EXP Hunter",
    description: "Earn 50 EXP today",
    type: "earn_exp",
    targetValue: 50,
    currentValue: 0,
    completed: false,
    reward: { exp: 20, gold: 25 },
  },
  {
    id: "dq3",
    title: "Persistent Coder",
    description: "Submit 5 solutions",
    type: "solve_problems",
    targetValue: 5,
    currentValue: 0,
    completed: false,
    reward: { exp: 40, gold: 20 },
  },
];

export default function QuestsPage() {
  const supabase = createClient();

  const { data: character } = useQuery({
    queryKey: ["character-for-quests"],
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

  const { data: streak, isLoading: streakLoading } = useQuery({
    queryKey: ["streak"],
    enabled: !!character,
    queryFn: async () => {
      if (!character) return null;
      const { data } = await supabase
        .from("streaks")
        .select("*")
        .eq("character_id", character.id)
        .single();
      return data;
    },
  });

  const { data: dailyQuests, isLoading: questsLoading } = useQuery({
    queryKey: ["daily-quests-page"],
    enabled: !!character,
    queryFn: async () => {
      if (!character) return DEFAULT_DAILY_QUESTS;

      const today = new Date().toISOString().split("T")[0];
      const { data: todayRecord } = await supabase
        .from("daily_quests")
        .select("quests")
        .eq("character_id", character.id)
        .eq("date", today)
        .single();

      if (todayRecord?.quests) {
        return todayRecord.quests as unknown as DailyQuest[];
      }

      return DEFAULT_DAILY_QUESTS;
    },
  });

  const isLoading = streakLoading || questsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const completedCount = dailyQuests?.filter((q) => q.completed).length || 0;

  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-bold">Quests</h1>
        <p className="text-sm text-muted-foreground">
          Complete daily challenges for bonus rewards
        </p>
      </FadeIn>

      {/* Streak card */}
      <FadeIn delay={0.1}>
        <Card className="glass-strong border-orange-500/20">
          <CardContent className="flex items-center gap-6 p-6">
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-3xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔥
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl font-bold">
                  {streak?.current_streak || 0} Day Streak
                </h3>
                {(streak?.current_streak || 0) >= 7 && (
                  <Badge variant="default" className="bg-orange-500">
                    <Flame className="mr-1 h-3 w-3" /> On Fire!
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Longest: {streak?.longest_streak || 0} days •{" "}
                Last active: {streak?.last_active_date || "Never"}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-8 w-8 rounded-md flex items-center justify-center text-xs font-medium ${
                    i < (streak?.current_streak || 0) % 7 || (streak?.current_streak || 0) >= 7
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Daily quests */}
      <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Swords className="h-5 w-5 text-primary" />
                Daily Quests
              </CardTitle>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {completedCount}/{dailyQuests?.length || 0} completed
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {dailyQuests?.map((quest, i) => (
              <SlideUp key={quest.id} delay={i * 0.1}>
                <div
                  className={`rounded-xl border p-4 transition-all ${
                    quest.completed
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl ${
                          quest.completed
                            ? "bg-green-500/10"
                            : "bg-primary/10"
                        }`}
                      >
                        {quest.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          "📜"
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{quest.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {quest.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Gift className="h-3 w-3 text-muted-foreground" />
                      <span className="text-exp">+{quest.reward.exp} XP</span>
                      <span className="text-gold">+{quest.reward.gold} G</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Progress
                      value={quest.currentValue}
                      max={quest.targetValue}
                      variant={quest.completed ? "exp" : "default"}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {quest.currentValue}/{quest.targetValue}
                    </p>
                  </div>
                </div>
              </SlideUp>
            ))}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Streak milestones */}
      <FadeIn delay={0.3}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Streak Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { days: 3, reward: "30 EXP", icon: "🌟" },
                { days: 7, reward: "100 EXP + Pet Egg", icon: "⭐" },
                { days: 14, reward: "200 EXP + Rare Item", icon: "💎" },
                { days: 30, reward: "500 EXP + Epic Item", icon: "👑" },
              ].map((milestone) => {
                const achieved = (streak?.current_streak || 0) >= milestone.days;
                return (
                  <motion.div
                    key={milestone.days}
                    whileHover={{ scale: 1.03 }}
                    className={`rounded-xl border p-4 text-center transition-all ${
                      achieved
                        ? "border-orange-500/30 bg-orange-500/5"
                        : "border-border opacity-60"
                    }`}
                  >
                    <div className="text-2xl mb-1">{milestone.icon}</div>
                    <p className="text-sm font-semibold">{milestone.days} Days</p>
                    <p className="text-xs text-muted-foreground">{milestone.reward}</p>
                    {achieved && (
                      <CheckCircle2 className="mx-auto mt-2 h-4 w-4 text-green-500" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
