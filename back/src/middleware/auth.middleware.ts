import { Request, Response, NextFunction } from "express";
import jwtService, { TokenPayload } from "../services/jwt.service";
import HttpHelper from "../utils/http-helper";

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return HttpHelper.unauthorized(res, "No token provided");
    }

    const token = authHeader.substring(7);
    const payload = jwtService.verifyToken(token);

    if (!payload) {
        return HttpHelper.unauthorized(res, "Invalid or expired token");
    }

    req.user = payload;
    next();
}

export default authMiddleware;
