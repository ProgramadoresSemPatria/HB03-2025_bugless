import type { ReviewResult, ReviewOptions } from '../types/review.js';
import type { GitDiff } from '../types/git.js';
import { MockReviewAPI } from './mock-api.js';

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
 * Factory function to get the appropriate API implementation
 */
export function createReviewAPI(useMock = true): ReviewAPI {
  if (useMock) {
    return new MockReviewAPI();
  }

  // Future: Return real API client
  throw new Error('Real API client not implemented yet');
}
