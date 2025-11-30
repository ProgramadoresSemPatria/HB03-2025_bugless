'use client'

import { useSectionReveal } from '../../_hooks/use-section-reveal'
import { Container } from '../shared/container'
import { ComparisonCards } from './comparison-cards'
import { ComparisonHeader } from './comparison-header'
import { ComparisonTable } from './comparison-table'

export function ComparisonSection() {
  const { ref, isInView } = useSectionReveal()

  return (
    <section
      ref={ref}
      id='compare'
      className='sticky -top-160 scroll-mt-20 bg-surface py-32 pb-64 md:-top-10'
    >
      <Container>
        <ComparisonHeader isInView={isInView} />
        {/* Desktop Table */}
        <ComparisonTable />
        {/* Mobile Cards */}
        <ComparisonCards />
      </Container>
    </section>
  )
}
