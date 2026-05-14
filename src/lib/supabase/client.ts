import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder_key";
  
  return createBrowserClient<Database>(
    url === "your_supabase_url" ? "https://placeholder.supabase.co" : url,
    key === "your_supabase_anon_key" ? "placeholder_key" : key
  );
}
