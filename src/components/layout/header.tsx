"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUIStore } from "@/stores/ui-store";
import { useGameStore } from "@/stores/game-store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { motion } from "framer-motion";

export function Header() {
  const router = useRouter();
  const supabase = createClient();
  const { toggleSidebar } = useUIStore();
  const character = useGameStore((s) => s.character);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Until next time, adventurer!");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/40 bg-background/70 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {character && (
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Avatar className="h-8 w-8 border-2 border-primary/30">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-xs font-bold text-primary">
                {character.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-tight">{character.name}</p>
              <p className="text-[11px] text-muted-foreground font-medium">
                Lv.{character.level}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {character && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 mr-3 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20"
          >
            <span className="text-sm">💰</span>
            <span className="text-sm font-bold text-gradient-gold">
              {character.gold.toLocaleString()}
            </span>
          </motion.div>
        )}
        <LanguageToggle />
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          title="Logout"
          className="hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
