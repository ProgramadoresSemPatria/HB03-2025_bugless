import type { ReviewAPI } from './api.js';
import type { ReviewResult, ReviewIssue, ReviewOptions, Severity, Category } from '../types/review.js';
import type { GitDiff } from '../types/git.js';

/**
 * Mock implementation of ReviewAPI
 * Generates realistic-looking review results for testing
 */
export class MockReviewAPI implements ReviewAPI {
  private delay = 1500; // Simulate network delay

  async submitReview(diff: GitDiff, options: ReviewOptions): Promise<ReviewResult> {
    // Simulate network delay
    await this.simulateDelay();

    const issues = this.generateMockIssues(diff, options);
    const summary = this.generateSummary(issues, diff);

    return {
      issues,
      summary,
      reviewedFiles: diff.files.map(f => f.path),
      timestamp: new Date(),
    };
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async getStatus(): Promise<{ healthy: boolean; message: string }> {
    return {
      healthy: true,
      message: 'Mock API is running',
    };
  }

  private async simulateDelay(): Promise<void> {
    // Add some randomness to simulate real network
    const actualDelay = this.delay + Math.random() * 500;
    await new Promise(resolve => setTimeout(resolve, actualDelay));
  }

  private generateMockIssues(diff: GitDiff, options: ReviewOptions): ReviewIssue[] {
    const issues: ReviewIssue[] = [];
    let issueId = 1;

    for (const file of diff.files) {
      // Skip binary files
      if (file.binary) continue;

      // Generate issues based on file content and preset
      const fileIssues = this.analyzeFile(file, options, issueId);
      issues.push(...fileIssues);
      issueId += fileIssues.length;
    }

    return issues;
  }

  private analyzeFile(
    file: { path: string; additions: number; deletions: number; content: string },
    options: ReviewOptions,
    startId: number
  ): ReviewIssue[] {
    const issues: ReviewIssue[] = [];
    const content = file.content.toLowerCase();
    let currentId = startId;

    // Common patterns to detect (simplified mock detection)
    const patterns: Array<{
      pattern: RegExp | string;
      severity: Severity;
      category: Category;
      title: string;
      description: string;
      suggestion: string;
      presets: string[];
    }> = [
      {
        pattern: /console\.log/,
        severity: 'warning',
        category: 'maintainability',
        title: 'Console.log statement found',
        description: 'Debug console.log statements should be removed before committing.',
        suggestion: 'Remove console.log or use a proper logging library.',
        presets: ['standard', 'thorough'],
      },
      {
        pattern: /any/,
        severity: 'warning',
        category: 'maintainability',
        title: 'TypeScript "any" type usage',
        description: 'Using "any" type defeats the purpose of TypeScript type checking.',
        suggestion: 'Replace "any" with a proper type definition.',
        presets: ['standard', 'thorough'],
      },
      {
        pattern: /password|secret|api_key|apikey/,
        severity: 'critical',
        category: 'security',
        title: 'Potential sensitive data exposure',
        description: 'Code contains references to sensitive data that might be exposed.',
        suggestion: 'Ensure sensitive data is properly secured and not hardcoded.',
        presets: ['standard', 'security', 'thorough'],
      },
      {
        pattern: /todo|fixme|hack/,
        severity: 'info',
        category: 'maintainability',
        title: 'TODO/FIXME comment found',
        description: 'There are pending tasks or workarounds in the code.',
        suggestion: 'Address the TODO or create a tracking issue.',
        presets: ['thorough'],
      },
      {
        pattern: /eval\s*\(/,
        severity: 'critical',
        category: 'security',
        title: 'Use of eval() detected',
        description: 'eval() is dangerous and can lead to code injection vulnerabilities.',
        suggestion: 'Avoid using eval(). Use safer alternatives.',
        presets: ['standard', 'security', 'thorough'],
      },
      {
        pattern: /innerhtml\s*=/,
        severity: 'warning',
        category: 'security',
        title: 'Potential XSS vulnerability',
        description: 'Direct innerHTML assignment can lead to XSS attacks.',
        suggestion: 'Use textContent or sanitize HTML before insertion.',
        presets: ['standard', 'security', 'thorough'],
      },
      {
        pattern: /\+\s*['"`]/,
        severity: 'suggestion',
        category: 'maintainability',
        title: 'String concatenation detected',
        description: 'String concatenation can be harder to read than template literals.',
        suggestion: 'Consider using template literals for better readability.',
        presets: ['thorough'],
      },
      {
        pattern: /new\s+promise/i,
        severity: 'info',
        category: 'performance',
        title: 'Manual Promise construction',
        description: 'Creating new Promises manually might indicate callback-based code.',
        suggestion: 'Consider using async/await for cleaner async code.',
        presets: ['performance', 'thorough'],
      },
    ];

    for (const { pattern, severity, category, title, description, suggestion, presets } of patterns) {
      // Check if this pattern applies to the current preset
      if (!presets.includes(options.preset)) continue;

      const regex = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
      if (regex.test(content)) {
        // Find approximate line number
        const lines = file.content.split('\n');
        let lineNumber = 1;
        for (let i = 0; i < lines.length; i++) {
          if (regex.test(lines[i].toLowerCase())) {
            lineNumber = i + 1;
            break;
          }
        }

        issues.push({
          id: `issue-${currentId++}`,
          severity,
          category,
          title,
          description,
          suggestion,
          file: file.path,
          line: lineNumber,
        });
      }
    }

    // Add some generic issues based on file size
    if (file.additions > 100) {
      issues.push({
        id: `issue-${currentId++}`,
        severity: 'suggestion',
        category: 'maintainability',
        title: 'Large file change',
        description: `This file has ${file.additions} additions. Consider breaking down large changes.`,
        suggestion: 'Split large changes into smaller, focused commits.',
        file: file.path,
      });
    }

    return issues;
  }

  private generateSummary(issues: ReviewIssue[], diff: GitDiff): ReviewResult['summary'] {
    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    const suggestionCount = issues.filter(i => i.severity === 'suggestion').length;
    const infoCount = issues.filter(i => i.severity === 'info').length;

    // Calculate score (100 - weighted issues)
    const score = Math.max(
      0,
      Math.min(
        100,
        100 - (criticalCount * 25) - (warningCount * 10) - (suggestionCount * 3) - (infoCount * 1)
      )
    );

    let summary: string;
    if (criticalCount > 0) {
      summary = `Found ${criticalCount} critical issue(s) that need immediate attention. Please address security and bug concerns before merging.`;
    } else if (warningCount > 0) {
      summary = `Code looks generally good with ${warningCount} warning(s) to consider. Review the suggestions to improve code quality.`;
    } else if (issues.length === 0) {
      summary = 'Great job! No significant issues found in this code review.';
    } else {
      summary = `Minor suggestions found. Overall the code quality is good.`;
    }

    return {
      totalIssues: issues.length,
      criticalCount,
      warningCount,
      suggestionCount,
      infoCount,
      overallScore: score,
      summary,
    };
  }
}

export const mockReviewAPI = new MockReviewAPI();
