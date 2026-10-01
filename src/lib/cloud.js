import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const cloudEnabled = Boolean(url && key);
export const supabase = cloudEnabled ? createClient(url, key) : null;

export async function signInWithEmail(email) {
  if (!supabase) throw new Error("cloud-disabled");
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin + window.location.pathname }
  });
  if (error) throw error;
}

export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function loadCloudState(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("life_states")
    .select("state")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data?.state ?? null;
}

export async function saveCloudState(userId, state) {
  if (!supabase) return;
  const { error } = await supabase
    .from("life_states")
    .upsert({ user_id: userId, state, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) throw error;
}
