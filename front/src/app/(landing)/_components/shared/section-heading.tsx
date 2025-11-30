import { cn } from '@/lib/utils'
import React from 'react'

export function SectionHeading({
  children,
  className,
  ...props
}: React.ComponentProps<'h2'>) {
  return (
    <h2
      className={cn(
        'mb-4 text-3xl text-balance md:text-4xl lg:text-5xl',
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  )
}
