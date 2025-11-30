'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { EmailLoginForm } from './components/email-login-form'
import { EmailRegisterForm } from './components/email-register-form'

type AuthMode = 'login' | 'register'

function AuthContent() {
  const params = useSearchParams()
  const router = useRouter()
  const sessionId = params.get('sid')
  const [mode, setMode] = useState<AuthMode>('login')

  if (!sessionId) {
    return (
      <div className='text-center'>
        <h2 className='mb-2 text-xl text-foreground'>Invalid Session</h2>
        <p className='text-text-secondary'>
          Please start the login process from the CLI.
        </p>
      </div>
    )
  }

  const handleSuccess = () => {
    router.push(`/auth/success?sid=${sessionId}`)
  }

  return (
    <>
      <h2 className='mb-2 text-xl text-foreground'>
        {mode === 'login' ? 'Sign in to CLI' : 'Create Account'}
      </h2>
      <p className='mb-8 text-text-secondary'>
        {mode === 'login'
          ? 'Enter your credentials to authenticate'
          : 'Create an account to get started'}
      </p>

      {mode === 'login' ? (
        <EmailLoginForm sessionId={sessionId} onSuccess={handleSuccess} />
      ) : (
        <EmailRegisterForm sessionId={sessionId} onSuccess={handleSuccess} />
      )}

      {/* Toggle between login and register */}
      <p className='mt-6 text-sm text-text-secondary'>
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <button
              type='button'
              onClick={() => setMode('register')}
              className='text-primary hover:underline'
            >
              Create one
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type='button'
              onClick={() => setMode('login')}
              className='text-primary hover:underline'
            >
              Sign in
            </button>
          </>
        )}
      </p>

      {/* Session indicator */}
      <p className='mt-4 text-xs text-text-muted'>
        Session: {sessionId.slice(0, 8)}...
      </p>
    </>
  )
}

function AuthFallback() {
  return (
    <div className='space-y-4'>
      <div className='h-11 animate-pulse rounded-md bg-surface' />
      <div className='h-11 animate-pulse rounded-md bg-surface' />
      <div className='h-11 animate-pulse rounded-md bg-surface' />
    </div>
  )
}

export default function CLILoginPage() {
  return (
    <div className='w-full max-w-md text-center'>
      {/* Logo */}
      <h1 className='mb-2 text-3xl font-headline text-foreground'>BugLess</h1>

      <Suspense fallback={<AuthFallback />}>
        <AuthContent />
      </Suspense>
    </div>
  )
}
