import prisma from "../database/prisma";

interface ReviewRequest {
    summary?: string; 
    detectedIssues?: string; 
    suggestedChanges?: string;
    submissionId: string; 
}

interface updateReviewRequest{
    id: string;
    summary?: string; 
    detectedIssues?: string; 
    suggestedChanges?: string;
}

class ReviewService {
    async createReview ({ 
        summary, 
        detectedIssues, 
        suggestedChanges, 
        submissionId 
    }: ReviewRequest){
        
        if(!submissionId){ 
            throw new Error("The Submission ID (submissionId) is required.");
        }

        const review = await prisma.review.create({
            data:{
                summary, 
                detectedIssues, 
                suggestedChanges,

                submissionId,
            }
        })  
        return review;
    }

    async getAllReview() {
    const review = await prisma.review.findMany({
        include: {
            submission: { 
                include: {
                    user: { 
                        select: {
                            id: true,
                            email: true,
                        }
                    },
                    project: true, 
                    statusSubmission: true,
                }
            }
        }
    });
    return review;
}
    async updateReview ({id, summary, 
            detectedIssues, 
            suggestedChanges}:updateReviewRequest){
            const review = await prisma.review.update({
                where: {id},
                data:{
                    summary, detectedIssues, suggestedChanges
                },
            });
            return review
    }

    async deleteReview (id: string){
        await prisma.review.delete({
            where: {id},
        });
        return {message: "Review sucessfully deleted!"}
    }
    
}

export default new ReviewService();
