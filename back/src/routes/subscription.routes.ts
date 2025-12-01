import { Router } from "express";
import subscriptionController from "../controllers/subscription.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.";
const SubscriptionRouter = Router();

SubscriptionRouter.post("/register", isAuthenticated,subscriptionController.create);
SubscriptionRouter.patch("/subscription/:id", isAuthenticated,subscriptionController.update);
SubscriptionRouter.get("/getAllSubscription", isAuthenticated, subscriptionController.getAllSubscription)
SubscriptionRouter.delete("/subscription/:id", isAuthenticated,subscriptionController.delete);

export default SubscriptionRouter;
