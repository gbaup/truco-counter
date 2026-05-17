import { JWTPayload } from "jose";

export const UserRole = {
    user: "user",
    admin: "admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface Session extends JWTPayload {
    userId: string;
    username?: string;
    role?: UserRole;
}
