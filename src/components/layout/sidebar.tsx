"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { useI18nStore } from "@/stores/i18n-store";
import { DictionaryKey } from "@/i18n/dictionaries";
import {
  LayoutDashboard,
  Swords,
  Code,
  Backpack,
  Cat,
  Map,
  Trophy,
  Flame,
  Crown,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS: { href: string; i18nKey: DictionaryKey; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { href: "/dashboard", i18nKey: "dashboard", icon: LayoutDashboard, color: "#a78bfa" },
  { href: "/problems", i18nKey: "problems", icon: Code, color: "#22d3ee" },
  { href: "/map", i18nKey: "map", icon: Map, color: "#60a5fa" },
  { href: "/inventory", i18nKey: "inventory", icon: Backpack, color: "#f472b6" },
  { href: "/pets", i18nKey: "pets", icon: Cat, color: "#a3e635" },
  { href: "/quests", i18nKey: "quests", icon: Swords, color: "#f87171" },
  { href: "/achievements", i18nKey: "achievements", icon: Trophy, color: "#fbbf24" },
  { href: "/leaderboard", i18nKey: "leaderboard", icon: Crown, color: "#fb923c" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { t } = useI18nStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email === "admin@gmail.com") {
        setIsAdmin(true);
      }
    });
  }, [supabase.auth]);

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 240 : 64 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl"
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.4 }}
        >
          <Flame className="h-6 w-6 shrink-0 text-neon-orange" />
        </motion.div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="font-pixel text-[9px] tracking-wider text-gradient-fire whitespace-nowrap"
            >
              CODE BATTLE
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full"
                    style={{ background: item.color }}
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <item.icon
                  className="h-5 w-5 shrink-0 transition-colors duration-200"
                  style={isActive ? { color: item.color } : undefined}
                />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                    >
                      {t(item.i18nKey)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
        {isAdmin && (
          <Link href="/admin">
            <motion.div
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 mt-4 border-t border-sidebar-border pt-4",
                pathname === "/admin"
                  ? "bg-destructive/10 text-destructive"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              {pathname === "/admin" && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-destructive"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <Shield className="h-5 w-5 shrink-0 text-destructive" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="text-destructive font-bold"
                  >
                    {t("admin")}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        )}
      </nav>

      {/* Toggle */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="w-full"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </motion.aside>
  );
}
