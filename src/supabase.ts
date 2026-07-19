import { createClient } from "@supabase/supabase-js";

let supabaseClientInstance: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  const supabaseUrl = (import.meta as any).env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = (import.meta as any).env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase credentials missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables."
    );
  }

  if (!supabaseClientInstance) {
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseClientInstance;
}

export function isSupabaseConfigured(): boolean {
  const supabaseUrl = (import.meta as any).env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = (import.meta as any).env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(supabaseUrl && supabaseAnonKey);
}
