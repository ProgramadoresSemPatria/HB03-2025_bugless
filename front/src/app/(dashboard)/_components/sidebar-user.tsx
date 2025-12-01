'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { SignOut } from '@phosphor-icons/react/dist/ssr'

import type { User } from '../_lib/mock-data'

interface SidebarUserProps {
  user: User
  isCollapsed: boolean
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getPlanLabel(plan: User['plan']): string {
  return plan.charAt(0).toUpperCase() + plan.slice(1)
}

export function SidebarUser({ user, isCollapsed }: SidebarUserProps) {
  const initials = getInitials(user.name)

  const content = (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-surface-hover',
        isCollapsed && 'justify-center p-2',
      )}
    >
      <Avatar className='size-9 shrink-0'>
        <AvatarFallback className='bg-primary/10 text-sm font-medium text-primary'>
          {initials}
        </AvatarFallback>
      </Avatar>
      {!isCollapsed && (
        <div className='flex flex-1 flex-col overflow-hidden'>
          <span className='truncate text-sm font-medium'>{user.name}</span>
          <span className='truncate text-xs text-text-secondary'>{user.email}</span>
        </div>
      )}
      {!isCollapsed && (
        <Badge variant='outline' className='shrink-0 text-xs'>
          {getPlanLabel(user.plan)}
        </Badge>
      )}
    </div>
  )

  return (
    <div className='mt-auto px-3 pb-4'>
      <Separator className='mb-4' />
      {isCollapsed ? (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side='right' className='flex flex-col gap-1'>
            <span className='font-medium'>{user.name}</span>
            <span className='text-xs text-muted-foreground'>{user.email}</span>
          </TooltipContent>
        </Tooltip>
      ) : (
        content
      )}
      {!isCollapsed && (
        <button
          className='mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-foreground'
          type='button'
        >
          <SignOut size={18} />
          <span>Sign Out</span>
        </button>
      )}
    </div>
  )
}
