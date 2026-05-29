import type { GroupMember } from "@/types/group";

type MembershipWithUser = {
  users: { id: string; username: string; name: string; last_name: string } | null;
  joined_at: Date | null;
  rating: number;
  rating_deviation: number;
  elo_rating: number;
};

export function toGroupMember(m: MembershipWithUser): GroupMember {
  return {
    id: m.users!.id,
    username: m.users!.username,
    name: m.users!.name,
    last_name: m.users!.last_name,
    joined_at: m.joined_at?.toISOString() ?? null,
    rating: m.rating,
    rating_deviation: m.rating_deviation,
    elo_rating: m.elo_rating,
  };
}
