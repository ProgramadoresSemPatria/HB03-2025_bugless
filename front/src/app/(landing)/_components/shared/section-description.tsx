import { cn } from '@/lib/utils'
import React from 'react'

export function SectionDescription({
  children,
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'mx-auto my-2.5 max-w-prose text-lg text-pretty text-text-secondary lg:text-xl',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  )
}
