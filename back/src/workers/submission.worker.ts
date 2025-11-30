import { Queue, Worker, Job } from "bullmq";
import prisma from "../database/prisma";
import { StatusSubmissionEnum } from "../generated/prisma/enums";
import { redisConnection } from "../config/redis.config";
import aiService from "../services/ai.service";
import submissionService from "../services/submission.service";
import { Submission } from "../generated/prisma/client";
import reviewService from "../services/review.service";
import notifyService, { EventType } from "../services/notify.service";

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
            console.log("\n========================================");
            console.log(`[Worker] 🔄 Processando submission: ${submissionId}`);
            console.log("========================================");

            const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
            if (!submission) throw new Error("Submission not found");

            const codeContentJson = JSON.stringify(submission.codeContent);

            const reviewData = await aiService.generateAnalysisStream(
                codeContentJson,
                submission.submissionMode,
                (chunk) => {
                    notifyService.notify(submissionId, {
                        type: EventType.PROCESSING,
                        data: { chunk }
                    });
                }
            );
            
            const newReview = await reviewService.createReview({
                submissionId: submission.id,
                summary: reviewData.summary,
                detectedIssues: reviewData.detectedIssues,
                suggestedChanges: reviewData.suggestedChanges
            });

            if (!newReview) throw new Error("Review not created");
            console.log(`[Worker] Review criado: ${newReview.id}`);

            await submissionService.updateSubmissionStatus(submission.id, StatusSubmissionEnum.COMPLETED);
            console.log(`[Worker] Notificando cliente via SSE...`);

            // notify the client that the review is completed
            notifyService.notify(submission.id, {
                type: EventType.REVIEW_COMPLETED,
                data: { review: newReview }
            }, true);

            console.log(`[Worker] Processo concluído!`);
            console.log("========================================\n");

        } catch (error) {
            console.error(`[Worker] Erro no processamento:`, error);
            await submissionService.updateSubmissionStatus(submissionId, StatusSubmissionEnum.FAILED);

            // notify the client that the review failed
            notifyService.notify(submissionId, {
                type: EventType.REVIEW_FAILED,
                data: { error: "An error occurred during review" }
            }, true);
        }
    }

    async processJob(submission: Submission) {
        await this.queue.add("analyze-code", { submission });
    }
}

export default new SubmissionWorker();
