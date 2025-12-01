'use client'

import { useSectionReveal } from '@/app/(landing)/_hooks/use-section-reveal'
import { Books, Clock, SpeakerHigh } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Container } from '../shared/container'
import { ProblemCard } from './problem-card'

const problems = [
  {
    icon: SpeakerHigh,
    title: 'Too much noise',
    description:
      '~50% of comments are false positives or style nitpicks. Developers learn to ignore all suggestions.',
  },
  {
    icon: Books,
    title: 'Not deep enough',
    description:
      "Tools cover 50+ languages and end up shallow in all. They don't understand TypeScript patterns.",
  },
  {
    icon: Clock,
    title: 'Too late',
    description:
      'Analysis happens after PR is open. Bug is already committed. Now you need another commit to fix.',
  },
]

export function ProblemSection() {
  const { ref, isInView } = useSectionReveal()

  return (
    <section ref={ref} className='bg-background py-32'>
      <Container>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className='mb-16 text-center text-4xl text-foreground md:text-5xl'
        >
          The problem with AI code review
        </motion.h2>

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
