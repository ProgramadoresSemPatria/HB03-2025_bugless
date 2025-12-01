import { Request, response, Response } from "express";
import reviewService from "../services/review.service";
import projectService from "../services/project.service";

class ReviewController {
    async create(req: Request, res: Response) {
        const {summary, 
        detectedIssues, 
        suggestedChanges, 
        submissionId } = req.body;

        const review = await reviewService.createReview({
            summary, 
        detectedIssues, 
        suggestedChanges, 
        submissionId 
        });
        return res.json(review);
    }

    async getAllReview(req: Request, res: Response){
        const review = await reviewService.getAllReview();
        res.status(200).json(review)
    }

    async update(req: Request, res: Response){
        const id = req.params.id as string;
         const {summary, 
        detectedIssues, 
        suggestedChanges, 
        submissionId } = req.body;

        const review = await reviewService.updateReview({
            id,
            summary, 
            detectedIssues, 
            suggestedChanges, 
        });
        return res.json(review);
    }

    async delete(req: Request, res: Response){
        const id = req.params.id as string;
        const msg = await projectService.deleteProject(id);

        return res.json(msg);
    }
}

export default new ReviewController();