'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { authApi } from '@/lib/api'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { cn } from '@/lib/utils'

interface EmailLoginFormProps {
  sessionId: string
  onSuccess: () => void
}

export function EmailLoginForm({ sessionId, onSuccess }: EmailLoginFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    const result = await authApi.cliLogin(data.email, data.password, sessionId)

    if (result.success) {
      onSuccess()
    } else {
      setError('root', {
        message: result.message || 'Login failed. Please try again.',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {errors.root && (
        <div
          className={cn(
            'rounded-md bg-destructive/10 px-4 py-3',
            'text-sm text-destructive'
          )}
        >
          {errors.root.message}
        </div>
      )}

      <div className='space-y-2 text-left'>
        <label
          htmlFor='email'
          className='text-sm font-medium text-foreground'
        >
          Email
        </label>
        <Input
          id='email'
          type='email'
          placeholder='you@example.com...'
          autoComplete='email'
          disabled={isSubmitting}
          className={cn('h-11', errors.email && 'border-destructive')}
          {...register('email')}
        />
        {errors.email && (
          <p className='text-sm text-destructive'>{errors.email.message}</p>
        )}
      </div>

      <div className='space-y-2 text-left'>
        <label
          htmlFor='password'
          className='text-sm font-medium text-foreground'
        >
          Password
        </label>
        <Input
          id='password'
          type='password'
          placeholder='Min. 8 characters...'
          autoComplete='current-password'
          disabled={isSubmitting}
          className={cn('h-11', errors.password && 'border-destructive')}
          {...register('password')}
        />
        {errors.password && (
          <p className='text-sm text-destructive'>{errors.password.message}</p>
        )}
      </div>

      <Button
        type='submit'
        className='h-11 w-full'
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing in...' : 'Sign in to CLI'}
      </Button>
    </form>
  )
}
