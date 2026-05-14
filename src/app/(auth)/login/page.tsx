"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ParticleBackground } from "@/components/animation/particle-background";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (email === "admin@gmail.com") {
      toast.success("Welcome to the Admin Panel!");
      router.push("/admin");
    } else {
      toast.success("Welcome back, adventurer!");
      router.push("/dashboard");
    }
    router.refresh();
  };

  const handleOAuth = async (provider: "google" | "github") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <ParticleBackground count={40} />
      <div className="pointer-events-none absolute left-1/3 top-1/3 h-96 w-96 rounded-full bg-purple-600/15 blur-[128px]" />
      <div className="pointer-events-none absolute bottom-1/3 right-1/3 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <Card className="glass-strong border-border/50">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-2 text-5xl"
            >
              ⚔️
            </motion.div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Continue your coding adventure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="adventurer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
              <Button
                type="submit"
                variant="game"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Entering realm..." : "Sign In"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleOAuth("google")}
                className="bg-background/50"
              >
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOAuth("github")}
                className="bg-background/50"
              >
                GitHub
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              New adventurer?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Create your character
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
