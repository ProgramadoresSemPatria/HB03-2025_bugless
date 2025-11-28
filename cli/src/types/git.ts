export interface GitStatus {
  staged: string[];
  unstaged: string[];
  untracked: string[];
  current: string | null;
  tracking: string | null;
}

export interface DiffFile {
  path: string;
  additions: number;
  deletions: number;
  content: string;
  binary: boolean;
}

export interface GitDiff {
  files: DiffFile[];
  raw: string;
}

export interface GitBranch {
  name: string;
  current: boolean;
  tracking?: string;
}

export interface GitCommit {
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  date: Date;
  relativeDate: string;
}
