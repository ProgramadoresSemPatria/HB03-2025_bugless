'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { authApi } from '@/lib/api'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { cn } from '@/lib/utils'

interface EmailRegisterFormProps {
  sessionId: string
  onSuccess: () => void
}

export function EmailRegisterForm({ sessionId, onSuccess }: EmailRegisterFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    const result = await authApi.register(data.name, data.email, data.password)

    if (result.success) {
      // After registration, log in automatically
      const loginResult = await authApi.cliLogin(data.email, data.password, sessionId)

      if (loginResult.success) {
        onSuccess()
      } else {
        setError('root', {
          message: 'Registration successful! Please sign in.',
        })
      }
    } else {
      setError('root', {
        message: result.message || 'Registration failed. Please try again.',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {errors.root && (
        <div
          className={cn(
            'rounded-md px-4 py-3 text-sm',
            errors.root.message?.includes('successful')
              ? 'bg-green-500/10 text-green-500'
              : 'bg-destructive/10 text-destructive'
          )}
        >
          {errors.root.message}
        </div>
      )}

      <div className='space-y-2 text-left'>
        <label
          htmlFor='name'
          className='text-sm font-medium text-foreground'
        >
          Name
        </label>
        <Input
          id='name'
          type='text'
          placeholder='Your name...'
          autoComplete='name'
          disabled={isSubmitting}
          className={cn('h-11', errors.name && 'border-destructive')}
          {...register('name')}
        />
        {errors.name && (
          <p className='text-sm text-destructive'>{errors.name.message}</p>
        )}
      </div>

      <div className='space-y-2 text-left'>
        <label
          htmlFor='register-email'
          className='text-sm font-medium text-foreground'
        >
          Email
        </label>
        <Input
          id='register-email'
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
          htmlFor='register-password'
          className='text-sm font-medium text-foreground'
        >
          Password
        </label>
        <Input
          id='register-password'
          type='password'
          placeholder='Min. 8 characters...'
          autoComplete='new-password'
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
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  )
}
