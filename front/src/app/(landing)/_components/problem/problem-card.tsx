'use client'

import type { Icon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface ProblemCardProps {
  icon: Icon
  title: string
  description: string
  index: number
  isInView: boolean
}

export function ProblemCard({
  icon: IconComponent,
  title,
  description,
  index,
  isInView,
}: ProblemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className='rounded-3xl border bg-background/2 p-8 backdrop-blur-xs transition-[background-color,box-shadow] duration-200 hover:bg-primary/7 hover:shadow-[0_0_30px_color-mix(in_oklab,var(--primary)_7%,transparent)]'
    >
      <IconComponent size={48} weight='duotone' className='mb-4 text-primary' />
      <h3 className='mb-3 text-xl font-semibold text-foreground'>{title}</h3>
      <p className='leading-relaxed text-text-secondary'>{description}</p>
    </motion.div>
  )
}
