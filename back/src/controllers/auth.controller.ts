import { Request, Response } from "express";
import { userSchema } from "../schemas/user.schema";
import { ZodError, flattenError } from "zod";
import userService from "../services/user.service";
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
}

const authController = new AuthController();

export default authController;