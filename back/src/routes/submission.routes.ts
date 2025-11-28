import { Router } from "express";
import submissionController from "../controllers/submission.controller";

const submissionRouter = Router();

submissionRouter.post("/", submissionController.createSubmission);
submissionRouter.get("/:id", submissionController.getSubmissionById);

export default submissionRouter;