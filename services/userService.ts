import { supabase } from "@/lib/supabase";
import { User } from "@/types/database";

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, username");
  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return data || [];
}
