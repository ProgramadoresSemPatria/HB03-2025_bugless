export type Severity = 'critical' | 'warning' | 'suggestion' | 'info';

export type Category = 'security' | 'performance' | 'maintainability' | 'bug' | 'style';

export interface ReviewIssue {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  file: string;
  line?: number;
  endLine?: number;
  suggestion?: string;
  category: Category;
}

export interface ReviewSummary {
  totalIssues: number;
  criticalCount: number;
  warningCount: number;
  suggestionCount: number;
  infoCount: number;
  overallScore: number; // 0-100
  summary: string;
}

export interface ReviewResult {
  issues: ReviewIssue[];
  summary: ReviewSummary;
  reviewedFiles: string[];
  timestamp: Date;
}

export type ReviewMode = 'branch' | 'uncommitted' | 'commit' | 'custom';

export type PresetName = 'standard' | 'security' | 'performance' | 'quick' | 'thorough';

export interface ReviewOptions {
  mode: ReviewMode;
  baseBranch?: string;
  commitSha?: string;
  customPrompt?: string;
  preset: PresetName;
  includeFiles?: string[];
  excludeFiles?: string[];
}
