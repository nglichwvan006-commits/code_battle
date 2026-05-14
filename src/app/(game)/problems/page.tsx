"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/animation/fade-in";
import { Search, Filter, CheckCircle2 } from "lucide-react";
import type { Tables } from "@/types/database";

type Difficulty = "easy" | "medium" | "hard" | "all";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function ProblemsPage() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("all");
  const supabase = createClient();

  const { data: problems, isLoading } = useQuery({
    queryKey: ["problems", difficulty],
    queryFn: async () => {
      let query = supabase
        .from("problems")
        .select("*, zones(name)")
        .order("order_index");

      if (difficulty !== "all") {
        query = query.eq("difficulty", difficulty);
      }

      const { data } = await query;
      return data as (Tables<"problems"> & { zones: { name: string } })[];
    },
  });

  const { data: solvedIds } = useQuery({
    queryKey: ["solved-problems"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: charRow } = await supabase
        .from("characters")
        .select("id")
        .eq("profile_id", user.id)
        .single();

      if (!charRow) return [];

      const { data } = await supabase
        .from("submissions")
        .select("problem_id")
        .eq("character_id", charRow.id)
        .eq("status", "accepted");

      return data?.map((s) => s.problem_id) || [];
    },
  });

  const filtered = problems?.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-bold">Coding Problems</h1>
        <p className="text-sm text-muted-foreground">
          Solve challenges to earn EXP and level up
        </p>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={0.1} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/50"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "easy", "medium", "hard"] as const).map((d) => (
            <Button
              key={d}
              variant={difficulty === d ? "default" : "outline"}
              size="sm"
              onClick={() => setDifficulty(d)}
              className="capitalize"
            >
              <Filter className="mr-1 h-3 w-3" />
              {d}
            </Button>
          ))}
        </div>
      </FadeIn>

      {/* Problem List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {filtered?.map((problem) => {
            const isSolved = solvedIds?.includes(problem.id);
            return (
              <motion.div key={problem.id} variants={item}>
                <Link href={`/problems/${problem.slug}`}>
                  <Card className="transition-all hover:border-primary/30 hover:bg-accent/30">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        {isSolved && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                        <div>
                          <h3 className="font-medium">{problem.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {problem.zones?.name} • {problem.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={problem.difficulty}>
                          {problem.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          +{problem.exp_reward} EXP
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}

          {filtered?.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No problems found
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
