import { Router } from "express";
import projectController from "../controllers/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const projectRouter = Router();

projectRouter.post("/", authMiddleware, projectController.createProject);
projectRouter.post("/find-or-create", authMiddleware, projectController.findOrCreateByRepo);

projectRouter.get("/user/:id", authMiddleware, projectController.listAllProjectsByUserId);

projectRouter.get("/:id", authMiddleware, projectController.getProjectById);

projectRouter.patch("/:id", authMiddleware, projectController.updateProjectById);

projectRouter.delete("/:id", authMiddleware, projectController.deleteProjectById);

export default projectRouter;