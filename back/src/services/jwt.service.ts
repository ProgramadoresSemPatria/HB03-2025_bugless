import jwt, { JwtPayload } from "jsonwebtoken";
import envLoader from "./env-loader.service";

export interface TokenPayload {
    userId: string;
    email: string;
    name: string;
}

class JwtService {
    private secret: string;
    private expiresIn: string;

    constructor() {
        this.secret = envLoader.getEnv("JWT_SECRET");
        this.expiresIn = envLoader.getEnv("JWT_EXPIRES_IN") || "7d";
    }

    generateToken(payload: TokenPayload): string {
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
    }

    verifyToken(token: string): TokenPayload | null {
        try {
            const decoded = jwt.verify(token, this.secret) as JwtPayload & TokenPayload;
            return {
                userId: decoded.userId,
                email: decoded.email,
                name: decoded.name,
            };
        } catch {
            return null;
        }
    }
}

const jwtService = new JwtService();

export default jwtService;
