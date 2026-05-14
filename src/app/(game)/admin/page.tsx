"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/animation/fade-in";
import { Users, Code, Trophy, Sword } from "lucide-react";

export default function AdminPage() {
  const supabase = createClient();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [profiles, characters, problems, submissions] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("characters").select("*", { count: "exact", head: true }),
        supabase.from("problems").select("*", { count: "exact", head: true }),
        supabase.from("submissions").select("*", { count: "exact", head: true }),
      ]);

      return {
        users: profiles.count || 0,
        characters: characters.count || 0,
        problems: problems.count || 0,
        submissions: submissions.count || 0,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          System overview and management
        </p>
      </FadeIn>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Users", value: stats?.users, icon: Users, color: "text-blue-500" },
          { title: "Characters Created", value: stats?.characters, icon: Sword, color: "text-red-500" },
          { title: "Total Problems", value: stats?.problems, icon: Trophy, color: "text-yellow-500" },
          { title: "Code Submissions", value: stats?.submissions, icon: Code, color: "text-green-500" },
        ].map((stat, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.4}>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <h3 className="text-lg font-semibold mb-2">Management Tools</h3>
            <p className="text-sm">
              Use Supabase Studio for full database CRUD operations. This interface is currently read-only.
            </p>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
