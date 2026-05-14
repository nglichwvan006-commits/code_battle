"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/animation/fade-in";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, TrendingUp, Swords, Flame, Code } from "lucide-react";
import { CHARACTER_CLASSES } from "@/constants/classes";

type SortKey = "level" | "exp" | "problems" | "streak";

const SORT_OPTIONS: { key: SortKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "level", label: "Level", icon: TrendingUp },
  { key: "exp", label: "EXP", icon: Crown },
  { key: "problems", label: "Problems", icon: Code },
  { key: "streak", label: "Streak", icon: Flame },
];

const RANK_COLORS = ["#f59e0b", "#9ca3af", "#cd7f32"];

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<SortKey>("level");
  const supabase = createClient();

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard", sortBy],
    queryFn: async () => {
      let query = supabase
        .from("characters")
        .select("id, name, class_id, level, exp, gold, profile_id")
        .order(sortBy === "problems" || sortBy === "streak" ? "level" : sortBy, {
          ascending: false,
        })
        .limit(50);

      const { data: characters } = await query;
      if (!characters) return [];

      // Fetch additional data for problems and streaks
      const enriched = await Promise.all(
        characters.map(async (char) => {
          let problemsSolved = 0;
          let currentStreak = 0;

          if (sortBy === "problems" || true) {
            const { count } = await supabase
              .from("submissions")
              .select("problem_id", { count: "exact", head: true })
              .eq("character_id", char.id)
              .eq("status", "accepted");
            problemsSolved = count || 0;
          }

          if (sortBy === "streak" || true) {
            const { data: streakData } = await supabase
              .from("streaks")
              .select("current_streak")
              .eq("character_id", char.id)
              .single();
            currentStreak = streakData?.current_streak || 0;
          }

          return { ...char, problemsSolved, currentStreak };
        })
      );

      // Re-sort by the requested key
      if (sortBy === "problems") {
        enriched.sort((a, b) => b.problemsSolved - a.problemsSolved);
      } else if (sortBy === "streak") {
        enriched.sort((a, b) => b.currentStreak - a.currentStreak);
      }

      return enriched;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">
          Top adventurers in the realm
        </p>
      </FadeIn>

      {/* Sort buttons */}
      <FadeIn delay={0.1}>
        <div className="flex gap-2 flex-wrap">
          {SORT_OPTIONS.map((option) => (
            <Button
              key={option.key}
              variant={sortBy === option.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy(option.key)}
            >
              <option.icon className="mr-1 h-3.5 w-3.5" />
              {option.label}
            </Button>
          ))}
        </div>
      </FadeIn>

      {/* Top 3 podium */}
      {leaderboard && leaderboard.length >= 3 && (
        <FadeIn delay={0.15}>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[1, 0, 2].map((idx) => {
              const player = leaderboard[idx];
              if (!player) return null;
              const rank = idx + 1;
              const cls = CHARACTER_CLASSES.find((c) => c.id === player.class_id);

              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: rank === 1 ? -20 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className={rank === 1 ? "row-start-1" : ""}
                >
                  <Card
                    className={`text-center transition-all ${
                      rank === 1 ? "border-gold/40 glow-gold" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div
                        className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                        style={{
                          background: RANK_COLORS[rank - 1] || "#6b7280",
                          color: rank <= 2 ? "#000" : "#fff",
                        }}
                      >
                        {rank}
                      </div>
                      <div className="text-2xl mb-1">{cls?.icon || "👤"}</div>
                      <h3 className="font-semibold text-sm truncate">{player.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Lv.{player.level} • {cls?.name}
                      </p>
                      <div className="mt-2 text-xs font-semibold">
                        {sortBy === "level" && `Level ${player.level}`}
                        {sortBy === "exp" && `${player.exp.toLocaleString()} EXP`}
                        {sortBy === "problems" && `${player.problemsSolved} solved`}
                        {sortBy === "streak" && `${player.currentStreak}🔥`}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </FadeIn>
      )}

      {/* Full list */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Swords className="h-5 w-5" />
            Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {leaderboard?.map((player, i) => {
              const cls = CHARACTER_CLASSES.find((c) => c.id === player.class_id);
              const rank = i + 1;

              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/30"
                >
                  <span
                    className={`w-8 text-center text-sm font-bold ${
                      rank <= 3
                        ? rank === 1
                          ? "text-yellow-400"
                          : rank === 2
                          ? "text-gray-400"
                          : "text-amber-700"
                        : "text-muted-foreground"
                    }`}
                  >
                    #{rank}
                  </span>

                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-xs">
                      {cls?.icon || "?"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{player.name}</p>
                    <p className="text-xs text-muted-foreground">{cls?.name}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="outline">Lv.{player.level}</Badge>
                    <span className="text-xs text-muted-foreground w-16 text-right">
                      {sortBy === "problems"
                        ? `${player.problemsSolved} ✓`
                        : sortBy === "streak"
                        ? `${player.currentStreak}🔥`
                        : `${player.exp.toLocaleString()} XP`}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
