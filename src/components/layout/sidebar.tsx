"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS: { href: string; i18nKey: DictionaryKey; icon: React.ComponentType<{ className?: string }> }[] = [
  { href: "/dashboard", i18nKey: "dashboard", icon: LayoutDashboard },
  { href: "/problems", i18nKey: "problems", icon: Code },
  { href: "/map", i18nKey: "map", icon: Map },
  { href: "/inventory", i18nKey: "inventory", icon: Backpack },
  { href: "/pets", i18nKey: "pets", icon: Cat },
  { href: "/quests", i18nKey: "quests", icon: Swords },
  { href: "/achievements", i18nKey: "achievements", icon: Trophy },
  { href: "/leaderboard", i18nKey: "leaderboard", icon: Crown },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { t } = useI18nStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 240 : 64 }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar"
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <Flame className="h-6 w-6 shrink-0 text-primary" />
        {sidebarOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-bold tracking-tight"
          >
            Code Adventure
          </motion.span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {t(item.i18nKey)}
                  </motion.span>
                )}
                {isActive && sidebarOpen && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 h-8 w-1 rounded-r-full bg-primary"
                    transition={{ type: "spring", bounce: 0.2 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
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
