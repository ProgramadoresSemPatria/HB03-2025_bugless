import { Router } from 'express';
import userController from '../controllers/user.controller';
import { isAuthenticated } from '../middlewares/isAuthenticated.';
const userRouter = Router();

userRouter.post("/", userController.createUser); 
userRouter.get("/getEmail", isAuthenticated, userController.getUserByEmail);
userRouter.get("/getAllUsers", isAuthenticated,userController.getAllUsers)
userRouter.patch("/:id", userController.updateUser);
userRouter.delete("/:id", isAuthenticated, userController.deleteUser);

export default userRouter;