import React, { useState, useEffect } from 'react';
import { Box, Text, useApp } from 'ink';
import { Header, Menu, NotGitRepoError, Loading, Login } from './components/index.js';
import { BranchReview } from './modes/branch-review.js';
import { UncommittedReview } from './modes/uncommitted-review.js';
import { CommitReview } from './modes/commit-review.js';
import { CustomReview } from './modes/custom-review.js';
import { gitService } from './services/git.js';
import { configService } from './services/config.js';
import { isLoggedIn } from './services/auth.js';
import type { ReviewMode, PresetName } from './types/review.js';

export interface AppProps {
  mode?: ReviewMode | 'interactive';
  baseBranch?: string;
  commitSha?: string;
  preset?: PresetName;
  configAction?: {
    apiKey?: string;
    apiUrl?: string;
    show?: boolean;
  };
}

type AppState = 'checking' | 'not-git-repo' | 'auth' | 'menu' | 'review';

export function App({
  mode = 'interactive',
  baseBranch,
  commitSha,
  preset = 'standard',
  configAction,
}: AppProps) {
  const { exit } = useApp();
  const [appState, setAppState] = useState<AppState>('checking');
  const [selectedMode, setSelectedMode] = useState<ReviewMode | null>(
    mode !== 'interactive' ? mode : null
  );

  // Handle config commands
  useEffect(() => {
    if (configAction?.apiKey) {
      configService.setApiKey(configAction.apiKey);
      console.log('API key saved successfully');
      exit();
      return;
    }
    if (configAction?.apiUrl) {
      configService.setApiUrl(configAction.apiUrl);
      console.log('API URL saved successfully');
      exit();
      return;
    }
    if (configAction?.show) {
      console.log('Config path:', configService.path);
      console.log('Config:', JSON.stringify(configService.getAll(), null, 2));
      exit();
      return;
    }
  }, [configAction, exit]);

  // Initial git and auth check
  useEffect(() => {
    async function check() {
      const isGit = await gitService.isGitRepo();
      if (!isGit) {
        setAppState('not-git-repo');
        return;
      }

      // Check authentication
      if (!isLoggedIn()) {
        setAppState('auth');
        return;
      }

      if (mode === 'interactive') {
        setAppState('menu');
      } else {
        setAppState('review');
      }
    }
    check();
  }, [mode]);

  const handleLoginSuccess = () => {
    if (mode === 'interactive') {
      setAppState('menu');
    } else {
      setAppState('review');
    }
  };

  const handleModeSelect = (selected: ReviewMode) => {
    setSelectedMode(selected);
    setAppState('review');
  };

  const handleBack = () => {
    setSelectedMode(null);
    setAppState('menu');
  };

  // Checking state
  if (appState === 'checking') {
    return (
      <Box flexDirection="column" padding={1}>
        <Header />
        <Loading message="Checking environment..." />
      </Box>
    );
  }

  // Not a git repo
  if (appState === 'not-git-repo') {
    return (
      <Box flexDirection="column" padding={1}>
        <Header />
        <NotGitRepoError />
      </Box>
    );
  }

  // Auth state
  if (appState === 'auth') {
    return (
      <Box flexDirection="column" padding={1}>
        <Header />
        <Login onSuccess={handleLoginSuccess} />
      </Box>
    );
  }

  // Menu state
  if (appState === 'menu') {
    return (
      <Box flexDirection="column" padding={1}>
        <Header />
        <Menu onSelect={handleModeSelect} />
      </Box>
    );
  }

  // Review state
  const reviewMode = selectedMode || (mode as ReviewMode);
  const reviewProps = { preset, onBack: handleBack };

  return (
    <Box flexDirection="column" padding={1}>
      <Header />
      {reviewMode === 'branch' && (
        <BranchReview baseBranch={baseBranch} {...reviewProps} />
      )}
      {reviewMode === 'uncommitted' && (
        <UncommittedReview {...reviewProps} />
      )}
      {reviewMode === 'commit' && (
        <CommitReview commitSha={commitSha} {...reviewProps} />
      )}
      {reviewMode === 'custom' && (
        <CustomReview {...reviewProps} />
      )}
    </Box>
  );
}
