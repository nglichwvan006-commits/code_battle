"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/animation/fade-in";
import { Lock, CheckCircle2, Skull } from "lucide-react";
import { ZONES } from "@/constants/zones";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MapPage() {
  const supabase = createClient();

  const { data: characterData } = useQuery({
    queryKey: ["character-for-map"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from("characters")
        .select("id, level")
        .eq("profile_id", user.id)
        .single();
      return data;
    },
  });

  const { data: bosses } = useQuery({
    queryKey: ["zone-bosses"],
    queryFn: async () => {
      const { data } = await supabase.from("bosses").select("*");
      return data || [];
    },
  });

  const { data: defeatedBossIds } = useQuery({
    queryKey: ["defeated-bosses"],
    enabled: !!characterData,
    queryFn: async () => {
      if (!characterData) return new Set();
      const { data } = await supabase
        .from("boss_progress")
        .select("boss_id")
        .eq("character_id", characterData.id)
        .eq("defeated", true);
      return new Set(data?.map(b => b.boss_id) || []);
    },
  });

  const { data: zoneProgress, isLoading } = useQuery({
    queryKey: ["zone-progress"],
    enabled: !!characterData,
    queryFn: async () => {
      if (!characterData) return {};

      const progressMap: Record<string, { total: number; solved: number }> = {};

      for (const zone of ZONES) {
        const { count: total } = await supabase
          .from("problems")
          .select("*", { count: "exact", head: true })
          .eq("zone_id", zone.id)
          .is("boss_id", null); // count only non-boss problems if there's such relation, otherwise just count all. Let's assume bosses are separate table.

        const { data: solvedProblems } = await supabase
          .from("submissions")
          .select("problem_id, problems!inner(zone_id)")
          .eq("character_id", characterData.id)
          .eq("status", "accepted")
          .eq("problems.zone_id" as never, zone.id as never);

        const uniqueSolved = new Set(solvedProblems?.map((s) => s.problem_id) || []);

        progressMap[zone.id] = {
          total: total || 0,
          solved: uniqueSolved.size,
        };
      }

      return progressMap;
    },
  });

  const charLevel = characterData?.level || 1;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-bold">World Map</h1>
        <p className="text-sm text-muted-foreground">
          Explore zones, solve problems, and unlock new territories
        </p>
      </FadeIn>

      {/* Zone path visualization */}
      <div className="relative">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ZONES.map((zone, i) => {
            const isUnlocked = charLevel >= zone.requiredLevel;
            const progress = zoneProgress?.[zone.id];
            const completion = progress && progress.total > 0
              ? Math.round((progress.solved / progress.total) * 100)
              : 0;
            const isComplete = completion === 100 && (progress?.total || 0) > 0;
            
            const zoneBosses = bosses?.filter(b => b.zone_id === zone.id) || [];

            return (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card
                  className={`relative h-full flex flex-col overflow-hidden transition-all duration-300 ${
                    isUnlocked
                      ? "hover:border-primary/40 hover:scale-[1.02]"
                      : "opacity-50 cursor-not-allowed"
                  } ${isComplete ? "glow-green" : ""}`}
                >
                  {/* Zone color accent */}
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ background: zone.color }}
                  />

                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                          style={{ background: `${zone.color}20` }}
                        >
                          {zone.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{zone.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            Zone {zone.order}
                          </p>
                        </div>
                      </div>

                      {!isUnlocked ? (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Lock className="h-4 w-4" />
                          <span className="text-xs">Lv.{zone.requiredLevel}</span>
                        </div>
                      ) : isComplete ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          {completion}%
                        </Badge>
                      )}
                    </div>

                    {isUnlocked && progress && (
                      <div className="space-y-2 mb-4">
                        <Progress
                          value={progress.solved}
                          max={Math.max(progress.total, 1)}
                          variant="exp"
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{progress.solved}/{progress.total} problems</span>
                          <span>Req: Lv.{zone.requiredLevel}</span>
                        </div>
                      </div>
                    )}

                    {!isUnlocked && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Reach level {zone.requiredLevel} to unlock
                      </p>
                    )}

                    {/* Bosses Section */}
                    {isUnlocked && zoneBosses.length > 0 && (
                      <div className="mt-auto space-y-2 pt-4 border-t border-border/50">
                        {zoneBosses.map(boss => {
                          const isBossUnlocked = (completion / 100) >= boss.required_completion;
                          const isDefeated = defeatedBossIds?.has(boss.id);

                          return (
                            <div key={boss.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{boss.icon}</span>
                                <span className={`text-xs font-semibold ${isDefeated ? "text-muted-foreground line-through" : "text-red-400"}`}>
                                  {boss.name}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant={isDefeated ? "outline" : "game"}
                                disabled={!isBossUnlocked}
                                asChild={isBossUnlocked}
                                className={!isDefeated && isBossUnlocked ? "bg-red-600 hover:bg-red-700 text-white" : ""}
                              >
                                {isBossUnlocked ? (
                                  <Link href={`/bosses/${boss.id}`}>
                                    {isDefeated ? "Replay" : "FIGHT"}
                                  </Link>
                                ) : (
                                  <span className="flex items-center gap-1 text-[10px]">
                                    <Lock className="h-3 w-3" /> {Math.round(boss.required_completion * 100)}% Req
                                  </span>
                                )}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
