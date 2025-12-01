import { Router } from "express";
import projectController from "../controllers/project.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.";

const ProjectRouter = Router();

ProjectRouter.post("/register", isAuthenticated,projectController.create);
ProjectRouter.patch("/project/:id", isAuthenticated, projectController.update);
ProjectRouter.get("/getprojectsAll", isAuthenticated, projectController.getAllProject);
ProjectRouter.delete("/project/:id", isAuthenticated,projectController.delete);

export default ProjectRouter;

