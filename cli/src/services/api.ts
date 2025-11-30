import { EventSource } from 'eventsource';
import type { ReviewResult, ReviewOptions, ReviewIssue, ReviewMode, Severity, Category } from '../types/review.js';
import type { GitDiff } from '../types/git.js';
import { MockReviewAPI } from './mock-api.js';
import { authService } from './auth.js';
import { configService } from './config.js';
import { projectService } from './project.js';

/**
 * Interface for the Review API
 * This will be implemented by MockReviewAPI for now,
 * and later by a real API client when backend integration is ready
 */
export interface ReviewAPI {
  /**
   * Submit code diff for review
   */
  submitReview(diff: GitDiff, options: ReviewOptions): Promise<ReviewResult>;

  /**
   * Check if the API is available/configured
   */
  isAvailable(): Promise<boolean>;

  /**
   * Get API status/health
   */
  getStatus(): Promise<{ healthy: boolean; message: string }>;
}

/**
 * Map CLI review mode to backend submission mode
 */
function mapMode(mode: ReviewMode): string {
  const modeMap: Record<ReviewMode, string> = {
    'branch': 'PR_DIFF',
    'uncommitted': 'UNCOMMITTED',
    'commit': 'COMMIT',
    'custom': 'CUSTOM',
  };
  return modeMap[mode];
}

/**
 * Backend review response format
 */
interface BackendReview {
  id: string;
  summary: string | null;
  detectedIssues: string | null;
  suggestedChanges: string | null;
  createdAt: string;
}

/**
 * Backend submission response
 */
interface SubmissionResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    status: string;
  };
}

/**
 * Real API client that connects to the backend
 */
class RealReviewAPI implements ReviewAPI {
  private apiUrl: string;

  constructor() {
    this.apiUrl = configService.getApiUrl() || 'http://localhost:3000';
  }

