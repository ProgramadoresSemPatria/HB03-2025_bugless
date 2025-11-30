'use client'

import { CheckIcon, XIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useSectionReveal } from '../../_hooks/use-section-reveal'
import { Container } from '../shared/container'

const comparisonData = [
  {
    feature: 'AI-Powered Analysis',
    bugless: true,
    coderabbit: true,
    pragent: true,
  },
  {
    feature: 'CLI-Based Tool',
    bugless: true,
    coderabbit: false,
    pragent: false,
  },
  {
    feature: 'Zero Configuration',
    bugless: true,
    coderabbit: false,
    pragent: false,
  },
  {
    feature: 'Local & Private',
    bugless: true,
    coderabbit: false,
    pragent: false,
  },
  {
    feature: 'Review Presets',
    bugless: true,
    coderabbit: false,
    pragent: true,
  },
  {
    feature: 'Custom Instructions',
    bugless: true,
    coderabbit: true,
    pragent: false,
  },
]

export function ComparisonSection() {
  const { ref, isInView } = useSectionReveal()

  return (
    <section
      ref={ref}
      id='compare'
      className='sticky -top-150 scroll-mt-20 bg-surface py-32 pb-64 md:-top-20'
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className='mb-16 text-center'
        >
          <h2 className='mb-4 text-4xl text-balance text-foreground md:text-5xl'>
            Why Choose <span className='text-primary'>Bugless</span>?
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-pretty text-text-secondary'>
            See how Bugless compares to other code review tools
          </p>
        </motion.div>

        {/* Desktop Table */}
        <motion.div className='hidden md:block'>
          {/* Header */}
          <div className='grid grid-cols-4 items-center gap-4 p-6'>
            <div className='text-lg font-semibold'>Feature</div>
            <div className='text-center'>
              <div className='inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2'>
                <span className='font-bold text-primary'>Bugless</span>
              </div>
            </div>
            <div className='text-center font-semibold text-text-secondary'>
              CodeRabbit
            </div>
            <div className='text-center font-semibold text-text-secondary'>
              PR Agent
            </div>
          </div>

          {/* Rows */}
          {comparisonData.map((row, index) => (
            <motion.div
              key={row.feature}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className='grid grid-cols-4 gap-4 border-b p-6 transition-colors last:border-b-0 hover:bg-card/50'
            >
              <div className='font-medium'>{row.feature}</div>
              <div className='flex justify-center'>
                {row.bugless ? (
                  <div className='flex size-6 items-center justify-center rounded-full bg-primary/20'>
                    <CheckIcon
                      size={16}
                      weight='bold'
                      className='text-primary'
                    />
                  </div>
                ) : (
                  <div className='flex size-6 items-center justify-center rounded-full bg-muted/20'>
                    <XIcon
                      size={16}
                      weight='bold'
                      className='text-text-muted'
                    />
                  </div>
                )}
              </div>
              <div className='flex justify-center'>
                {row.coderabbit ? (
                  <div className='flex size-6 items-center justify-center rounded-full bg-muted/20'>
                    <CheckIcon
                      size={16}
                      weight='bold'
                      className='text-text-secondary'
                    />
                  </div>
                ) : (
                  <div className='flex size-6 items-center justify-center rounded-full bg-muted/20'>
                    <XIcon
                      size={16}
                      weight='bold'
                      className='text-text-muted'
                    />
                  </div>
                )}
              </div>
              <div className='flex justify-center'>
                {row.pragent ? (
                  <div className='flex size-6 items-center justify-center rounded-full bg-muted/20'>
                    <CheckIcon
                      size={16}
                      weight='bold'
                      className='text-text-secondary'
                    />
                  </div>
                ) : (
                  <div className='flex size-6 items-center justify-center rounded-full bg-muted/20'>
                    <XIcon
                      size={16}
                      weight='bold'
                      className='text-text-muted'
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Card View */}
        <div className='space-y-4 md:hidden'>
          {comparisonData.map((row, index) => (
            <motion.div
              key={row.feature}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className='overflow-hidden rounded-lg border border-border/50 p-4'
            >
              <div className='mb-3 text-base font-semibold'>{row.feature}</div>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='font-medium text-primary'>Bugless</span>
                  {row.bugless ? (
                    <CheckIcon
                      size={20}
                      weight='bold'
                      className='text-primary'
                    />
                  ) : (
                    <XIcon
                      size={20}
                      weight='bold'
                      className='text-text-muted'
                    />
                  )}
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-text-secondary'>CodeRabbit</span>
                  {row.coderabbit ? (
                    <CheckIcon
                      size={20}
                      weight='bold'
                      className='text-text-secondary'
                    />
                  ) : (
                    <XIcon
                      size={20}
                      weight='bold'
                      className='text-text-muted'
                    />
                  )}
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-text-secondary'>PR Agent</span>
                  {row.pragent ? (
                    <CheckIcon
                      size={20}
                      weight='bold'
                      className='text-text-secondary'
                    />
                  ) : (
                    <XIcon
                      size={20}
                      weight='bold'
                      className='text-text-muted'
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
