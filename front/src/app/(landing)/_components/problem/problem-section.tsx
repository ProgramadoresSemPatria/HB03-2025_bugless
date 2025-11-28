'use client'

import { useSectionReveal } from '@/app/(landing)/_hooks/use-section-reveal'
import {
  BugIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react/dist/ssr'
import { motion } from 'framer-motion'
import { Container } from '../shared/container'
import { ProblemCard } from './problem-card'

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

  const lineVariants = {
    hidden: { width: 0 },
    visible: (i: number) => ({
      width: ['0%', '100%', '0%'],
      transition: {
        times: [0, 0.5, 1],
        duration: 5,
        delay: i * 0.35,
        repeat: Infinity,
      },
    }),
  }

  return (
    <section ref={ref} className='relative bg-background pt-12 pb-48'>
      {/* Lines left */}
      <div className='absolute top-1/2 left-0 hidden h-[400px] w-[250px] -translate-y-1/2 flex-col justify-between md:flex'>
        {[...Array(6).keys()].map((i) => (
          <motion.div
            key={i}
            custom={i}
            initial='hidden'
            animate={isInView ? 'visible' : 'hidden'}
            variants={lineVariants}
            className='h-0.5 w-full bg-linear-to-r from-primary to-transparent'
          />
        ))}
      </div>
      {/* Lines right */}
      <div className='absolute top-1/2 right-0 hidden h-[400px] w-[250px] -translate-y-1/2 flex-col items-end justify-between md:flex'>
        {[...Array(6).keys()].map((i) => (
          <motion.div
            key={i}
            custom={i}
            initial='hidden'
            animate={isInView ? 'visible' : 'hidden'}
            variants={lineVariants}
            className='h-0.5 w-full bg-linear-to-l from-primary to-transparent'
          />
        ))}
      </div>

      <Container className='relative'>
        <div className='z-10 flex flex-col items-center justify-center pb-16 text-center'>
          <motion.h2
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className='my-2.5 text-4xl md:text-5xl'
          >
            Stop shipping bugs. Start shipping confidence.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className='mt-2.5 max-w-prose text-xl text-text-secondary'
          >
            Every developer knows the frustration: code that looked perfect
            breaks in production. Manual reviews miss edge cases. Static linters
            throw false positives. You need a smarter way to catch problems
            before they become incidents.
          </motion.p>
        </div>

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
