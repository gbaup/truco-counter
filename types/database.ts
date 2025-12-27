export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
}

export type PublicUser = Omit<User, "password">;


