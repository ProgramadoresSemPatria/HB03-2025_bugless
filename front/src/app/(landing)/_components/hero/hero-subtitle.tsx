'use client'

import { motion } from 'framer-motion'
import { SectionDescription } from '../shared/section-description'

export function HeroSubtitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className='mb-8'
    >
      <SectionDescription>
        AI Agent that handles code review and complex refactoring,
        automatically. Available as CLI tool and GitHub App.
      </SectionDescription>
    </motion.div>
  )
}
