'use client'

import { Container } from '@/app/(landing)/_components/shared/container'
import { NAV_LINKS } from '@/lib/constants'
import { ListIcon, XIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Logo } from './logo'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
          delay: 1,
        }}
        className='fixed top-0 left-0 z-50 w-full bg-linear-to-b from-black via-black/60 to-transparent md:py-2'
      >
        <Container>
          <div className='flex items-center justify-between py-4'>
            <Logo />

            <nav className='hidden md:flex md:items-center md:gap-6'>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className='text-sm text-text-secondary transition-colors hover:text-foreground'
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className='hidden md:flex'>
              <Button>Get started</Button>
            </div>

            <Button
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              variant='ghost'
              size='icon-lg'
              className='-mr-2 md:hidden'
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <XIcon size={24} weight='bold' />
              ) : (
                <ListIcon size={24} weight='bold' />
              )}
            </Button>
          </div>
        </Container>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-40 bg-background/95 backdrop-blur-lg md:hidden'
          >
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className='flex h-full flex-col items-center justify-center gap-8'
            >
              {NAV_LINKS.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className='text-2xl font-medium text-foreground transition-colors hover:text-primary'
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className='mt-4 cursor-pointer rounded-lg bg-primary px-8 py-3 text-lg font-medium text-primary-foreground transition-colors hover:bg-primary-hover'
              >
                Get Started
              </motion.button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
