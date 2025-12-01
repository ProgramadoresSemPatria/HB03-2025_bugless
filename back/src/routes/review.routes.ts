import { Router } from "express";
import reviewController from "../controllers/review.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.";

const ReviewRouter = Router();

ReviewRouter.post("/register", isAuthenticated, reviewController.create);
ReviewRouter.patch("/review/:id", isAuthenticated, reviewController.update);
ReviewRouter.get("/getAllReview", isAuthenticated, reviewController.getAllReview);
ReviewRouter.delete("/review/:id", isAuthenticated, reviewController.delete);

export default ReviewRouter;
