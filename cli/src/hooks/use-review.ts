import { useState, useCallback } from 'react';
import { createReviewAPI } from '../services/api.js';
import { configService } from '../services/config.js';
import type { ReviewResult, ReviewOptions } from '../types/review.js';
import type { GitDiff } from '../types/git.js';

export type ReviewState = 'idle' | 'loading' | 'complete' | 'error';

export interface UseReviewReturn {
  state: ReviewState;
  result: ReviewResult | null;
  error: string | null;
  startReview: (diff: GitDiff, options: ReviewOptions) => Promise<void>;
  reset: () => void;
}

export function useReview(): UseReviewReturn {
  const [state, setState] = useState<ReviewState>('idle');
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startReview = useCallback(async (diff: GitDiff, options: ReviewOptions) => {
    setState('loading');
    setResult(null);
    setError(null);

    if (diff.files.length === 0) {
      setError('No changes to review');
      setState('error');
      return;
    }

    try {
      const useMock = configService.isUsingMock();
      const api = createReviewAPI(useMock);

      const reviewResult = await api.submitReview(diff, options);
      setResult(reviewResult);
      setState('complete');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      setState('error');
    }
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setResult(null);
    setError(null);
  }, []);

  return {
    state,
    result,
    error,
    startReview,
    reset,
  };
}
