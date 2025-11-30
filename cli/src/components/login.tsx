import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { Spinner } from '@inkjs/ui';
import { login, isLoggedIn, getUser } from '../services/auth.js';
import type { User } from '../types/auth.js';

const AMBER = '#ff6b35';

type LoginState = 'checking' | 'opening' | 'polling' | 'success' | 'error' | 'already-logged';

interface LoginProps {
  onSuccess: () => void;
}

export function Login({ onSuccess }: LoginProps) {
  const [state, setState] = useState<LoginState>('checking');
  const [loginUrl, setLoginUrl] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Check if already logged in
    if (isLoggedIn()) {
      const existingUser = getUser();
      if (existingUser) {
        setUser(existingUser);
        setState('already-logged');
        setTimeout(onSuccess, 1500);
        return;
      }
    }

    // Start login flow
    login({
      onOpening: (url) => {
        setLoginUrl(url);
        setState('opening');
      },
      onPolling: () => {
        setState('polling');
      },
      onSuccess: (loggedUser) => {
        setUser(loggedUser);
        setState('success');
        setTimeout(onSuccess, 1500);
      },
      onError: (error) => {
        setErrorMessage(error.message);
        setState('error');
      },
    });
  }, [onSuccess]);

  if (state === 'checking') {
    return (
      <Box flexDirection="column" paddingY={1}>
        <Spinner label="Checking authentication..." />
      </Box>
    );
  }

  if (state === 'already-logged') {
    return (
      <Box flexDirection="column" paddingY={1}>
        <Text color="green">
          {' '}Already logged in as{' '}
          <Text bold color={AMBER}>
            {user?.email}
          </Text>
        </Text>
      </Box>
    );
  }

  if (state === 'error') {
    return (
      <Box flexDirection="column" paddingY={1}>
        <Text color="red"> Login failed: {errorMessage}</Text>
      </Box>
    );
  }

  if (state === 'success') {
    return (
      <Box flexDirection="column" paddingY={1}>
        <Text color="green">
          {' '}Logged in as{' '}
          <Text bold color={AMBER}>
            {user?.email}
          </Text>
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingY={1}>
      <Text bold color={AMBER}>
        {' '}Login to BugLess
      </Text>
      <Box height={1} />

      <Text>
        {'  '}Opening browser for authentication...
      </Text>
      <Text dimColor>{'  '}{loginUrl}</Text>
      <Box height={1} />

      {state === 'polling' && (
        <Box>
          <Text>{'  '}</Text>
          <Spinner label="Waiting for login in browser..." />
        </Box>
      )}
    </Box>
  );
}
