'use client'

import { Button } from '@/components/ui/button'
import { GithubLogoIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

export function GithubAppButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className='mx-auto max-w-md'
    >
      <Button asChild variant='outline' size='lg' className='mt-3 bg-surface'>
        <a
          href='https://github.com/apps/bugless-code-review'
          target='_blank'
          rel='noopener noreferrer'
        >
          <GithubLogoIcon size={20} weight='bold' />
          Install GitHub App
        </a>
      </Button>
    </motion.div>
  )
}
