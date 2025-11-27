import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  userId: z.string(),
  repositoryUrl: z.string().optional(),
  repositoryPath: z.string().optional(),
  language: z.string().optional(),
  customInstructions: z.string().optional(),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