  async submitReview(diff: GitDiff, options: ReviewOptions): Promise<ReviewResult> {
    const log = (msg: string) => process.stderr.write(`[CLI] ${msg}\n`);

    log('Iniciando submitReview...');
    const token = authService.getToken();
    const user = authService.getUser();

    if (!token || !user) {
      throw new Error('Not authenticated. Please run bugless login first.');
    }

    log('Buscando/criando projeto...');
    // Get or create project for this repository
    const projectId = await projectService.getOrCreateProject();
    log(`Projeto ID: ${projectId}`);

    log('Criando submission...');
    // Create submission
    const createResponse = await fetch(`${this.apiUrl}/submissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        projectId,
        codeContent: diff.raw,
        submissionMode: mapMode(options.mode),
        metadata: {
          preset: options.preset,
          baseBranch: options.baseBranch,
          commitSha: options.commitSha,
          customPrompt: options.customPrompt,
        },
      }),
    });

    log(`Response status: ${createResponse.status}`);

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`Failed to create submission: ${createResponse.status} ${errorText}`);
    }

    const submission = await createResponse.json() as SubmissionResponse;
    log(`Submission criada: ${submission.data?.id}`);

    if (!submission.success || !submission.data) {
      throw new Error(submission.message || 'Failed to create submission');
    }

    const submissionId = submission.data.id;
    log(`Iniciando SSE para submission: ${submissionId}`);

    // Wait for result via SSE
    return this.waitForResult(submissionId, token, diff);
  }

  private waitForResult(submissionId: string, token: string, diff: GitDiff): Promise<ReviewResult> {
    const log = (msg: string) => process.stderr.write(`[CLI SSE] ${msg}\n`);

    return new Promise((resolve, reject) => {
      const url = `${this.apiUrl}/submissions/${submissionId}/events`;
      log(`Conectando a: ${url}`);

      try {
        // EventSource with custom fetch that includes auth header
        const eventSource = new EventSource(url, {
          fetch: (input, init) => {
            log('Fetch chamado para SSE');
            return fetch(input, {
              ...init,
              headers: {
                ...init.headers,
                'Authorization': `Bearer ${token}`,
              },
            });
          },
        });

        log('EventSource criado');

        const timeout = setTimeout(() => {
          log('Timeout após 5 minutos');
          eventSource.close();
          reject(new Error('Review timed out after 5 minutes'));
        }, 5 * 60 * 1000);

        eventSource.onopen = () => {
          log('Conexão aberta');
        };

        eventSource.onmessage = (event) => {
          log(`Mensagem recebida: ${event.data.substring(0, 100)}`);
          try {
            const data = JSON.parse(event.data);
            log(`Tipo de evento: ${data.type}`);

            if (data.type === 'REVIEW_COMPLETED') {
              log('Review completo recebido!');
              clearTimeout(timeout);
              eventSource.close();
              // Backend sends { type, data: { review } }
              resolve(this.parseReviewResult(data.data.review, diff));
            }

            if (data.type === 'REVIEW_FAILED') {
              log(`Review falhou: ${data.data?.error}`);
              clearTimeout(timeout);
              eventSource.close();
              reject(new Error(data.data?.error || 'Review failed'));
            }

            // CONNECTED and PROCESSING events are ignored - just waiting
            if (data.type === 'CONNECTED') {
              log('Conectado ao servidor');
            }
          } catch (e) {
            log(`Erro ao parsear: ${e}`);
          }
        };

        eventSource.onerror = (error) => {
          log(`Erro na conexão: ${JSON.stringify(error)}`);
          clearTimeout(timeout);
          eventSource.close();
          reject(new Error('SSE connection failed. Check if backend is running.'));
        };
      } catch (e) {
        log(`Erro ao criar EventSource: ${e}`);
        reject(e);
      }
    });
  }

  private parseReviewResult(review: BackendReview, diff: GitDiff): ReviewResult {
    const issues = this.parseIssues(review.detectedIssues, review.suggestedChanges);
    const reviewedFiles = diff.files.map(f => f.path);

    return {
      issues,
      summary: {
        totalIssues: issues.length,
        criticalCount: issues.filter(i => i.severity === 'critical').length,
        warningCount: issues.filter(i => i.severity === 'warning').length,
        suggestionCount: issues.filter(i => i.severity === 'suggestion').length,
        infoCount: issues.filter(i => i.severity === 'info').length,
        overallScore: this.calculateScore(issues),
        summary: review.summary || 'No summary provided.',
      },
      reviewedFiles,
      timestamp: new Date(review.createdAt),
    };
  }

  private parseIssues(detectedIssues: string | null, suggestedChanges: string | null): ReviewIssue[] {
    const issues: ReviewIssue[] = [];

    if (!detectedIssues) {
      return issues;
    }

    // Parse detected issues line by line
    // Expected format: "- Issue description" or "* Issue description"
    const lines = detectedIssues.split('\n').filter(line => line.trim());

    for (const line of lines) {
      const trimmed = line.replace(/^[-*]\s*/, '').trim();
      if (!trimmed) continue;

      const issue = this.parseIssueLine(trimmed, issues.length);
      if (issue) {
        issues.push(issue);
      }
    }

    return issues;
  }

  private parseIssueLine(text: string, index: number): ReviewIssue | null {
    // Determine severity based on keywords
    const severity = this.inferSeverity(text);
    const category = this.inferCategory(text);

    return {
      id: `issue-${index + 1}`,
      severity,
      category,
      title: this.extractTitle(text),
      description: text,
      file: 'unknown',  // Backend doesn't provide specific file info yet
      suggestion: undefined,
    };
  }

  private inferSeverity(text: string): Severity {
    const lowerText = text.toLowerCase();

    const criticalKeywords = ['critical', 'security', 'vulnerability', 'injection', 'xss', 'sql', 'dangerous', 'unsafe'];
    const warningKeywords = ['warning', 'error', 'bug', 'issue', 'problem', 'missing', 'incorrect'];
    const infoKeywords = ['info', 'note', 'consider', 'optional'];

    if (criticalKeywords.some(kw => lowerText.includes(kw))) {
      return 'critical';
    }
    if (warningKeywords.some(kw => lowerText.includes(kw))) {
      return 'warning';
    }
    if (infoKeywords.some(kw => lowerText.includes(kw))) {
      return 'info';
    }

    return 'suggestion';
  }

  private inferCategory(text: string): Category {
    const lowerText = text.toLowerCase();

    if (/security|auth|password|token|credential|injection|xss|csrf/i.test(lowerText)) {
      return 'security';
    }
    if (/performance|slow|optimize|efficient|cache|memory|cpu/i.test(lowerText)) {
      return 'performance';
    }
    if (/bug|error|crash|fail|broken|wrong/i.test(lowerText)) {
      return 'bug';
    }
    if (/style|format|naming|convention|indent/i.test(lowerText)) {
      return 'style';
    }

    return 'maintainability';
  }

  private extractTitle(text: string): string {
    // Take first sentence or first 60 characters
    const firstSentence = text.split(/[.!?]/)[0];
    if (firstSentence && firstSentence.length <= 80) {
      return firstSentence.trim();
    }
    return text.substring(0, 60).trim() + '...';
  }

  private calculateScore(issues: ReviewIssue[]): number {
    let score = 100;

    for (const issue of issues) {
      switch (issue.severity) {
        case 'critical':
          score -= 25;
          break;
        case 'warning':
          score -= 10;
          break;
        case 'suggestion':
          score -= 3;
          break;
        case 'info':
          score -= 1;
          break;
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async getStatus(): Promise<{ healthy: boolean; message: string }> {
    try {
      const available = await this.isAvailable();
      return {
        healthy: available,
        message: available ? 'API is available' : 'API is not responding',
      };
    } catch (err) {
      return {
        healthy: false,
        message: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }
}

/**
 * Factory function to get the appropriate API implementation
 */
export function createReviewAPI(useMock = true): ReviewAPI {
  if (useMock) {
    return new MockReviewAPI();
  }

  return new RealReviewAPI();
}
