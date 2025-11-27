import { Router } from "express";
import statusSubmissionController from "../controllers/status-submission.controller";

const statusSubmissionRouter = Router();

statusSubmissionRouter.post("/", statusSubmissionController.createStatusSubmission);
statusSubmissionRouter.get("/", statusSubmissionController.getAllStatusSubmissions);
statusSubmissionRouter.get("/:id", statusSubmissionController.getStatusSubmissionById);
statusSubmissionRouter.put("/:id", statusSubmissionController.updateStatusSubmission);
statusSubmissionRouter.delete("/:id", statusSubmissionController.deleteStatusSubmission);

export default statusSubmissionRouter;