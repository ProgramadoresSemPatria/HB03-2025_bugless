import type { DiffFile, GitDiff } from '../types/git.js';

export function filterDiffFiles(
  files: DiffFile[],
  excludePatterns: string[]
): DiffFile[] {
  return files.filter(file => {
    return !excludePatterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
        return regex.test(file.path);
      }
      return file.path.includes(pattern);
    });
  });
}

export function getDiffStats(files: DiffFile[]): {
  totalAdditions: number;
  totalDeletions: number;
  fileCount: number;
} {
  return files.reduce(
    (acc, file) => ({
      totalAdditions: acc.totalAdditions + file.additions,
      totalDeletions: acc.totalDeletions + file.deletions,
      fileCount: acc.fileCount + 1,
    }),
    { totalAdditions: 0, totalDeletions: 0, fileCount: 0 }
  );
}

export function groupFilesByDirectory(files: DiffFile[]): Record<string, DiffFile[]> {
  const groups: Record<string, DiffFile[]> = {};

  for (const file of files) {
    const parts = file.path.split('/');
    const dir = parts.length > 1 ? parts.slice(0, -1).join('/') : '.';

    if (!groups[dir]) {
      groups[dir] = [];
    }
    groups[dir].push(file);
  }

  return groups;
}

export function isLargeChange(diff: GitDiff, threshold = 500): boolean {
  const stats = getDiffStats(diff.files);
  return stats.totalAdditions + stats.totalDeletions > threshold;
}
