export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
}

export type PublicUser = Omit<User, "password">;

export interface MatchState {
  view: "setup" | "match";
  team1: PublicUser[];
  team2: PublicUser[];
  maxPoints: number;
}
