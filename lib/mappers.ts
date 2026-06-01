import type { GroupFeatures, GroupMember, GroupWithMembers } from "@/types/group";

type MembershipWithUser = {
  users: { id: string; username: string; name: string; last_name: string } | null;
  joined_at: Date | null;
  rating: number;
  rating_deviation: number;
  elo_rating: number;
};

type GroupWithMemberships = {
  id: string;
  name: string;
  admin_id: string;
  created_at: Date | null;
  features: unknown;
  _count: { memberships: number };
  memberships: MembershipWithUser[];
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

export function toGroupDetail(group: GroupWithMemberships): GroupWithMembers {
  return {
    id: group.id,
    name: group.name,
    admin_id: group.admin_id,
    created_at: group.created_at?.toISOString() ?? null,
    features: (group.features ?? {}) as Partial<GroupFeatures>,
    member_count: group._count.memberships,
    members: group.memberships.map(toGroupMember),
  };
}
