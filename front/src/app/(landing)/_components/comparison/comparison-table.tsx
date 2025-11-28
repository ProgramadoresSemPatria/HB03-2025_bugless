'use client'

import { useSectionReveal } from '@/app/(landing)/_hooks/use-section-reveal'
import { CheckIcon, XIcon } from '@phosphor-icons/react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useRef } from 'react'
import { Container } from '../shared/container'

interface Feature {
  name: string
  coderabbit: string | boolean
  pragent: string | boolean
  bugless: string | boolean
}

const features: Feature[] = [
  {
    name: 'Language focus',
    coderabbit: '50+ langs',
    pragent: 'Multi',
    bugless: 'TypeScript only',
  },
  {
    name: 'False positives',
    coderabbit: '~50%',
    pragent: '~30%',
    bugless: '<10%',
  },
  {
    name: 'Pre-commit',
    coderabbit: 'Limited',
    pragent: false,
    bugless: true,
  },
  {
    name: 'CLI experience',
    coderabbit: 'Basic',
    pragent: false,
    bugless: 'Primary',
  },
  {
    name: 'Auto-fix',
    coderabbit: 'Partial',
    pragent: false,
    bugless: '1-click',
  },
]

function renderCell(value: string | boolean, isBugless = false) {
  if (typeof value === 'boolean') {
    return value ? (
      <CheckIcon
        weight='bold'
        className={`size-5 ${isBugless ? 'text-primary' : 'text-success'}`}
      />
    ) : (
      <XIcon weight='bold' className='size-5 text-text-muted' />
    )
  }
  return (
    <span className={isBugless ? 'font-medium text-primary' : ''}>{value}</span>
  )
}

export function ComparisonSection() {
  const { ref, isInView } = useSectionReveal()
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

  return (
    <section
      id='compare'
      ref={sectionRef}
      className='sticky top-0 scroll-mt-20 bg-surface py-32'
    >
      <motion.div
        ref={ref}
        style={
          prefersReducedMotion
            ? {}
            : {
                opacity,
                scale,
              }
        }
      >
        <Container>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className='mb-16 text-center text-4xl text-foreground md:text-5xl'
          >
            How we compare
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='overflow-x-auto'
          >
            <table className='w-full min-w-[600px]'>
              <thead>
                <tr className='border-b'>
                  <th className='px-6 py-4 text-left font-medium text-text-secondary'>
                    Feature
                  </th>
                  <th className='px-6 py-4 text-left font-medium text-text-secondary'>
                    CodeRabbit
                  </th>
                  <th className='px-6 py-4 text-left font-medium text-text-secondary'>
                    PR-Agent
                  </th>
                  <th className='border-l-2 border-primary px-6 py-4 text-left font-medium text-primary'>
                    BugLess
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, i) => (
                  <motion.tr
                    key={feature.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className='border-b transition-colors hover:bg-primary/5'
                  >
                    <td className='px-6 py-4 text-foreground'>
                      {feature.name}
                    </td>
                    <td className='px-6 py-4 text-text-secondary'>
                      {renderCell(feature.coderabbit)}
                    </td>
                    <td className='px-6 py-4 text-text-secondary'>
                      {renderCell(feature.pragent)}
                    </td>
                    <td className='border-l-2 border-primary px-6 py-4 font-medium text-foreground'>
                      {renderCell(feature.bugless, true)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </Container>
      </motion.div>
    </section>
  )
}
