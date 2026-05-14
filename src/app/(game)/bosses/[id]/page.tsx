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
import { Play, RotateCcw, ShieldAlert, Sparkles, Loader2 } from "lucide-react";
import { JUDGE0_LANGUAGE_IDS } from "@/constants/game-config";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@/features/problems/components/code-editor"), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px]" />,
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
  const [battleState, setBattleState] = useState<"idle" | "attacking" | "victory" | "defeat">("idle");

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
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  if (!boss) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        Boss not found or you are not ready.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Boss Cinematic View */}
      <FadeIn>
        <Card className={`h-full overflow-hidden border-2 transition-colors duration-500 ${
          battleState === "victory" ? "border-green-500/50 glow-green" : 
          battleState === "defeat" ? "border-red-500/50 glow-red" : "border-red-900/30 glow-red"
        }`}>
          <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent pointer-events-none" />
          
          <CardContent className="flex flex-col items-center justify-center p-12 min-h-[400px] relative">
            {/* Health Bar */}
            <div className="absolute top-6 left-6 right-6 space-y-2">
              <div className="flex justify-between text-sm font-bold uppercase tracking-wider">
                <span className="text-red-400">{boss.name}</span>
                <span className="text-muted-foreground">{bossHealth}% HP</span>
              </div>
              <Progress value={bossHealth} className="h-4 bg-red-950" indicatorColor="bg-red-500" />
            </div>

            {/* Boss Sprite */}
            <AnimatePresence mode="wait">
              {battleState === "victory" ? (
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 0, opacity: 0, rotate: 180 }}
                  transition={{ duration: 1 }}
                  className="text-9xl filter drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]"
                >
                  {boss.icon}
                </motion.div>
              ) : (
                <motion.div
                  animate={
                    battleState === "attacking" ? { x: [0, -10, 10, -10, 10, 0] } :
                    battleState === "defeat" ? { scale: 1.2, filter: "brightness(1.5)" } :
                    { y: [0, -15, 0] }
                  }
                  transition={
                    battleState === "idle" ? { repeat: Infinity, duration: 4, ease: "easeInOut" } :
                    { duration: 0.5 }
                  }
                  className="text-9xl filter drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                >
                  {boss.icon}
                </motion.div>
              )}
            </AnimatePresence>

            {battleState === "victory" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10"
              >
                <Sparkles className="h-16 w-16 text-yellow-400 mb-4 animate-pulse" />
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 mb-2">
                  BOSS DEFEATED!
                </h2>
                <div className="flex gap-4 text-sm font-bold">
                  <span className="text-exp">+{boss.exp_reward} EXP</span>
                  <span className="text-gold">+{boss.gold_reward} Gold</span>
                </div>
                <Button className="mt-8" variant="game" onClick={() => router.push("/map")}>
                  Return to Map
                </Button>
              </motion.div>
            )}

            <div className="absolute bottom-6 left-6 right-6 text-center">
              <Badge variant="outline" className="bg-background/50 backdrop-blur-md border-red-500/30 text-red-200">
                {boss.boss_type === 'final' ? 'Final Boss' : 'Mini Boss'}
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                {boss.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Code Editor */}
      <FadeIn delay={0.1}>
        <Card className="flex h-full flex-col">
          <CardHeader className="pb-3 border-b border-border/50 bg-secondary/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                Combat Terminal
              </CardTitle>
              <div className="flex gap-2">
                {LANGUAGES.map((lang) => (
                  <Button
                    key={lang.id}
                    variant={language === lang.id ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setLanguage(lang.id)}
                  >
                    {lang.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4 pt-4">
            {boss.problems && (
              <div className="mb-2 space-y-2">
                <h3 className="text-sm font-semibold text-red-400">Boss Challenge: {(boss.problems as any).title}</h3>
                <p className="text-xs text-muted-foreground whitespace-pre-wrap max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                  {(boss.problems as any).statement}
                </p>
              </div>
            )}
            
            <div className="flex-1 min-h-[300px] rounded-lg overflow-hidden border border-red-900/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
              <MonacoEditor
                language={LANGUAGES.find((l) => l.id === language)?.monacoId || "python"}
                value={code}
                onChange={setCode}
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setCode("# Reset\n")}
                className="px-3"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="game"
                onClick={() => attackMutation.mutate()}
                disabled={attackMutation.isPending || battleState === "victory"}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white border-b-4 border-red-800"
              >
                {attackMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Casting Spell...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    EXECUTE ATTACK
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
