import { Request, Response } from "express";
import { statusSubmissionSchema, getByIdStatusSubmissionSchema } from "../schemas/status-submission.schema";
import { ZodError, flattenError } from "zod";
import statusSubmissionService from "../services/status-submission.service";
import HttpHelper from "../utils/http-helper";

class StatusSubmissionController {

    async createStatusSubmission(req: Request, res: Response){
        try {
            const dataStatusSubmission = statusSubmissionSchema.parse(req.body);

            const statusSubmissionExists = await statusSubmissionService.checkIfStatusSubmissionExists(dataStatusSubmission);
            if (statusSubmissionExists) {
                return HttpHelper.conflict(res, "Status submission already exists");
            }

            const statusSubmission = await statusSubmissionService.createStatusSubmission(dataStatusSubmission);
            return HttpHelper.created(res, statusSubmission, "Status submission created successfully");
        } catch (error) {
            if (error instanceof ZodError) {
                return HttpHelper.badRequest(res, "Validation error", flattenError(error));
            }
            return res.status(500).json({ message: "Error creating status submission" });
        }
    }

    async getAllStatusSubmissions(req: Request, res: Response){
        try {
            const statusSubmissions = await statusSubmissionService.getAllStatusSubmissions();

            if (!statusSubmissions) {
                return res.status(404).json({ message: "Status submissions not found" });
            } 

            return HttpHelper.success(res, statusSubmissions, "Status submissions fetched successfully");
        } catch (error) {
            return HttpHelper.serverError(res);
        }
    }

    async getStatusSubmissionById(req: Request, res: Response){
        try {
                const dataId = getByIdStatusSubmissionSchema.parse(req.params);
                const statusSubmission = await statusSubmissionService.getStatusSubmissionById(dataId.id);

                if (!statusSubmission) {
                    return HttpHelper.notFound(res, "Status submission not found");
                }

                return HttpHelper.success(res, statusSubmission, "Status submission fetched successfully");
        } catch (error) {
                if (error instanceof ZodError) {
                    return HttpHelper.badRequest(res, "Validation error", flattenError(error));
                }
                return HttpHelper.serverError(res);
        }
    }

    async updateStatusSubmission(req: Request, res: Response){
        try {
            const dataId = getByIdStatusSubmissionSchema.parse(req.params);
            const dataStatusSubmission = statusSubmissionSchema.parse(req.body);
            const statusSubmission = await statusSubmissionService.updateStatusSubmission(dataId.id, dataStatusSubmission);
            return HttpHelper.success(res, statusSubmission, "Status submission updated successfully");
        } catch (error) {
            if (error instanceof ZodError) {
                return HttpHelper.badRequest(res, "Validation error", flattenError(error));
            }
            return HttpHelper.serverError(res);
        }
    }

    async deleteStatusSubmission(req: Request, res: Response){
        try {
            const dataId = getByIdStatusSubmissionSchema.parse(req.params);
            const statusSubmission = await statusSubmissionService.deleteStatusSubmission(dataId.id);

            if (!statusSubmission) {
                return HttpHelper.notFound(res, "Status submission not found");
            }

            return HttpHelper.success(res, statusSubmission, "Status submission deleted successfully");
        } catch (error) {
            if (error instanceof ZodError) {
                return HttpHelper.badRequest(res, "Validation error", flattenError(error));
            }
            return HttpHelper.serverError(res);
        }
    }
}

const statusSubmissionController = new StatusSubmissionController();

export default statusSubmissionController;