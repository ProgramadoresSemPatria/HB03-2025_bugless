import { Router } from "express";
import SubmissionController from "../controllers/submission.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.";

const SubmissionRouter = Router();

SubmissionRouter.post("/register", isAuthenticated,SubmissionController.create);
SubmissionRouter.patch("/submission/:id", isAuthenticated,SubmissionController.update);
SubmissionRouter.get("/getAllSubmission", isAuthenticated,SubmissionController.getAllSubmission)
SubmissionRouter.delete("/submission/:id", isAuthenticated,SubmissionController.delete);

export default SubmissionRouter;
