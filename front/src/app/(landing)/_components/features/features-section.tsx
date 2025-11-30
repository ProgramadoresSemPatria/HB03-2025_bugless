'use client'

import { BentoGrid, ConnectionGraph, FeaturesHeader } from '.'
import { useSectionReveal } from '../../_hooks/use-section-reveal'
import { Container } from '../shared/container'

export function FeaturesSection() {
  const { ref, isInView } = useSectionReveal()

  return (
    <section id='features' ref={ref} className='relative py-32'>
      <ConnectionGraph />

      <Container>
        <FeaturesHeader isInView={isInView} />
        <BentoGrid isInView={isInView} />
      </Container>
    </section>
  )
}
