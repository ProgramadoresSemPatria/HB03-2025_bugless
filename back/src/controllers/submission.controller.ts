import { Request, Response } from "express";
import submissionService from "../services/submission.service";

class SubmissionController {
    async create(req: Request, res: Response) {
        try {
            const { codeContent, userId, projectId, statusSubmissionId } = req.body;

            const submission = await submissionService.createSubmission({
                codeContent,
                userId,
                projectId,
                statusSubmissionId
            });

            return res.json(submission);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    async getAllSubmission(req: Request, res: Response) {
        try{
        const submission = await submissionService.getAllSubmission();
        res.status(200).json(submission);
        }catch(error: any){
            console.error("Error retrieving submission:", error);
            return res.status(500).json({error: "Faile to retrieve status submission."})

        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const { codeContent, statusSubmissionId } = req.body;

            const submission = await submissionService.updateSubmission({
                id,
                codeContent,
                statusSubmissionId
            });

            return res.json(submission);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = req.params.id as string;

            const msg = await submissionService.deleteSubmission(id);

            return res.json(msg);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }
}

export default new SubmissionController();
