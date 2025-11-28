import type { Issue } from '../types/review.js';

export interface ResolveResult {
  file: string;
  success: boolean;
  error?: string;
}

export async function resolveIssues(issues: Issue[]): Promise<ResolveResult[]> {
  // Auto-fix not yet supported - return error for all issues
  return issues.map(issue => ({
    file: issue.file,
    success: false,
    error: 'Auto-fix nao suportado ainda. Corrija manualmente.',
  }));
}
