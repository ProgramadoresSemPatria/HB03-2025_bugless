import { Router } from "express";
import planController from "../controllers/plan.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.";

const PlanRouter = Router();

PlanRouter.post("/register", isAuthenticated, planController.create);
PlanRouter.patch("/plan/:id", isAuthenticated, planController.update);
PlanRouter.get("/allplans", isAuthenticated, planController.getAllPlan)
PlanRouter.delete("/plan/:id", isAuthenticated, planController.delete)

export default PlanRouter;
