'use client'

import { motion } from 'framer-motion'

const highlights = [
  '<10% false positives',
  'Pre-commit detection',
  'Auto-fix in 1 click',
]

export function HeroSubtitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className='mb-8'
    >
      <p className='mb-3 text-lg text-text-secondary md:text-xl'>
        AI-powered TypeScript code review that actually works.
      </p>

      <div className='flex flex-wrap items-center justify-center gap-x-1 gap-y-1 text-sm md:text-base'>
        {highlights.map((text, i) => (
          <motion.span
            key={text}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
            className='font-medium text-primary'
          >
            {text}
            {i < highlights.length - 1 && (
              <span className='mx-2 text-text-muted'>•</span>
            )}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}
