import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import {
  CommitSelector,
  Loading,
  ReviewSummary,
  IssueList,
  ErrorMessage,
  NoChangesError,
  PresetInfo,
  CommandLog,
  useCommandExecution,
  ResultActions,
} from '../components/index.js';
import { useReview } from '../hooks/use-review.js';
import { useCommitDiff } from '../hooks/use-git.js';
import type { PresetName } from '../types/review.js';

interface CommitReviewProps {
  commitSha?: string;
  preset: PresetName;
  onBack: () => void;
}

type Step = 'selectCommit' | 'fetchingGit' | 'reviewing' | 'results';

const AMBER = '#ff6b35';

export function CommitReview({ commitSha: initialSha, preset, onBack }: CommitReviewProps) {
  const [step, setStep] = useState<Step>(initialSha ? 'fetchingGit' : 'selectCommit');
  const [selectedSha, setSelectedSha] = useState<string | null>(initialSha || null);
  const [commandsComplete, setCommandsComplete] = useState(false);
  const [gitCommands, setGitCommands] = useState<string[]>([]);

  const { diff, loading: diffLoading, error: diffError } = useCommitDiff(selectedSha);

  // Use command execution at parent level to preserve state across steps
  const { commands: executedCommands, isComplete: commandsAnimationComplete } = useCommandExecution(gitCommands);

  // Update commands when sha changes
  useEffect(() => {
    if (selectedSha && step === 'fetchingGit') {
      const shortSha = selectedSha.slice(0, 7);
      setGitCommands([
        `git show ${shortSha} --stat`,
        `git show ${shortSha} --format="%s%n%b"`,
        `git diff ${shortSha}^..${shortSha}`,
        `git log --oneline -5`,
      ]);
    }
  }, [selectedSha, step]);

  // Mark commands complete when animation finishes
  useEffect(() => {
    if (commandsAnimationComplete && gitCommands.length > 0) {
      setCommandsComplete(true);
    }
  }, [commandsAnimationComplete, gitCommands.length]);
  const { state: reviewState, result, error: reviewError, startReview } = useReview();

  // Handle back navigation
  useInput((input, key) => {
    if (key.escape || (input === 'q' && step !== 'reviewing')) {
      onBack();
    }
  });

  // Start review when BOTH diff is ready AND commands animation is complete
  useEffect(() => {
    if (diff && step === 'fetchingGit' && !diffLoading && commandsComplete) {
      if (diff.files.length === 0) {
        setStep('results');
        return;
      }
      setStep('reviewing');
      startReview(diff, { mode: 'commit', commitSha: selectedSha!, preset });
    }
  }, [diff, step, diffLoading, commandsComplete, selectedSha, preset, startReview]);

  // Update step when review completes
  useEffect(() => {
    if (reviewState === 'complete' || reviewState === 'error') {
      setStep('results');
    }
  }, [reviewState]);

  const handleCommitSelect = (sha: string) => {
    setSelectedSha(sha);
    setCommandsComplete(false);
    setGitCommands([]); // Reset commands for new animation
    setStep('fetchingGit');
  };

  // Select commit step
  if (step === 'selectCommit') {
    return (
      <Box flexDirection="column">
        <Text bold color={AMBER}>Commit Review</Text>
        <PresetInfo preset={preset} />
        <Box marginTop={1}>
          <CommitSelector onSelect={handleCommitSelect} />
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Press Esc to go back</Text>
        </Box>
      </Box>
    );
  }

  // Diff error
  if (diffError) {
    return (
      <Box flexDirection="column">
        <Text bold color={AMBER}>Commit Review</Text>
        <ErrorMessage
          message={diffError}
          suggestion="Check that the commit SHA is valid"
        />
        <Box marginTop={1}>
          <Text dimColor>Press Esc to go back</Text>
        </Box>
      </Box>
    );
  }

  // Review error
  if (reviewError) {
    return (
      <Box flexDirection="column">
        <Text bold color={AMBER}>Commit Review</Text>
        <ErrorMessage message={reviewError} />
        <Box marginTop={1}>
          <Text dimColor>Press Esc to go back</Text>
        </Box>
      </Box>
    );
  }

  // No changes
  if (commandsComplete && (!diff || diff.files.length === 0)) {
    return (
      <Box flexDirection="column">
        <Text bold color={AMBER}>Commit Review</Text>
        <Text dimColor>Commit: <Text color={AMBER}>{selectedSha?.slice(0, 7)}</Text></Text>
        <NoChangesError mode="commit" />
        <Box marginTop={1}>
          <Text dimColor>Press Esc to go back</Text>
        </Box>
      </Box>
    );
  }

  // Results step - show final results
  if (step === 'results' && result) {
    return (
      <Box flexDirection="column">
        <Text bold color={AMBER}>Commit Review - Results</Text>
        <Text dimColor>Commit: <Text color={AMBER}>{selectedSha?.slice(0, 7)}</Text></Text>

        {/* Keep command log visible in results */}
        {executedCommands.length > 0 && <CommandLog commands={executedCommands} />}

        <ReviewSummary summary={result.summary} reviewedFiles={result.reviewedFiles} />
        <IssueList issues={result.issues} />

        <ResultActions
          issues={result.issues}
          onNewReview={onBack}
        />
      </Box>
    );
  }

  // Fetching git data OR reviewing - keep command log visible
  return (
    <Box flexDirection="column">
      <Text bold color={AMBER}>Commit Review</Text>
      <Text dimColor>Commit: <Text color={AMBER}>{selectedSha?.slice(0, 7)}</Text></Text>

      {/* Command log using parent-level state */}
      {executedCommands.length > 0 && <CommandLog commands={executedCommands} />}

      {/* Show analyzing message after commands complete */}
      {commandsComplete && (step === 'reviewing' || reviewState === 'loading') && (
        <Box marginTop={1}>
          <Loading
            message="Analyzing commit..."
            details={`${diff?.files.length || 0} files to review`}
          />
        </Box>
      )}
    </Box>
  );
}
