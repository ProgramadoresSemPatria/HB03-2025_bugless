import { configService } from './config.js';
import { authService } from './auth.js';
import { gitService } from './git.js';

interface ProjectResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    repositoryUrl?: string;
    userId: string;
  };
}

/**
 * Extract repository name from a git remote URL
 */
function extractRepoName(repoUrl: string): string {
  // Handle various URL formats:
  // https://github.com/user/repo.git
  // git@github.com:user/repo.git
  // https://github.com/user/repo

  const patterns = [
    /\/([^/]+?)(?:\.git)?$/,           // https URL
    /:([^/]+\/[^/]+?)(?:\.git)?$/,     // SSH URL
  ];

  for (const pattern of patterns) {
    const match = repoUrl.match(pattern);
    if (match) {
      // Get just the repo name (last part after /)
      const fullPath = match[1];
      const parts = fullPath.split('/');
      return parts[parts.length - 1] || fullPath;
    }
  }

  // Fallback: return last segment
  const parts = repoUrl.split('/');
  return parts[parts.length - 1]?.replace('.git', '') || 'unknown-project';
}

/**
 * Get or create a project for the current git repository.
 * Uses the remote URL to identify the project.
 */
export async function getOrCreateProject(): Promise<string> {
  const token = authService.getToken();
  const user = authService.getUser();
  const apiUrl = configService.getApiUrl() || 'http://localhost:3000';

  if (!token || !user) {
    throw new Error('Not authenticated. Please run bugless login first.');
  }

  const repoUrl = await gitService.getRemoteUrl();

  if (!repoUrl) {
    throw new Error('Could not determine git remote URL. Make sure you are in a git repository with a remote configured.');
  }

  const repoName = extractRepoName(repoUrl);

  const response = await fetch(`${apiUrl}/projects/find-or-create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: user.id,
      repositoryUrl: repoUrl,
      name: repoName,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get/create project: ${response.status} ${errorText}`);
  }

  const data = await response.json() as ProjectResponse;

  if (!data.success || !data.data) {
    throw new Error(data.message || 'Failed to get/create project');
  }

  return data.data.id;
}

export const projectService = {
  getOrCreateProject,
  extractRepoName,
};
