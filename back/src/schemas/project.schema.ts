import { z } from "zod";
import { ulidRule } from "./common.schema";

const projectBaseSchema = z.object({
  name: z.string().min(1, "Nome do projeto é obrigatório"),
  description: z.string().optional(),
  repositoryUrl: z.url().optional(),
  repositoryPath: z.string().optional(),
  language: z.string().optional(),
  customInstructions: z.string().optional(),
});

export const createProjectSchema = projectBaseSchema.extend({
  userId: ulidRule,
});

export const updateProjectSchema = projectBaseSchema.partial();

export const projectIdSchema = z.object({
  id: ulidRule
});

export const findOrCreateProjectSchema = z.object({
  userId: ulidRule,
  repositoryUrl: z.string().min(1, "Repository URL is required"),
  name: z.string().min(1, "Project name is required"),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
export type ProjectIdSchema = z.infer<typeof projectIdSchema>;
export type FindOrCreateProjectSchema = z.infer<typeof findOrCreateProjectSchema>;
