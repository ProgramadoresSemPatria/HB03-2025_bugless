import { z } from "zod";
import { submissionIdRule } from "./submission.schema";

export const createReviewSchema = z.object({
    submissionId: submissionIdRule,
    summary: z.string(),
    detectedIssues: z.string(),
    suggestedChanges: z.string(),
});

export type CreateReviewSchema = z.infer<typeof createReviewSchema>;

