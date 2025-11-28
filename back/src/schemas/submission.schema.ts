import { z } from "zod";
import { ulidRule } from "./common.schema";

export enum SubmissionMode {
    PR_DIFF = "PR_DIFF",
    UNCOMMITTED = "UNCOMMITTED",
    COMMIT = "COMMIT",
    CUSTOM = "CUSTOM",
}

export const submissionIdRule = ulidRule;

export type SubmissionIdRule = z.infer<typeof submissionIdRule>;

export const createSubmissionSchema = z.object({
    userId: ulidRule, 
    projectId: ulidRule,
    codeContent: z.string().min(1),
    submissionMode: z.enum(SubmissionMode).optional().default(SubmissionMode.UNCOMMITTED),
});

export type CreateSubmissionSchema = z.infer<typeof createSubmissionSchema>;

export const getByIdSubmissionSchema = z.object({
    id: submissionIdRule,
});

export type GetByIdSubmissionSchema = z.infer<typeof getByIdSubmissionSchema>;