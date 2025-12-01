import { Request, Response } from "express";
import { AuthUserService } from "../services/auth-user.service";

class AuthUserController {
    async handle(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const authUserService = new AuthUserService();

            const auth = await authUserService.execute({
                email, 
                password
            });

            return res.status(200).json(auth); 
        
        } catch (error: any) {
            console.error("Error in AuthUserController:", error);
        
            const status = (error.message.includes('Invalid') || error.message.includes('not found')) ? 401 : 400;

            return res.status(status).json({ error: error.message || "Authentication failed." });
        }
    }
}

export { AuthUserController }