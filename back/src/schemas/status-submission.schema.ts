import { z } from "zod";

export const statusSubmissionSchema = z.object({
    name: z.string().min(1),
});

export type StatusSubmissionSchema = z.infer<typeof statusSubmissionSchema>;


export const getByIdStatusSubmissionSchema = z.object({
    id: z.string().min(1),
});

export type GetByIdStatusSubmissionSchema = z.infer<typeof getByIdStatusSubmissionSchema>;