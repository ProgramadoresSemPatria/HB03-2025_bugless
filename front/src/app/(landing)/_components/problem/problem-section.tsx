'use client'

import { useSectionReveal } from '@/app/(landing)/_hooks/use-section-reveal'
import { PROBLEMS } from '@/lib/constants'
import { Container } from '../shared/container'
import { AnimatedLines } from './animated-lines'
import { ProblemCard } from './problem-card'
import { ProblemHeader } from './problem-header'

export function ProblemSection() {
  const { ref, isInView } = useSectionReveal()

  return (
    <section ref={ref} className='relative bg-background pt-12 pb-48'>
      <AnimatedLines isInView={isInView} />

      <Container className='relative'>
        <ProblemHeader isInView={isInView} />

        <div className='grid gap-6 md:grid-cols-3'>
          {PROBLEMS.map((problem, i) => (
            <ProblemCard
              key={problem.title}
              icon={problem.icon}
              title={problem.title}
              description={problem.description}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
