import { Button } from '@/components/ui/button'
import { GithubLogoIcon } from '@phosphor-icons/react/dist/ssr'

export function GithubAppButton() {
  return (
    <Button asChild variant='outline' size='lg' className='mt-3 bg-surface'>
      <a
        href='https://github.com/apps/bugless-code-review'
        target='_blank'
        rel='noopener noreferrer'
      >
        <GithubLogoIcon size={20} weight='bold' />
        Install GitHub App
      </a>
    </Button>
  )
}
