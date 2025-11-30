import { CheckCircleIcon } from '@phosphor-icons/react/dist/ssr'

export default function AuthSuccessPage() {
  return (
    <div className='text-center'>
      <CheckCircleIcon
        weight='fill'
        className='mx-auto mb-4 size-16 text-success'
      />
      <h1 className='mb-2 text-2xl font-headline text-foreground'>
        You're all set!
      </h1>
      <p className='text-text-secondary'>
        You can close this window and return to your terminal.
      </p>
    </div>
  )
}
