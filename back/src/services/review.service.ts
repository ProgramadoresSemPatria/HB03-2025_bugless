import prisma from "../database/prisma";
import { CreateReviewSchema } from "../schemas/review.schema";

class ReviewService {
    async createReview(data: CreateReviewSchema) {
        const review = await prisma.review.create({
            data: {
                submission: { connect: { id: data.submissionId } },
                summary: data.summary,
                detectedIssues: data.detectedIssues,
                suggestedChanges: data.suggestedChanges
            }
        });

        if (!review) {
            return null;
        }

        return review;
    }
}

export default new ReviewService();
