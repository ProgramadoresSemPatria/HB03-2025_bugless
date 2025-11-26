'use client'

import { motion, useScroll } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className='fixed top-0 right-0 left-0 z-50 h-1 origin-left bg-primary'
    />
  )
}
