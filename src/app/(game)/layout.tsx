"use client";

import { useUIStore } from "@/stores/ui-store";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { motion } from "framer-motion";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-1 flex-col min-w-0"
      >
        <Header />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
