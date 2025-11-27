import fs from 'fs/promises';
import path from 'path';
import type { Issue } from '../types/review.js';

export interface ResolveResult {
  file: string;
  success: boolean;
  error?: string;
}

export async function resolveIssues(issues: Issue[]): Promise<ResolveResult[]> {
  const results: ResolveResult[] = [];

  for (const issue of issues) {
    if (!issue.suggestion) {
      results.push({ file: issue.file, success: false, error: 'No suggestion available' });
      continue;
    }

    try {
      const filePath = path.resolve(process.cwd(), issue.file);
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');

      if (issue.line && issue.line > 0) {
        // Replace the specific line with the suggestion
        lines[issue.line - 1] = issue.suggestion;
        await fs.writeFile(filePath, lines.join('\n'));
        results.push({ file: issue.file, success: true });
      } else {
        results.push({ file: issue.file, success: false, error: 'No line number specified' });
      }
    } catch (error) {
      results.push({ file: issue.file, success: false, error: String(error) });
    }
  }

  return results;
}
