import { Request, Response } from "express";
import { createSubmissionSchema, submissionIdRule } from "../schemas/submission.schema";
import { ZodError, flattenError } from "zod";
import submissionService from "../services/submission.service";
import HttpHelper from "../utils/http-helper";

class SubmissionController {
    async createSubmission(req: Request, res: Response){
        try {

            const dataSubmission = createSubmissionSchema.parse(req.body);

            const submission = await submissionService.createSubmission(dataSubmission);

            if (!submission) {
                return HttpHelper.notFound(res, "Submission not found");
            }

            return HttpHelper.created(res, submission, "Submission created successfully");
        } catch (error) {
            if (error instanceof ZodError) {
                return HttpHelper.badRequest(res, "Validation error", flattenError(error));
            }
            return HttpHelper.serverError(res);
        }
    }


    async getSubmissionById(req: Request, res: Response){
        try {
            const submissionId = submissionIdRule.parse(req.params.id);

            const submission = await submissionService.getSubmissionById(submissionId);

            if (!submission) {
                return HttpHelper.notFound(res, "Submission not found");
            }

            return HttpHelper.success(res, submission, "Submission fetched successfully");
        } catch (error) {
            if (error instanceof ZodError) {
                return HttpHelper.badRequest(res, "Validation error", flattenError(error));
            }
            return HttpHelper.serverError(res);
        }
    }
}

export default new SubmissionController();