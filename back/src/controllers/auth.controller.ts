import { Request, Response } from "express";
import { userSchema, loginSchema, cliLoginSchema, cliSessionSchema } from "../schemas/user.schema";
import { ZodError, flattenError } from "zod";
import { compareSync } from "bcrypt";
import userService from "../services/user.service";
import jwtService from "../services/jwt.service";
import cliSessionService from "../services/cli-session.service";
import HttpHelper from "../utils/http-helper";

class AuthController {

    async register(req: Request, res: Response){
        try {
            const dataUser = userSchema.parse(req.body);

            const userExists = await userService.checkIfUserExistsByEmail(dataUser);
            if (userExists) {
                return HttpHelper.conflict(res, "User already exists");
            }

            const user = await userService.createUser(dataUser);
            return HttpHelper.created(res, user, "User registered successfully");
        } catch (error) {
            if (error instanceof ZodError) {
                return HttpHelper.badRequest(res, "Validation error", flattenError(error));
            }
            console.error("Error registering user:", error);
            return HttpHelper.serverError(res);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const data = loginSchema.parse(req.body);

            const user = await userService.getUserByEmail({ email: data.email });
            if (!user) {
                return HttpHelper.unauthorized(res, "Invalid email or password");
            }

            const isPasswordValid = compareSync(data.password, user.password);
            if (!isPasswordValid) {
                return HttpHelper.unauthorized(res, "Invalid email or password");
            }

            const token = jwtService.generateToken({
                userId: user.id,
                email: user.email,
                name: user.name,
            });

            return HttpHelper.success(res, {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            }, "Login successful");
        } catch (error) {
            if (error instanceof ZodError) {
                return HttpHelper.badRequest(res, "Validation error", flattenError(error));
            }
            console.error("Error in login:", error);
            return HttpHelper.serverError(res);
        }
    }

    async cliLogin(req: Request, res: Response) {
        try {
            const data = cliLoginSchema.parse(req.body);

            // Validate credentials
            const user = await userService.getUserByEmail({ email: data.email });
            if (!user) {
                return HttpHelper.unauthorized(res, "Invalid email or password");
            }

            const isPasswordValid = compareSync(data.password, user.password);
            if (!isPasswordValid) {
                return HttpHelper.unauthorized(res, "Invalid email or password");
            }

            // Check if session exists and is valid
            let session = await cliSessionService.getSession(data.sessionId);

            if (!session) {
                // Create session if it doesn't exist (for direct CLI login via frontend)
                session = await cliSessionService.createSession(data.sessionId);
            }

            if (session.status === "expired") {
                return HttpHelper.badRequest(res, "Session expired", { sessionId: ["Session has expired. Please try again from the CLI."] });
            }

            if (session.status === "completed") {
                return HttpHelper.badRequest(res, "Session already used", { sessionId: ["This session has already been used."] });
            }

            // Generate token
            const token = jwtService.generateToken({
                userId: user.id,
                email: user.email,
                name: user.name,
            });

            // Complete the session
            await cliSessionService.completeSession(data.sessionId, user.id, token);

            return HttpHelper.success(res, {
                message: "CLI login successful. You can close this window and return to the CLI.",
            }, "CLI authentication completed");
        } catch (error) {
            if (error instanceof ZodError) {
                return HttpHelper.badRequest(res, "Validation error", flattenError(error));
            }
            console.error("Error in CLI login:", error);
            return HttpHelper.serverError(res);
        }
    }

    async cliStatus(req: Request, res: Response) {
        try {
            const data = cliSessionSchema.parse({ sessionId: req.query.sid });

            const session = await cliSessionService.getSession(data.sessionId);

            if (!session) {
                return HttpHelper.notFound(res, "Session not found");
            }

            if (session.status === "pending") {
                return HttpHelper.success(res, { status: "pending" }, "Waiting for authentication");
            }

            if (session.status === "expired") {
                return HttpHelper.badRequest(res, "Session expired", { status: "expired" });
            }

            if (session.status === "completed" && session.token && session.user) {
                return HttpHelper.success(res, {
                    status: "completed",
                    token: session.token,
                    user: {
                        id: session.user.id,
                        name: session.user.name,
                        email: session.user.email,
                    },
                }, "Authentication completed");
            }

            return HttpHelper.serverError(res);
        } catch (error) {
            if (error instanceof ZodError) {
                return HttpHelper.badRequest(res, "Invalid session ID", flattenError(error));
            }
            console.error("Error in CLI status:", error);
            return HttpHelper.serverError(res);
        }
    }
}

const authController = new AuthController();

export default authController;