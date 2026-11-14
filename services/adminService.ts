import { fetchJSON } from "@/lib/fetchJSON";
import { AdminUser } from "@/types/database";

export async function listUsers(): Promise<AdminUser[]> {
  return fetchJSON<AdminUser[]>("/api/admin/users");
}
