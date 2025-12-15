
import { supabase } from "./supabase.js";

export async function esAdmin() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error("PROFILE ERROR:", error);
    return false;
  }

  console.log("PROFILE:", data);
  return data.role === "admin";
}
