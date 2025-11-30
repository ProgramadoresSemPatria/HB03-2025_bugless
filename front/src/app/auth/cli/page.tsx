'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { GithubLogoIcon, GoogleLogoIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

function LoginForm() {
  const params = useSearchParams()
  const sessionId = params.get('sid')
  const [isLoading, setIsLoading] = useState<'github' | 'google' | null>(null)

  const handleLogin = async (provider: 'github' | 'google') => {
    setIsLoading(provider)

    // ============================================
    // MOCK - Replace when OAuth is implemented
    // ============================================

    // TODO: When OAuth is ready:
    // window.location.href = `/api/auth/${provider}?sid=${sessionId}`

    // MOCK: Simulates delay and redirects to success
    await new Promise((r) => setTimeout(r, 1500))
    window.location.href = `/auth/success?sid=${sessionId}`
  }

  return (
    <>
      {/* Login Buttons */}
      <div className='space-y-3'>
        <button
          onClick={() => handleLogin('github')}
          disabled={isLoading !== null}
          className={cn(
            'flex w-full items-center justify-center gap-3',
            'rounded-lg bg-[#24292e] px-4 py-3 text-white',
            'transition-colors hover:bg-[#2f363d]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
          )}
        >
          <GithubLogoIcon weight='fill' className='size-5' />
          {isLoading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
        </button>

        <button
          onClick={() => handleLogin('google')}
          disabled={isLoading !== null}
          className={cn(
            'flex w-full items-center justify-center gap-3',
            'rounded-lg border border-border bg-surface px-4 py-3 text-foreground',
            'transition-colors hover:bg-surface-hover',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
          )}
        >
          <GoogleLogoIcon weight='bold' className='size-5' />
          {isLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
        </button>
      </div>

      {/* Session ID indicator (for debugging) */}
      {sessionId && (
        <p className='mt-6 text-xs text-text-muted'>
          Session: {sessionId.slice(0, 8)}...
        </p>
      )}
    </>
  )
}

function LoginFormFallback() {
  return (
    <div className='space-y-3'>
      <div className='h-12 animate-pulse rounded-lg bg-surface' />
      <div className='h-12 animate-pulse rounded-lg bg-surface' />
    </div>
  )
}

export default function CLILoginPage() {
  return (
    <div className='w-full max-w-md text-center'>
      {/* Logo */}
      <h1 className='mb-2 text-3xl font-headline text-foreground'>BugLess</h1>

      {/* Title */}
      <h2 className='mb-2 text-xl text-foreground'>Login to CLI</h2>
      <p className='mb-8 text-text-secondary'>
        Choose a provider to authenticate
      </p>

      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
