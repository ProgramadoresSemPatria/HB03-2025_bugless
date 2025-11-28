import { Logo } from '@/components/common/logo'
import { NAV_LINKS } from '@/lib/constants'
import { GithubLogoIcon } from '@phosphor-icons/react/dist/ssr'
import { Container } from './container'

export function Footer() {
  return (
    <footer className='border-t py-8'>
      <Container>
        <div className='relative flex flex-col items-center justify-between gap-4 md:flex-row'>
          <Logo />

          <nav className='flex items-center gap-6 text-sm text-text-secondary md:absolute md:left-1/2 md:-translate-x-1/2'>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className='transition-colors hover:text-foreground'
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className='flex items-center gap-4'>
            <a
              href='https://github.com/ProgramadoresSemPatria/HB03-2025_bugless'
              target='_blank'
              rel='noopener noreferrer'
              className='text-text-secondary transition-colors hover:text-foreground'
            >
              <GithubLogoIcon size={20} weight='fill' />
            </a>
          </div>
        </div>

        <div className='mt-8 text-center text-sm text-text-muted'>
          © 2025 Borderless Coding. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
