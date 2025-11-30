import { cn } from '@/lib/utils'
import { CheckIcon, XIcon } from '@phosphor-icons/react'

interface ComparisonFeatureIconProps {
  checked: boolean
  isPrimary?: boolean
  size?: number
}

export function ComparisonFeatureIcon({
  checked = false,
  isPrimary = false,
  size = 16,
}: ComparisonFeatureIconProps) {
  return (
    <div className='flex size-6 items-center justify-center rounded-full bg-muted/20'>
      {checked ? (
        <CheckIcon
          size={size}
          weight='bold'
          className={cn(isPrimary ? 'text-primary' : 'text-text-secondary')}
        />
      ) : (
        <XIcon size={size} weight='bold' className='text-text-muted' />
      )}
    </div>
  )
}
