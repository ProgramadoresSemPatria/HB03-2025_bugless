'use client'

import { GithubAppButton } from '../shared/github-app-button'
import { InstallCommand } from '../shared/install-command'
import { AnimatedBugIcon } from './animated-bug-icon'
import { BackedBadge } from './backed-badge'
import { FlowFieldCanvas } from './flow-field-canvas'
import { HeroHeadline } from './hero-headline'
import { HeroSubtitle } from './hero-subtitle'

export function HeroSection() {
  return (
    <section className='flex justify-center pt-28 sm:pt-36 lg:pt-40'>
      <FlowFieldCanvas />

      <div className='relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center'>
        <BackedBadge />
        <AnimatedBugIcon />
        <HeroHeadline />
        <HeroSubtitle />
        <InstallCommand />
        <GithubAppButton />
      </div>
    </section>
  )
}
