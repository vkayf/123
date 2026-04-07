import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// защита от краша если env нет
if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase env not configured");
}

export const supabase = createClient(
  supabaseUrl || "",
  supabaseKey || ""
);
