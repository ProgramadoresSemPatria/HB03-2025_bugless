import { Router } from "express";
import projectController from "../controllers/project.controller";

const projectRouter = Router();

projectRouter.post("/", projectController.createProject);

projectRouter.get("/user/:id", projectController.listAllProjectsByUserId);

projectRouter.get("/:id", projectController.getProjectById);

projectRouter.patch("/:id", projectController.updateProjectById);

projectRouter.delete("/:id", projectController.deleteProjectById);

export default projectRouter;