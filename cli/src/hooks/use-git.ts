import { useState, useEffect, useCallback } from 'react';
import { gitService } from '../services/git.js';
import type { GitStatus, GitDiff, GitBranch, GitCommit } from '../types/git.js';

export interface UseGitReturn {
  isGitRepo: boolean | null;
  status: GitStatus | null;
  branches: GitBranch[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useGit(): UseGitReturn {
  const [isGitRepo, setIsGitRepo] = useState<boolean | null>(null);
  const [status, setStatus] = useState<GitStatus | null>(null);
  const [branches, setBranches] = useState<GitBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const isRepo = await gitService.isGitRepo();
      setIsGitRepo(isRepo);

      if (isRepo) {
        const [gitStatus, branchList] = await Promise.all([
          gitService.getStatus(),
          gitService.getLocalBranches(),
        ]);
        setStatus(gitStatus);
        setBranches(branchList);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Git error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    isGitRepo,
    status,
    branches,
    loading,
    error,
    refresh,
  };
}

export interface UseDiffReturn {
  diff: GitDiff | null;
  loading: boolean;
  error: string | null;
  loadDiff: () => Promise<void>;
}

export function useBranchDiff(baseBranch: string | null): UseDiffReturn {
  const [diff, setDiff] = useState<GitDiff | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDiff = useCallback(async () => {
    if (!baseBranch) return;

    setLoading(true);
    setError(null);

    try {
      const diffData = await gitService.getDiffAgainstBranch(baseBranch);
      setDiff(diffData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load diff');
    } finally {
      setLoading(false);
    }
  }, [baseBranch]);

  useEffect(() => {
    if (baseBranch) {
      loadDiff();
    }
  }, [baseBranch, loadDiff]);

  return { diff, loading, error, loadDiff };
}

export function useUncommittedDiff(): UseDiffReturn {
  const [diff, setDiff] = useState<GitDiff | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDiff = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const diffData = await gitService.getUncommittedDiff();
      setDiff(diffData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load diff');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDiff();
  }, [loadDiff]);

  return { diff, loading, error, loadDiff };
}

export function useCommitDiff(sha: string | null): UseDiffReturn {
  const [diff, setDiff] = useState<GitDiff | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDiff = useCallback(async () => {
    if (!sha) return;

    setLoading(true);
    setError(null);

    try {
      const diffData = await gitService.getCommitDiff(sha);
      setDiff(diffData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load commit diff');
    } finally {
      setLoading(false);
    }
  }, [sha]);

  useEffect(() => {
    if (sha) {
      loadDiff();
    }
  }, [sha, loadDiff]);

  return { diff, loading, error, loadDiff };
}
