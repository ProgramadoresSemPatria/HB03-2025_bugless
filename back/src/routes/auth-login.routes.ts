import { Router } from 'express';

import { AuthUserController } from '../controllers/auth-user.controller';

const userAuthRouter = Router();

const authControllerInstance = new AuthUserController();

userAuthRouter.post("/session", authControllerInstance.handle); 

export default userAuthRouter;