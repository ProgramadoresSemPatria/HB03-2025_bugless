'use client'

import { motion } from 'framer-motion'

interface ComparisonHeaderProps {
  isInView: boolean
}

export function ComparisonHeader({ isInView }: ComparisonHeaderProps) {
  return (
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
  )
}
