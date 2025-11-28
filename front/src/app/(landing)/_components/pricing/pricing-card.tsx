'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CheckIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface PricingCardProps {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta: string
  popular?: boolean
  index: number
  isInView: boolean
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  popular,
  index,
  isInView,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={cn(
        'relative flex flex-col rounded-2xl border bg-background p-8 transition-all duration-200',
        popular
          ? 'scale-110 border-primary shadow-lg shadow-primary/20 hover:shadow-2xl hover:shadow-primary/40'
          : 'border-transparent hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10',
      )}
    >
      {popular && (
        <div className='absolute -top-4 left-1/2 -translate-x-1/2'>
          <span className='rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground'>
            Most Popular
          </span>
        </div>
      )}

      <div className='mb-6'>
        <h3 className='mb-2 text-2xl font-bold'>{name}</h3>
        <div>
          <span className='text-5xl font-bold'>{price}</span>
          {period && <span className='ml-1 text-text-muted'>/{period}</span>}
        </div>
      </div>

      <p className='mb-6 text-text-secondary'>{description}</p>

      <Button
        size='lg'
        className={cn(
          'mb-8 border',
          popular
            ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary-hover'
            : 'bg-surface hover:bg-surface-hover',
        )}
      >
        {cta}
      </Button>

      <ul className='mb-8 flex-1 space-y-3'>
        {features.map((feature) => (
          <li key={feature} className='flex items-start gap-3'>
            <CheckIcon
              weight='bold'
              className='mt-0.5 size-5 shrink-0 text-primary'
            />
            <span className='text-sm text-text-secondary'>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
