'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { List, X } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'

import { Sidebar } from './_components/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className='min-h-screen bg-background'>
      <header className='fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:hidden'>
        <Link href='/dashboard' className='flex items-center gap-2'>
          <Image
            src='/assets/logo/bugless_logo_transparent.png'
            alt='BugLess'
            width={28}
            height={28}
            className='size-7'
          />
          <span className='font-semibold'>BugLess</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className='rounded-md p-2 text-text-secondary transition-colors hover:bg-surface-hover hover:text-foreground'
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          type='button'
        >
          {isMobileOpen ? <X size={22} /> : <List size={22} />}
        </button>
      </header>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden'
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className='fixed left-0 top-0 z-50 h-screen w-[280px] lg:hidden'
            >
              <Sidebar
                isCollapsed={false}
                onToggle={() => setIsMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className='hidden lg:block'>
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      <main
        className={cn(
          'min-h-screen pt-14 transition-[margin] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
          'lg:pt-0',
          isCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[256px]',
        )}
      >
        <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8'>
          {children}
        </div>
      </main>
    </div>
  )
}
