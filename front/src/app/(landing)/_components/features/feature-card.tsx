'use client'

import { Icon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface FeatureCardProps {
  icon: Icon
  title: string
  description: string
  children?: React.ReactNode
  className?: string
  delay?: number
  isInView: boolean
}

export function FeatureCard({
  icon: IconComponent,
  title,
  description,
  children,
  className = '',
  delay = 0,
  isInView,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className={`relative overflow-hidden rounded-3xl border p-6 transition-colors hover:border-primary/50 ${className}`}
    >
      <div className='mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-primary/10'>
        <IconComponent size={24} weight='bold' className='text-primary' />
      </div>
      <h3 className='mb-2 text-xl font-bold'>{title}</h3>
      <p className='mb-6 text-pretty text-text-secondary'>{description}</p>
      {children}
    </motion.div>
  )
}
