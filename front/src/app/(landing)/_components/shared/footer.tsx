'use client'

import { Logo } from '@/components/common/logo'
import { NAV_LINKS } from '@/lib/constants'
import { ArrowRight, GithubLogo, TwitterLogo } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Container } from './container'

export function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className='border-t bg-background'>
      <section className='py-24'>
        <Container className='text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='mb-4 text-4xl text-foreground md:text-5xl'>
              Ready to catch more bugs?
            </h2>
            <p className='mx-auto mb-8 max-w-xl text-lg text-text-secondary'>
              Join the waitlist and be the first to know when BugLess launches.
            </p>

            <div className='mx-auto max-w-md'>
              <div className='flex gap-2 rounded-lg border bg-surface p-2'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='you@company.com'
                  className='flex-1 bg-transparent px-4 py-3 text-foreground outline-none placeholder:text-text-muted'
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-medium whitespace-nowrap text-primary-foreground transition-colors hover:bg-primary-hover'
                >
                  Join Waitlist
                  <ArrowRight weight='bold' className='size-4' />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      <div className='border-t py-8'>
        <Container>
          <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
            <Logo />

            <nav className='flex items-center gap-6 text-sm text-text-secondary'>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className='transition-colors hover:text-foreground'
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className='flex items-center gap-4'>
              <a
                href='https://github.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-text-secondary transition-colors hover:text-foreground'
              >
                <GithubLogo size={20} weight='fill' />
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-text-secondary transition-colors hover:text-foreground'
              >
                <TwitterLogo size={20} weight='fill' />
              </a>
            </div>
          </div>

          <div className='mt-8 text-center text-sm text-text-muted'>
            © 2025 Borderless Coding. All rights reserved.
          </div>
        </Container>
      </div>
    </footer>
  )
}
