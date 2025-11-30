'use client'

import { useSectionReveal } from '@/app/(landing)/_hooks/use-section-reveal'
import { Container } from '../shared/container'
import { TerminalDemo } from './terminal-demo'
import { TerminalHeader } from './terminal-header'

export function TerminalSection() {
  const { ref, isInView } = useSectionReveal()

  return (
    <section ref={ref} className='bg-surface py-32'>
      <Container>
        <TerminalHeader isInView={isInView} />

        <TerminalDemo isInView={isInView} />
      </Container>
    </section>
  )
}
