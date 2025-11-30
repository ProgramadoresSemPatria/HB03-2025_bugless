import { simpleGit, SimpleGit, StatusResult, DiffResultTextFile, DiffResultBinaryFile } from 'simple-git';
import type { GitStatus, GitDiff, DiffFile, GitBranch, GitCommit } from '../types/git.js';

type DiffFileEntry = DiffResultTextFile | DiffResultBinaryFile;

export class GitService {
  private git: SimpleGit;

  constructor(basePath?: string) {
    this.git = simpleGit(basePath);
  }

  async isGitRepo(): Promise<boolean> {
    try {
      await this.git.status();
      return true;
    } catch {
      return false;
    }
  }

  async getStatus(): Promise<GitStatus> {
    const status: StatusResult = await this.git.status();
    return {
      staged: status.staged,
      unstaged: status.modified,
      untracked: status.not_added,
      current: status.current,
      tracking: status.tracking,
    };
  }

  async getBranches(): Promise<GitBranch[]> {
    const branches = await this.git.branch();
    return Object.entries(branches.branches).map(([name, data]) => ({
      name: name.replace('remotes/origin/', ''),
      current: data.current,
      tracking: data.label,
    }));
  }

  async getLocalBranches(): Promise<GitBranch[]> {
    const branches = await this.git.branchLocal();
    return Object.entries(branches.branches).map(([name, data]) => ({
      name,
      current: data.current,
    }));
  }

  async getCurrentBranch(): Promise<string> {
    const status = await this.git.status();
    return status.current || 'HEAD';
  }

  async getRemoteUrl(): Promise<string | null> {
    try {
      const remotes = await this.git.getRemotes(true);
      const origin = remotes.find(r => r.name === 'origin');
      return origin?.refs?.fetch || origin?.refs?.push || null;
    } catch {
      return null;
    }
  }

  async getRecentCommits(count = 10): Promise<GitCommit[]> {
    const log = await this.git.log({ maxCount: count });
    return log.all.map(commit => ({
      hash: commit.hash,
      shortHash: commit.hash.substring(0, 7),
      message: commit.message,
      author: commit.author_name,
      date: new Date(commit.date),
      relativeDate: this.getRelativeTime(new Date(commit.date)),
    }));
  }

  async getDiffAgainstBranch(baseBranch: string): Promise<GitDiff> {
    const diffOutput = await this.git.diff([`${baseBranch}...HEAD`]);
    const diffSummary = await this.git.diffSummary([`${baseBranch}...HEAD`]);

    return this.parseDiff(diffOutput, diffSummary.files as DiffFileEntry[]);
  }

  async getUncommittedDiff(options: { staged?: boolean; unstaged?: boolean } = { staged: true, unstaged: true }): Promise<GitDiff> {
    const diffs: string[] = [];
    let files: DiffFileEntry[] = [];

    if (options.staged) {
      const stagedDiff = await this.git.diff(['--cached']);
      const stagedSummary = await this.git.diffSummary(['--cached']);
      diffs.push(stagedDiff);
      files = [...files, ...(stagedSummary.files as DiffFileEntry[])];
    }

    if (options.unstaged) {
      const unstagedDiff = await this.git.diff();
      const unstagedSummary = await this.git.diffSummary();
      diffs.push(unstagedDiff);
      files = [...files, ...(unstagedSummary.files as DiffFileEntry[])];
    }

    const raw = diffs.join('\n');
    const deduped = this.deduplicateFiles(files);
    const parsedFiles = deduped.map(file => ({
      path: file.file,
      additions: 'insertions' in file ? file.insertions : 0,
      deletions: 'deletions' in file ? file.deletions : 0,
      content: this.extractFileDiff(raw, file.file),
      binary: file.binary,
    }));

    return { files: parsedFiles, raw };
  }

  async getCommitDiff(sha: string): Promise<GitDiff> {
    const diffOutput = await this.git.show([sha, '--format=']);
    const diffSummary = await this.git.diffSummary([`${sha}^`, sha]);

    return this.parseDiff(diffOutput, diffSummary.files as DiffFileEntry[]);
  }

  async getCommitInfo(sha: string): Promise<GitCommit | null> {
    try {
      const log = await this.git.log({ from: sha, to: sha, maxCount: 1 });
      const commit = log.latest;
      if (!commit) return null;

      return {
        hash: commit.hash,
        shortHash: commit.hash.substring(0, 7),
        message: commit.message,
        author: commit.author_name,
        date: new Date(commit.date),
        relativeDate: this.getRelativeTime(new Date(commit.date)),
      };
    } catch {
      return null;
    }
  }

  private parseDiff(raw: string, files: DiffFileEntry[]): GitDiff {
    const parsedFiles: DiffFile[] = files.map(file => ({
      path: file.file,
      additions: 'insertions' in file ? file.insertions : 0,
      deletions: 'deletions' in file ? file.deletions : 0,
      content: this.extractFileDiff(raw, file.file),
      binary: file.binary,
    }));

    return { files: parsedFiles, raw };
  }

  private extractFileDiff(fullDiff: string, filePath: string): string {
    const escapedPath = filePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `diff --git a/${escapedPath}.*?(?=diff --git|$)`,
      'gs'
    );
    const matches = [...fullDiff.matchAll(regex)];
    return matches.map(m => m[0]).join('\n');
  }

  private deduplicateFiles(files: DiffFileEntry[]): DiffFileEntry[] {
    const seen = new Map<string, DiffFileEntry>();
    for (const file of files) {
      const existing = seen.get(file.file);
      if (existing && 'insertions' in existing && 'insertions' in file) {
        existing.insertions += file.insertions;
        existing.deletions += file.deletions;
      } else if (!existing) {
        seen.set(file.file, { ...file });
      }
    }
    return Array.from(seen.values());
  }

  private getRelativeTime(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return `${Math.floor(seconds / 604800)} weeks ago`;
  }
}

export const gitService = new GitService();
