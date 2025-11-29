import { Request, Response } from "express";
import { createSubmissionSchema, submissionIdRule } from "../schemas/submission.schema";
import { ZodError, flattenError } from "zod";
import submissionService from "../services/submission.service";
import HttpHelper from "../utils/http-helper";
import notifyService, { EventType } from "../services/notify.service";
import { StatusSubmissionEnum } from "../generated/prisma/enums";

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

    async getSubmissionEvents(req: Request, res: Response) {
        try {
            const submissionId = submissionIdRule.parse(req.params.id);

            const submission = await submissionService.getSubmissionById(submissionId);
            
            // if the submission is completed, return JSON immediately
            if (submission && submission.statusSubmission === StatusSubmissionEnum.COMPLETED) {
                return HttpHelper.success(res, {
                    type: EventType.REVIEW_COMPLETED,
                    data: { review: submission.review }
                }, "Review already completed");
            }

            // if the submission is not completed, add the client to the queue
            notifyService.addClient(submissionId, res);
        } catch (error) {
            
            if (error instanceof ZodError) {
                res.status(400).json({ error: "Invalid submission ID" });
                return;
            }
            res.status(500).end();
        }
    }
}

export default new SubmissionController();
