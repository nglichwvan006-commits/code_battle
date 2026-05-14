"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/animation/fade-in";
import { toast } from "sonner";
import { Play, RotateCcw, ShieldAlert, Sparkles, Loader2, Sword } from "lucide-react";
import { ParticleBackground } from "@/components/animation/particle-background";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@/features/problems/components/code-editor"), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full bg-secondary/50" />,
});

const LANGUAGES = [
  { id: "cpp", label: "C++", monacoId: "cpp" },
  { id: "python", label: "Python", monacoId: "python" },
  { id: "javascript", label: "JavaScript", monacoId: "javascript" },
  { id: "csharp", label: "C#", monacoId: "csharp" },
];

export default function BossBattlePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("# Defeat the boss by writing a solution!\n\ndef solve(input_data):\n    pass\n");
  const [bossHealth, setBossHealth] = useState(100);
  const [battleState, setBattleState] = useState<"intro" | "idle" | "attacking" | "victory" | "defeat">("intro");

  // Intro sequence
  useState(() => {
    setTimeout(() => setBattleState("idle"), 2000);
  });

  const { data: boss, isLoading } = useQuery({
    queryKey: ["boss", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("bosses")
        .select("*, problems(*)")
        .eq("id", id)
        .single();
      return data;
    },
  });

  const attackMutation = useMutation({
    mutationFn: async () => {
      if (!boss?.problems) throw new Error("Boss has no problem attached");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: charRow } = await supabase
        .from("characters")
        .select("id")
        .eq("profile_id", user.id)
        .single();

      if (!charRow) throw new Error("No character found");

      setBattleState("attacking");

      // Submit to Wandbox API
      const wandboxUrl = "https://wandbox.org/api/compile.json";
      
      const compilerMap: Record<string, string> = {
        cpp: "gcc-head",
        python: "cpython-3.14.0",
        javascript: "nodejs-20.17.0",
        csharp: "dotnetcore-8.0.402",
      };
      
      const response = await fetch(wandboxUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          compiler: compilerMap[language] || "cpython-3.14.0",
          code: code,
          stdin: (boss.problems as any).sample_input || "",
        }),
      });

      const result = await response.json();
      const output = result.program_output || result.program_message || "";
      const expectedOutput = (boss.problems as any).sample_output?.trim() || "";
      
      const isCompileError = !!result.compiler_error;
      const isRuntimeError = result.status !== "0" && !isCompileError;
      
      const isAccepted = !isCompileError && !isRuntimeError && output.trim() === expectedOutput;
      const status = isAccepted ? "accepted" : "wrong_answer";

      // Save submission
      await supabase.from("submissions").insert({
        character_id: charRow.id,
        problem_id: (boss.problems as any).id,
        code,
        language,
        status,
      });

      if (isAccepted) {
        // Boss defeated
        setBossHealth(0);
        setBattleState("victory");

        // Record defeat
        await supabase.from("boss_progress").upsert({
          character_id: charRow.id,
          boss_id: boss.id,
          defeated: true,
          defeated_at: new Date().toISOString()
        }, { onConflict: "character_id,boss_id" });

        // Award EXP and Gold
        await supabase.rpc("award_exp_gold" as never, {
          p_character_id: charRow.id,
          p_exp: boss.exp_reward,
          p_gold: boss.gold_reward,
        } as never);
        
        toast.success(`Victory! You defeated ${boss.name}!`);
      } else {
        // Take damage / boss survives
        setBossHealth((h) => Math.max(10, h - 20));
        setBattleState("defeat");
        setTimeout(() => setBattleState("idle"), 2000);
        toast.error("Your attack missed! (Wrong Answer)");
      }

      return { status, result, isAccepted };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["character"] });
      queryClient.invalidateQueries({ queryKey: ["zone-progress"] });
    },
    onError: (error) => {
      setBattleState("idle");
      toast.error(error.message || "Attack failed");
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2 h-[calc(100vh-8rem)]">
        <Skeleton className="h-full rounded-2xl" />
        <Skeleton className="h-full rounded-2xl" />
      </div>
    );
  }

  if (!boss) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <span className="text-6xl mb-4 opacity-50">👻</span>
        <h2 className="font-pixel text-xl text-muted-foreground">Boss Not Found</h2>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] h-[calc(100vh-7rem)] max-h-[800px]">
      {/* Boss Cinematic View */}
      <FadeIn className="h-full">
        <Card className={`relative h-full overflow-hidden border-2 transition-all duration-700 ${
          battleState === "victory" ? "border-emerald-500/50 glow-green shadow-[0_0_50px_rgba(16,185,129,0.2)]" : 
          battleState === "defeat" ? "border-red-500/80 glow-red shadow-[0_0_50px_rgba(239,68,68,0.3)] animate-shake" : 
          "border-red-900/40 shadow-[0_0_30px_rgba(220,38,38,0.1)]"
        }`}>
          {/* Background FX */}
          <div className="absolute inset-0 bg-[url('/bg-grid.svg')] opacity-[0.03] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-red-950/40 via-transparent to-red-900/10 pointer-events-none" />
          
          {battleState === "idle" && <ParticleBackground count={30} palette="fire" speed={0.5} className="opacity-50" />}
          {battleState === "attacking" && <ParticleBackground count={80} palette="battle" speed={2} className="opacity-80" />}
          
          <CardContent className="flex flex-col items-center justify-center p-8 h-full relative z-10">
            {/* Intro Flash */}
            <AnimatePresence>
              {battleState === "intro" && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 bg-red-500 z-50 flex items-center justify-center mix-blend-overlay"
                >
                  <h1 className="font-pixel text-5xl text-white drop-shadow-[0_0_10px_red]">WARNING</h1>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Health Bar */}
            <div className="absolute top-6 left-8 right-8">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h2 className="font-pixel-accent text-lg text-red-400 drop-shadow-md">{boss.name}</h2>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground/80 font-bold">
                    {boss.boss_type === 'final' ? 'CLASS: APEX PREDATOR' : 'CLASS: ELITE MINION'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-pixel text-2xl text-red-500">{bossHealth}</span>
                  <span className="font-pixel text-xs text-red-500/60 ml-1">HP</span>
                </div>
              </div>
              <div className="p-1 rounded-full bg-black/60 border border-red-900/50 backdrop-blur-sm">
                <Progress value={bossHealth} variant="hp" className="h-3" showLabel={false} />
              </div>
            </div>

            {/* Boss Sprite */}
            <div className="flex-1 flex items-center justify-center mt-12 w-full">
              <AnimatePresence mode="wait">
                {battleState === "victory" ? (
                  <motion.div
                    initial={{ scale: 1, opacity: 1, filter: "brightness(1) blur(0px)" }}
                    animate={{ scale: 0.5, opacity: 0, rotate: 180, filter: "brightness(2) blur(10px)" }}
                    transition={{ duration: 1.5, ease: "easeIn" }}
                    className="text-9xl filter drop-shadow-[0_0_50px_rgba(239,68,68,0.8)]"
                  >
                    {boss.icon}
                  </motion.div>
                ) : (
                  <motion.div
                    animate={
                      battleState === "intro" ? { scale: [0, 1.2, 1], filter: ["blur(20px)", "blur(0px)"] } :
                      battleState === "attacking" ? { x: [0, -15, 15, -15, 15, 0], scale: 1.05 } :
                      battleState === "defeat" ? { scale: 1.2, filter: "brightness(2) sepia(1) hue-rotate(-50deg) saturate(3)" } :
                      { y: [0, -15, 0] }
                    }
                    transition={
                      battleState === "intro" ? { duration: 1, ease: "easeOut" } :
                      battleState === "idle" ? { repeat: Infinity, duration: 4, ease: "easeInOut" } :
                      { duration: 0.4 }
                    }
                    className="text-[140px] leading-none filter drop-shadow-[0_0_40px_rgba(220,38,38,0.4)]"
                  >
                    {boss.icon}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {battleState === "victory" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md z-20"
              >
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                  <div className="w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[100px] animate-pulse-glow" />
                </div>
                
                <Sparkles className="h-16 w-16 text-yellow-400 mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
                <h2 className="font-pixel text-3xl sm:text-4xl text-gradient-gold mb-6 text-center leading-tight">
                  BOSS DEFEATED
                </h2>
                
                <div className="flex gap-4 mb-10">
                  <div className="glass px-6 py-3 rounded-xl border-emerald-500/30 flex flex-col items-center">
                    <span className="text-[10px] font-bold text-muted-foreground mb-1 uppercase">EXP Gained</span>
                    <span className="font-pixel-accent text-lg text-emerald-400">+{boss.exp_reward}</span>
                  </div>
                  <div className="glass px-6 py-3 rounded-xl border-amber-500/30 flex flex-col items-center">
                    <span className="text-[10px] font-bold text-muted-foreground mb-1 uppercase">Gold Found</span>
                    <span className="font-pixel-accent text-lg text-amber-400">+{boss.gold_reward}</span>
                  </div>
                </div>
                
                <Button size="xl" variant="game" onClick={() => router.push("/map")} className="min-w-[200px]">
                  Return to Map
                </Button>
              </motion.div>
            )}

            <div className="absolute bottom-6 left-8 right-8 text-center bg-black/40 backdrop-blur-md p-4 rounded-xl border border-red-900/30">
              <p className="text-xs sm:text-sm text-red-100 font-medium leading-relaxed italic">
                "{boss.description}"
              </p>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Code Editor Terminal */}
      <FadeIn delay={0.1} className="h-full">
        <Card className="flex h-full flex-col border-primary/20 shadow-lg bg-card/95 backdrop-blur-md">
          <CardHeader className="py-3 px-4 border-b border-border/50 bg-secondary/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-pixel flex items-center gap-2 text-primary">
                <Sword className="h-4 w-4" />
                COMBAT_TERMINAL.EXE
              </CardTitle>
              <div className="flex gap-1.5 bg-background/50 p-1 rounded-lg border border-border/50">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                      language === lang.id 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex flex-1 flex-col gap-0 p-0 overflow-hidden">
            {boss.problems && (
              <div className="px-5 py-4 border-b border-border/30 bg-background/40 shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive" className="text-[9px] h-4 uppercase rounded-sm font-bold">Target</Badge>
                  <h3 className="text-sm font-bold text-foreground">{(boss.problems as any).title}</h3>
                </div>
                <p className="text-xs text-muted-foreground whitespace-pre-wrap max-h-24 overflow-y-auto pr-2 custom-scrollbar font-medium">
                  {(boss.problems as any).statement}
                </p>
              </div>
            )}
            
            <div className="flex-1 min-h-[200px] relative">
              {/* Editor scanline overlay */}
              <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20" />
              <MonacoEditor
                language={LANGUAGES.find((l) => l.id === language)?.monacoId || "python"}
                value={code}
                onChange={setCode}
              />
            </div>
            
            <div className="p-4 border-t border-border/50 bg-secondary/30 shrink-0 flex gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCode("# Reset\n")}
                className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-border/50"
                title="Reset Code"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="battle"
                onClick={() => attackMutation.mutate()}
                disabled={attackMutation.isPending || battleState === "victory"}
                className="flex-1 font-pixel-accent text-sm tracking-widest h-10 shadow-[0_4px_0_rgba(185,28,28,1)] active:shadow-none active:translate-y-1"
              >
                {attackMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    CASTING...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" fill="currentColor" />
                    EXECUTE_ATTACK
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
