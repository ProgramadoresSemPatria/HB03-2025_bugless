'use client'

import { AnimatedBugIcon } from './animated-bug-icon'
import { BackedBadge } from './backed-badge'
import { FlowFieldCanvas } from './flow-field-canvas'
import { HeroHeadline } from './hero-headline'
import { HeroSubtitle } from './hero-subtitle'
import { InstallCommand } from './install-command'
import { ScrollIndicator } from './scroll-indicator'

export function HeroSection() {
  return (
    <section className='relative flex min-h-screen justify-center overflow-hidden pt-36 lg:pt-40'>
      <FlowFieldCanvas />

      <div className='relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center'>
        <BackedBadge />
        <AnimatedBugIcon />
        <HeroHeadline />
        <HeroSubtitle />
        <InstallCommand />
      </div>

      <ScrollIndicator />
    </section>
  )
}
