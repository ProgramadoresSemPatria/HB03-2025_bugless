import { z } from "zod";
import { ulidRule } from "./common.schema";

export const statusSubmissionSchema = z.object({
    name: z.string().min(1),
});

export type StatusSubmissionSchema = z.infer<typeof statusSubmissionSchema>;
export const getByIdStatusSubmissionSchema = z.object({
    id: ulidRule,
});

export type GetByIdStatusSubmissionSchema = z.infer<typeof getByIdStatusSubmissionSchema>;
