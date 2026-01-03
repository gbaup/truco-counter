import { JWTPayload } from "jose";

export interface Session extends JWTPayload {
    userId: string;
    username?: string;
}
