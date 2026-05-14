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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-lg">
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
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-primary/30">
              <AvatarFallback className="bg-primary/20 text-xs font-bold">
                {character.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">{character.name}</p>
              <p className="text-xs text-muted-foreground">
                Level {character.level}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {character && (
          <div className="flex items-center gap-4 mr-2">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">💰</span>
              <span className="text-sm font-semibold text-gold">
                {character.gold.toLocaleString()}
              </span>
            </div>
          </div>
        )}
        <LanguageToggle />
        <ThemeToggle />
        <Button variant="ghost" size="icon" onClick={handleSignOut} title="Logout">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
