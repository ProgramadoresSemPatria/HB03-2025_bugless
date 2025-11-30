import { Router } from "express";
import submissionController from "../controllers/submission.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const submissionRouter = Router();

submissionRouter.post("/", authMiddleware, submissionController.createSubmission);
submissionRouter.get("/:id", authMiddleware, submissionController.getSubmissionById);
submissionRouter.get("/:id/events", authMiddleware, submissionController.getSubmissionEvents);

export default submissionRouter;
