"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.16 0.025 280 / 0.9)",
            border: "1px solid oklch(0.30 0.03 280 / 0.5)",
            backdropFilter: "blur(16px)",
            color: "oklch(0.95 0.01 280)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
