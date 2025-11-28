'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function BackedBadge() {
  return (
    <motion.a
      href='https://www.borderlesscoding.com/'
      target='_blank'
      rel='noopener noreferrer'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      className='mb-8 flex gap-2 rounded-full border bg-surface/30 px-4 py-2 text-sm text-text-secondary backdrop-blur-sm transition-all hover:scale-[102%]'
    >
      Backed by
      <span className='flex gap-2 font-semibold text-foreground'>
        <Image
          src='/assets/logo/borderless-logo.svg'
          alt='Borderless Coding logo'
          width={14}
          height={14}
        />
        Borderless
      </span>
    </motion.a>
  )
}
