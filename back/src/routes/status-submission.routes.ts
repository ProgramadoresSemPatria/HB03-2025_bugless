import { Router } from "express";
import statusSubmissionController from "../controllers/status-submission.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.";

const statusSubmissionRouter = Router();

statusSubmissionRouter.post("/register", isAuthenticated, statusSubmissionController.createStatusSubmission);
statusSubmissionRouter.get("/getall", isAuthenticated, statusSubmissionController.getAllStatusSubmissions);
statusSubmissionRouter.get("/:id", isAuthenticated, statusSubmissionController.getStatusSubmissionById);
statusSubmissionRouter.patch("/:id", isAuthenticated,statusSubmissionController.updateStatusSubmission);
statusSubmissionRouter.delete("/:id", isAuthenticated,statusSubmissionController.deleteStatusSubmission);

export default statusSubmissionRouter;