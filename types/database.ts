export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
}

export type PublicUser = Omit<User, "password"> & { isPlaying?: boolean };


export interface UserStats {
  user_id: string;
  username: string;
  wins: number;
  losses: number;
  rating: number;
  rating_deviation: number;
}
