'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  Bell,
  ChartLine,
  Code,
  Folder,
  Gear,
  House,
  Lock,
} from '@phosphor-icons/react/dist/ssr'

import type { NavItem } from '../_lib/mock-data'

const iconMap = {
  house: House,
  code: Code,
  'chart-line': ChartLine,
  folder: Folder,
  gear: Gear,
  bell: Bell,
}

interface SidebarNavProps {
  items: NavItem[]
  isCollapsed: boolean
}

export function SidebarNav({ items, isCollapsed }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className='flex flex-1 flex-col gap-1 px-3 py-4'>
      {items.map((item) => {
        const Icon = iconMap[item.icon]
        const isActive = pathname === item.href
        const isDisabled = item.disabled

        if (isDisabled) {
          const disabledContent = (
            <div
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
                'cursor-not-allowed opacity-50',
                isCollapsed && 'justify-center px-2',
              )}
            >
              <Icon size={20} weight='regular' className='shrink-0 text-text-muted' />
              {!isCollapsed && (
                <>
                  <span className='flex-1 text-text-muted'>{item.label}</span>
                  <Lock size={14} className='text-text-muted' />
                </>
              )}
            </div>
          )

          if (isCollapsed) {
            return (
              <Tooltip key={item.id} delayDuration={0}>
                <TooltipTrigger asChild>{disabledContent}</TooltipTrigger>
                <TooltipContent side='right'>
                  <span className='text-text-muted'>{item.label} (Coming Soon)</span>
                </TooltipContent>
              </Tooltip>
            )
          }

          return <div key={item.id}>{disabledContent}</div>
        }

        const linkContent = (
          <Link
            href={item.href}
            className={cn(
              'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-text-secondary hover:bg-surface-hover hover:text-foreground',
              isCollapsed && 'justify-center px-2',
            )}
          >
            <Icon
              size={20}
              weight={isActive ? 'fill' : 'regular'}
              className={cn(
                'shrink-0 transition-colors',
                isActive ? 'text-primary' : 'text-text-secondary group-hover:text-foreground',
              )}
            />
            {!isCollapsed && (
              <>
                <span className='flex-1'>{item.label}</span>
                {item.badge && (
                  <Badge
                    variant='secondary'
                    className='bg-primary/20 text-primary hover:bg-primary/20'
                  >
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </Link>
        )

        if (isCollapsed) {
          return (
            <Tooltip key={item.id} delayDuration={0}>
              <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
              <TooltipContent side='right' className='flex items-center gap-2'>
                {item.label}
                {item.badge && (
                  <Badge
                    variant='secondary'
                    className='bg-primary/20 text-primary hover:bg-primary/20'
                  >
                    {item.badge}
                  </Badge>
                )}
              </TooltipContent>
            </Tooltip>
          )
        }

        return <div key={item.id}>{linkContent}</div>
      })}
    </nav>
  )
}
