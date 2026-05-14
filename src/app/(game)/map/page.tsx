"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn, SlideUp } from "@/components/animation/fade-in";
import { Lock, CheckCircle2, Swords } from "lucide-react";
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
          .is("boss_id", null);

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
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-transparent p-6 sm:p-8">
          <h1 className="font-pixel text-2xl sm:text-3xl mb-2 text-gradient-cyber">
            WORLD MAP
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Explore zones, solve problems, and unlock new territories.
          </p>
          <div className="absolute right-0 top-0 bottom-0 opacity-[0.03] text-9xl pointer-events-none translate-x-1/4 -translate-y-1/4">
            🗺️
          </div>
        </div>
      </FadeIn>

      {/* Zone path visualization */}
      <div className="relative">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ZONES.map((zone, i) => {
            const isUnlocked = charLevel >= zone.requiredLevel;
            const progress = zoneProgress?.[zone.id];
            const completion = progress && progress.total > 0
              ? Math.round((progress.solved / progress.total) * 100)
              : 0;
            const isComplete = completion === 100 && (progress?.total || 0) > 0;
            
            const zoneBosses = bosses?.filter(b => b.zone_id === zone.id) || [];

            return (
              <SlideUp key={zone.id} delay={i * 0.05}>
                <Card
                  className={`group relative h-full flex flex-col overflow-hidden transition-all duration-500 ${
                    isUnlocked
                      ? "hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2"
                      : "opacity-60 cursor-not-allowed grayscale-[0.5]"
                  } ${isComplete ? "glow-green border-emerald-500/50" : ""}`}
                >
                  {/* Zone color accent */}
                  <div
                    className="absolute inset-x-0 top-0 h-1.5 transition-all duration-300 group-hover:h-2"
                    style={{ background: `linear-gradient(90deg, ${zone.color}, ${zone.color}80)` }}
                  />
                  
                  {/* Ambient background glow */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at center, ${zone.color}, transparent)` }}
                  />

                  <CardContent className="p-6 flex-1 flex flex-col relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow-lg border border-white/5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                          style={{ background: `linear-gradient(135deg, ${zone.color}20, ${zone.color}10)` }}
                        >
                          {zone.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg leading-tight">{zone.name}</h3>
                          <p className="font-pixel-accent text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                            Zone {zone.order}
                          </p>
                        </div>
                      </div>

                      {!isUnlocked ? (
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="outline" className="bg-background/50 backdrop-blur-md">
                            <Lock className="h-3 w-3 mr-1" />
                            Lv.{zone.requiredLevel}
                          </Badge>
                        </div>
                      ) : isComplete ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 ring-2 ring-emerald-500/50">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                      ) : (
                        <Badge variant="neon" className="font-pixel-accent text-xs">
                          {completion}%
                        </Badge>
                      )}
                    </div>

                    {isUnlocked && progress && (
                      <div className="space-y-3 mb-5">
                        <Progress
                          value={progress.solved}
                          max={Math.max(progress.total, 1)}
                          variant="exp"
                          className="h-2.5"
                          showLabel={false}
                        />
                        <div className="flex justify-between font-pixel-accent text-[10px] uppercase tracking-wider text-muted-foreground">
                          <span>{progress.solved} / {progress.total} PROBS</span>
                          <span>REQ: LV.{zone.requiredLevel}</span>
                        </div>
                      </div>
                    )}

                    {!isUnlocked && (
                      <div className="mt-4 rounded-xl border border-dashed border-border/50 bg-secondary/30 p-4 text-center">
                        <Lock className="mx-auto mb-2 h-6 w-6 text-muted-foreground/50" />
                        <p className="text-xs font-medium text-muted-foreground">
                          Reach level <span className="text-primary font-bold">{zone.requiredLevel}</span> to unlock
                        </p>
                      </div>
                    )}

                    {/* Bosses Section */}
                    {isUnlocked && zoneBosses.length > 0 && (
                      <div className="mt-auto space-y-3 pt-5 border-t border-border/30">
                        {zoneBosses.map(boss => {
                          const isBossUnlocked = (completion / 100) >= boss.required_completion;
                          const isDefeated = defeatedBossIds?.has(boss.id);

                          return (
                            <div key={boss.id} className="flex items-center justify-between rounded-xl bg-background/50 p-2 pl-3 border border-border/30">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl drop-shadow-md">{boss.icon}</span>
                                <span className={`text-xs font-bold uppercase tracking-wide ${isDefeated ? "text-muted-foreground line-through opacity-70" : "text-red-400"}`}>
                                  {boss.name}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant={isDefeated ? "outline" : isBossUnlocked ? "battle" : "secondary"}
                                disabled={!isBossUnlocked}
                                asChild={isBossUnlocked}
                                className={cn(
                                  "h-8 text-xs font-pixel-accent tracking-wider rounded-lg",
                                  !isDefeated && isBossUnlocked ? "animate-pulse-glow" : ""
                                )}
                              >
                                {isBossUnlocked ? (
                                  <Link href={`/bosses/${boss.id}`}>
                                    {isDefeated ? "REPLAY" : <><Swords className="mr-1.5 h-3 w-3" /> FIGHT</>}
                                  </Link>
                                ) : (
                                  <span className="flex items-center gap-1.5 opacity-60">
                                    <Lock className="h-3 w-3" /> {Math.round(boss.required_completion * 100)}%
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
              </SlideUp>
            );
          })}
        </div>
      </div>
    </div>
  );
}
