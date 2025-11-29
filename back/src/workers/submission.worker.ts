import { Queue, Worker, Job } from "bullmq";
import prisma from "../database/prisma";
import { StatusSubmissionEnum } from "../generated/prisma/enums";
import { redisConnection } from "../config/redis.config";
import aiProvider from "../providers/ai.provider";
import submissionService from "../services/submission.service";
import { Submission } from "../generated/prisma/client";
import reviewService from "../services/review.service";

class SubmissionWorker {
    private queue: Queue;
    private worker: Worker;

    constructor() {
        this.queue = new Queue("submission", { connection: redisConnection });
        
        this.worker = new Worker("submission", this.process.bind(this), { 
            connection: redisConnection 
        });
    }

    async process(job: Job) {
        const submissionId = job.data.submission.id;

        try {
            console.log(`[Worker] Processing submission: ${submissionId}`);
            const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
            if (!submission) throw new Error("Submission not found");

            const reviewData = await aiProvider.analyzeCode(submission.codeContent);
            
            const newReview = await reviewService.createReview({
                ...reviewData,
                submissionId: submission.id
            });

            if (!newReview) throw new Error("Review not created");
            console.log(`[Worker] Review created: ${newReview.id}`);

            await submissionService.updateSubmissionStatus(submission.id, StatusSubmissionEnum.COMPLETED);

        } catch (error) {
            await submissionService.updateSubmissionStatus(submissionId, StatusSubmissionEnum.FAILED);
        }
    }

    async processJob(submission: Submission) {
        await this.queue.add("analyze-code", { submission });
    }
}

export default new SubmissionWorker();
