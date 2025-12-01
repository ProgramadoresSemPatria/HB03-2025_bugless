import { Router } from "express";

import statusPlanController from "../controllers/status.plan.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.";

const StatusPlanRouter = Router();

StatusPlanRouter.post("/register", isAuthenticated,statusPlanController.create);
StatusPlanRouter.patch("/statusplan/:id", isAuthenticated,statusPlanController.update);
StatusPlanRouter.get("/getallstatusplan", isAuthenticated,statusPlanController.getAllStatusPlan);
StatusPlanRouter.delete("/statusplan/:id", isAuthenticated,statusPlanController.delete)

export default StatusPlanRouter;
