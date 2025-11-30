import { XCircleIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className='text-center'>
      <XCircleIcon weight='fill' className='mx-auto mb-4 size-16 text-error' />
      <h1 className='mb-2 text-2xl font-headline text-foreground'>
        Authentication Failed
      </h1>
      <p className='mb-6 text-text-secondary'>
        Something went wrong. Please try again.
      </p>
      <Link
        href='/auth/device'
        className='inline-block rounded-lg bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary-hover'
      >
        Try again
      </Link>
    </div>
  )
}
