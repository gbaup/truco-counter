export interface GroupFeatures {
  liveMatch: boolean;
  pointsLogs: boolean;
  glickoRanking: boolean;
}

export interface Group {
  id: string;
  name: string;
  admin_id: string;
  created_at: string | null;
  features: Partial<GroupFeatures>;
}

export interface GroupMembership {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string | null;
  rating: number;
  rating_deviation: number;
  elo_rating: number;
  last_decay_at: string | null;
}

export interface InviteToken {
  id: string;
  group_id: string;
  created_by_user_id: string;
  token: string;
  revoked_at: string | null;
  created_at: string | null;
}

export interface GroupMember {
  id: string;
  username: string;
  name: string;
  last_name: string;
  joined_at: string | null;
  rating: number;
  rating_deviation: number;
  elo_rating: number;
}

export interface GroupWithMembers extends Group {
  member_count: number;
  members: GroupMember[];
}
