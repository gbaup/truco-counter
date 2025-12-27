import { supabase } from "@/lib/supabase";
import { PublicUser } from "@/types/database";

export async function getUsers(): Promise<PublicUser[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, username");
  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return data || [];
}
