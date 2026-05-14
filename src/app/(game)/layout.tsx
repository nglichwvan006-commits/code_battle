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
    <div className="flex min-h-screen">
      <Sidebar />
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 240 : 64 }}
        className="flex flex-1 flex-col"
      >
        <Header />
        <div className="flex-1 p-6">{children}</div>
      </motion.main>
    </div>
  );
}
