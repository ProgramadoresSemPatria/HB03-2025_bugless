'use client'

import Image from 'next/image'
import Link from 'next/link'

import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr'
import { motion } from 'framer-motion'

import { MOCK_USER, SIDEBAR_NAV_ITEMS } from '../_lib/mock-data'
import { SidebarNav } from './sidebar-nav'
import { SidebarUser } from './sidebar-user'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  return (
    <TooltipProvider>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 256 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col',
          'border-r border-border bg-surface',
        )}
      >
        <div
          className={cn(
            'flex h-16 items-center border-b border-border px-4',
            isCollapsed ? 'justify-center' : 'justify-between',
          )}
        >
          <Link
            href='/dashboard'
            className={cn('flex items-center gap-2', isCollapsed && 'justify-center')}
          >
            <Image
              src='/assets/logo/bugless_logo_transparent.png'
              alt='BugLess'
              width={32}
              height={32}
              className='size-8'
            />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='text-lg font-semibold'
              >
                BugLess
              </motion.span>
            )}
          </Link>
          {!isCollapsed && (
            <button
              onClick={onToggle}
              className='rounded-md p-1.5 text-text-secondary transition-colors hover:bg-surface-hover hover:text-foreground'
              aria-label='Collapse sidebar'
              type='button'
            >
              <CaretLeft size={18} />
            </button>
          )}
        </div>

        {isCollapsed && (
          <button
            onClick={onToggle}
            className='mx-auto mt-4 rounded-md p-1.5 text-text-secondary transition-colors hover:bg-surface-hover hover:text-foreground'
            aria-label='Expand sidebar'
            type='button'
          >
            <CaretRight size={18} />
          </button>
        )}

        <SidebarNav items={SIDEBAR_NAV_ITEMS} isCollapsed={isCollapsed} />
        <SidebarUser user={MOCK_USER} isCollapsed={isCollapsed} />
      </motion.aside>
    </TooltipProvider>
  )
}
