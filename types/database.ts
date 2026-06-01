import type { UserRole } from "./auth";

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
}

export type PublicUser = Omit<User, "password"> & { isPlaying?: boolean };

export interface AdminUser {
  id: string;
  name: string;
  last_name: string;
  username: string;
  role: UserRole;
}

export interface UserStats {
  user_id: string;
  username: string;
  wins: number;
  losses: number;
  rating?: number;
  rating_deviation?: number;
  elo_rating?: number;
}

export interface VersusStats {
  total_matches: number;
  p1_wins: number;
  p2_wins: number;
  draws: number;
}
