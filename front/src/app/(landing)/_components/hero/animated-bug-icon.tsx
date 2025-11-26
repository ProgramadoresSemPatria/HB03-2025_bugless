'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function AnimatedBugIcon() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className='mb-6'
    >
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className='relative'
      >
        <div className='absolute inset-0 blur-2xl'>
          <Image
            src='/assets/logo/bugless_logo_transparent.png'
            alt=''
            width={100}
            height={100}
            className='mx-auto opacity-40'
            aria-hidden='true'
          />
        </div>

        <Image
          src='/assets/logo/bugless_logo_transparent.png'
          alt='BugLess Logo'
          width={100}
          height={100}
          className='relative mx-auto'
          priority
        />
      </motion.div>
    </motion.div>
  )
}
