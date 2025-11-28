'use client'

import { motion } from 'framer-motion'

export function HeroHeadline() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className='mb-3 text-4xl leading-tight font-medium text-foreground sm:text-5xl md:text-6xl lg:text-7xl'
    >
      Eliminate bugs. Automate reviews.
    </motion.h1>
  )
}
