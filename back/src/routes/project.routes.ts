import { Router } from "express";
import projectController from "../controllers/project.controller";

const projectRouter = Router();

projectRouter.post("/", projectController.createProject);

projectRouter.get("/user/:id", projectController.listAllProjectsByUserId);

export default projectRouter;