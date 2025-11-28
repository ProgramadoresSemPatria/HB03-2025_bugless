import chalk from 'chalk';
import type { Severity } from '../types/review.js';

export function formatSeverity(severity: Severity): string {
  const formats: Record<Severity, (s: string) => string> = {
    critical: chalk.red.bold,
    warning: chalk.yellow,
    suggestion: chalk.blue,
    info: chalk.gray,
  };
  return formats[severity](severity.toUpperCase());
}

export function formatScore(score: number): string {
  if (score >= 80) return chalk.green.bold(`${score}/100`);
  if (score >= 60) return chalk.yellow(`${score}/100`);
  return chalk.red.bold(`${score}/100`);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length - 3) + '...';
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || `${singular}s`);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}
