'use client'

import { useSectionReveal } from '@/app/(landing)/_hooks/use-section-reveal'
import { motion } from 'framer-motion'
import { Container } from '../shared/container'
import { TerminalDemo } from './terminal-demo'

export function TerminalSection() {
  const { ref, isInView } = useSectionReveal()

  return (
    <section ref={ref} className='bg-surface py-32'>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className='mb-12 text-center'
        >
          <h2 className='mb-4 text-4xl text-foreground md:text-5xl'>
            Built for the terminal
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-text-secondary'>
            4 review modes that integrate with your existing workflow. No
            context switching, no web UI required.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='mx-auto max-w-3xl'
        >
          <TerminalDemo isInView={isInView} />
        </motion.div>
      </Container>
    </section>
  )
}
