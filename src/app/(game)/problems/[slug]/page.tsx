"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/animation/fade-in";
import { Play, RotateCcw, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
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

export default function ProblemDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");

  const { data: problem, isLoading } = useQuery({
    queryKey: ["problem", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("problems")
        .select("*, zones(name)")
        .eq("slug", slug)
        .single();

      if (data?.starter_code) {
        const starterCode = data.starter_code as Record<string, string>;
        if (starterCode[language]) {
          setCode(starterCode[language]);
        }
      }

      return data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: charRow } = await supabase
        .from("characters")
        .select("id")
        .eq("profile_id", user.id)
        .single();

      if (!charRow) throw new Error("No character found");

      // Submit to Piston API (100% Free, No API Key)
      const pistonUrl = "https://emkc.org/api/v2/piston/execute";
      
      const response = await fetch(pistonUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: language === "cpp" ? "cpp" : language === "csharp" ? "csharp" : language,
          version: "*",
          files: [{ content: code }],
          stdin: problem?.sample_input || "",
        }),
      });

      const result = await response.json();
      const output = result.run?.stdout || "";
      const error = result.run?.stderr || result.compile?.stderr || "";
      const expectedOutput = problem?.sample_output?.trim() || "";
      const actualOutput = output.trim();
      
      const isCompileError = result.compile?.code !== 0 && result.compile?.stderr;
      const isRuntimeError = result.run?.code !== 0 && result.run?.stderr;
      
      let status = "wrong_answer";
      let isAccepted = false;
      
      if (isCompileError) {
        status = "compilation_error";
      } else if (isRuntimeError) {
        status = "runtime_error";
      } else if (actualOutput === expectedOutput) {
        status = "accepted";
        isAccepted = true;
      }

      // Save submission
      await supabase.from("submissions").insert({
        character_id: charRow.id,
        problem_id: problem!.id,
        code,
        language,
        status,
        runtime_ms: null, // Piston doesn't easily expose this in the same way
        memory_kb: null,
        output: actualOutput || null,
        error: error || null,
      });

      // Award EXP/Gold if accepted
      if (isAccepted && problem) {
        await supabase.rpc("award_exp_gold" as never, {
          p_character_id: charRow.id,
          p_exp: problem.exp_reward,
          p_gold: problem.gold_reward,
        } as never);
      }

      return { status, result, isAccepted };
    },
    onSuccess: (data) => {
      if (data.isAccepted) {
        toast.success("✅ Accepted! Great work, adventurer!");
      } else {
        toast.error(`❌ ${data.status.replace(/_/g, " ").toUpperCase()}`);
      }
      queryClient.invalidateQueries({ queryKey: ["solved-problems"] });
      queryClient.invalidateQueries({ queryKey: ["character"] });
    },
    onError: (error) => {
      toast.error(error.message || "Submission failed");
    },
  });

  const handleLanguageChange = useCallback(
    (lang: string) => {
      setLanguage(lang);
      if (problem?.starter_code) {
        const starterCode = problem.starter_code as Record<string, string>;
        setCode(starterCode[lang] || "");
      }
    },
    [problem]
  );

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[600px]" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        Problem not found
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Problem Statement */}
      <FadeIn>
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{problem.title}</CardTitle>
              <Badge variant={problem.difficulty}>{problem.difficulty}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              +{problem.exp_reward} EXP • +{problem.gold_reward} Gold
            </p>
          </CardHeader>
          <CardContent className="space-y-6 overflow-auto">
            <div>
              <h3 className="mb-2 font-semibold">Problem</h3>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {problem.statement}
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Input Format</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {problem.input_format}
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Output Format</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {problem.output_format}
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Constraints</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {problem.constraints}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold">Sample Input</h3>
                <pre className="rounded-lg bg-secondary p-3 text-sm font-mono">
                  {problem.sample_input}
                </pre>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Sample Output</h3>
                <pre className="rounded-lg bg-secondary p-3 text-sm font-mono">
                  {problem.sample_output}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Editor */}
      <FadeIn delay={0.1}>
        <Card className="flex h-full flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {LANGUAGES.map((lang) => (
                  <Button
                    key={lang.id}
                    variant={language === lang.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLanguageChange(lang.id)}
                  >
                    {lang.label}
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const starterCode = problem.starter_code as Record<string, string>;
                  setCode(starterCode?.[language] || "");
                }}
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div className="flex-1 min-h-[400px] rounded-lg overflow-hidden border border-border">
              <MonacoEditor
                language={LANGUAGES.find((l) => l.id === language)?.monacoId || "python"}
                value={code}
                onChange={setCode}
              />
            </div>
            <Button
              variant="game"
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending || !code.trim()}
              className="w-full"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Submit Solution
                </>
              )}
            </Button>

            {/* Result */}
            {submitMutation.data && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg border p-4 ${
                  submitMutation.data.isAccepted
                    ? "border-green-500/30 bg-green-500/10"
                    : "border-red-500/30 bg-red-500/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  {submitMutation.data.isAccepted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-semibold capitalize">
                    {submitMutation.data.status.replace(/_/g, " ")}
                  </span>
                </div>
                {submitMutation.data.result?.stdout && (
                  <pre className="mt-2 text-xs text-muted-foreground">
                    Output: {submitMutation.data.result.stdout}
                  </pre>
                )}
                {(submitMutation.data.result?.stderr ||
                  submitMutation.data.result?.compile_output) && (
                  <pre className="mt-2 text-xs text-red-400">
                    {submitMutation.data.result.stderr ||
                      submitMutation.data.result.compile_output}
                  </pre>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
