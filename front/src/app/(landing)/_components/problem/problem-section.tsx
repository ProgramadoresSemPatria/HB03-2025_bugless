'use client'

import { useSectionReveal } from '@/app/(landing)/_hooks/use-section-reveal'
import {
  BugIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react/dist/ssr'
import { Container } from '../shared/container'
import { AnimatedLines } from './animated-lines'
import { ProblemCard } from './problem-card'
import { ProblemHeader } from './problem-header'

const problems = [
  {
    icon: BugIcon,
    title: 'Bugs slip through the cracks',
    description:
      'Manual code reviews are inconsistent and time-consuming. Critical issues get missed when reviewers are rushed or fatigued.',
  },
  {
    icon: ClockIcon,
    title: 'Reviews slow you down',
    description:
      "Waiting for code review feedback creates bottlenecks. Your team's velocity suffers while PRs sit in the queue.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'Traditional tools fall short',
    description:
      'Static analyzers catch syntax but miss logic errors. They flood you with false positives instead of real insights.',
  },
]

export function ProblemSection() {
  const { ref, isInView } = useSectionReveal()

  return (
    <section ref={ref} className='relative bg-background pt-12 pb-48'>
      <AnimatedLines isInView={isInView} />

      <Container className='relative'>
        <ProblemHeader isInView={isInView} />

        <div className='grid gap-6 md:grid-cols-3'>
          {problems.map((problem, i) => (
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
