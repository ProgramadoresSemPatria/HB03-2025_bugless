import { z } from "zod";
import { ulidRule } from "./common.schema";
import { StatusSubmissionEnum } from "../generated/prisma/enums";

export const statusSubmissionSchema = z.object({
    name: z.enum(StatusSubmissionEnum).default(StatusSubmissionEnum.PENDING),
});

export type StatusSubmissionSchema = z.infer<typeof statusSubmissionSchema>;
export const getByIdStatusSubmissionSchema = z.object({
    id: ulidRule,
});

export type GetByIdStatusSubmissionSchema = z.infer<typeof getByIdStatusSubmissionSchema>;
