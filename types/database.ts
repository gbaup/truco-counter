export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
}

export interface MatchState {
  view: "setup" | "match";
  team1: User[];
  team2: User[];
  maxPoints: number;
}
