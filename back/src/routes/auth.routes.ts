import { Router } from "express";
import authController from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/cli-login", authController.cliLogin);
authRouter.get("/cli-status", authController.cliStatus);

export default authRouter;

