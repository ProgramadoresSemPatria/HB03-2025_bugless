import { z } from 'zod';

export const severitySchema = z.enum(['critical', 'warning', 'suggestion', 'info']);

export const categorySchema = z.enum(['security', 'performance', 'maintainability', 'bug', 'style']);

export const reviewIssueSchema = z.object({
  id: z.string(),
  severity: severitySchema,
  title: z.string(),
  description: z.string(),
  file: z.string(),
  line: z.number().optional(),
  endLine: z.number().optional(),
  suggestion: z.string().optional(),
  category: categorySchema,
});

export const reviewSummarySchema = z.object({
  totalIssues: z.number(),
  criticalCount: z.number(),
  warningCount: z.number(),
  suggestionCount: z.number(),
  infoCount: z.number(),
  overallScore: z.number().min(0).max(100),
  summary: z.string(),
});

export const reviewResultSchema = z.object({
  issues: z.array(reviewIssueSchema),
  summary: reviewSummarySchema,
  reviewedFiles: z.array(z.string()),
  timestamp: z.date(),
});

export type ReviewIssueSchema = z.infer<typeof reviewIssueSchema>;
export type ReviewSummarySchema = z.infer<typeof reviewSummarySchema>;
export type ReviewResultSchema = z.infer<typeof reviewResultSchema>;
