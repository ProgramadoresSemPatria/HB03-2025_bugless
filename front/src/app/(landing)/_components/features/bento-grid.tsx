'use client'

import {
  CodeIcon,
  FileTextIcon,
  GearIcon,
  GitBranchIcon,
  GitCommitIcon,
  LightningIcon,
  LockIcon,
  SlidersHorizontalIcon,
  SparkleIcon,
  TerminalIcon,
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { FeatureCard } from './feature-card'

interface BentoGridProps {
  isInView: boolean
}

export function BentoGrid({ isInView }: BentoGridProps) {
  const cards = [
    {
      icon: SparkleIcon,
      title: 'AI-Powered Analysis',
      description:
        'Bugless uses AI to understand code logic, not just syntax. Identifies complex bugs, security vulnerabilities, and performance issues.',
      className:
        'md:col-span-2 md:row-span-2 bg-linear-to-br from-primary/5 via-primary/5 to-background',
      delay: 0.1,
      children: (
        <div className='rounded-lg border border-border bg-background/50 p-4 font-mono text-sm backdrop-blur-sm'>
          <div className='mb-3 flex items-center gap-2'>
            <div className='h-3 w-3 rounded-full bg-red-500/80' />
            <div className='h-3 w-3 rounded-full bg-yellow-500/80' />
            <div className='h-3 w-3 rounded-full bg-green-500/80' />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='mt-3 space-y-2'
          >
            <div className='space-y-0.5'>
              <div className='text-error'>✖ CRITICAL src/api/users.ts:42</div>
              <div className='pl-4 text-xs text-text-secondary'>
                SQL injection vulnerability in query builder
              </div>
              <div className='pl-4 text-xs text-primary/80'>
                💡 Use parameterized queries instead
              </div>
            </div>

            <div className='space-y-0.5'>
              <div className='text-warning'>
                ⚠ WARNING src/utils/parser.ts:18
              </div>
              <div className='pl-4 text-xs text-text-secondary'>
                Unhandled promise rejection possible
              </div>
              <div className='pl-4 text-xs text-primary/80'>
                💡 Add try/catch or .catch() handler
              </div>
            </div>
          </motion.div>
        </div>
      ),
    },
    {
      icon: LightningIcon,
      title: 'Zero Configuration',
      description:
        'Works out of the box. No setup files, no config to maintain.',
      className:
        'lg:col-span-1 bg-linear-to-bl from-primary/5 via-primary/5 to-background',
      delay: 0.2,
    },
    {
      icon: CodeIcon,
      title: 'Multi-Language',
      description: 'Works with JavaScript, Python, Go, Rust, and more.',
      className:
        'lg:col-span-1 bg-linear-to-bl from-primary/5 via-primary/5 to-background',
      delay: 0.25,
    },
    {
      icon: TerminalIcon,
      title: 'Fast Reviews',
      description:
        'Get results in seconds for single commits. Scales efficiently even for full codebases.',
      className:
        'md:col-span-2 lg:col-span-2 bg-linear-to-t from-primary/5 via-primary/5 to-background',
      delay: 0.3,
    },
    {
      icon: LockIcon,
      title: 'Local & Private',
      description: 'Your code stays private and secure.',
      className:
        'md:col-span-1 bg-linear-to-tr from-primary/5 via-primary/5 to-background',
      delay: 0.35,
    },
    {
      icon: SlidersHorizontalIcon,
      title: 'Flexible Options',
      description: 'Choose the perfect review mode for your workflow',
      className:
        'md:col-span-2 lg:col-span-3 bg-linear-to-t from-primary/5 via-primary/5 to-background',
      delay: 0.4,
      children: (
        <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
          <div className='flex flex-col items-center gap-2 rounded-lg border border-border bg-background/30 p-4 text-center transition-colors hover:border-primary/30'>
            <GitBranchIcon size={20} className='text-primary' />
            <span className='text-sm font-medium'>Branch comparison</span>
          </div>
          <div className='flex flex-col items-center gap-2 rounded-lg border border-border bg-background/30 p-4 text-center transition-colors hover:border-primary/30'>
            <FileTextIcon size={20} className='text-primary' />
            <span className='text-sm font-medium'>Uncommitted changes</span>
          </div>
          <div className='flex flex-col items-center gap-2 rounded-lg border border-border bg-background/30 p-4 text-center transition-colors hover:border-primary/30'>
            <GitCommitIcon size={20} className='text-primary' />
            <span className='text-sm font-medium'>Specific commits</span>
          </div>
          <div className='flex flex-col items-center gap-2 rounded-lg border border-border bg-background/30 p-4 text-center transition-colors hover:border-primary/30'>
            <GearIcon size={20} className='text-primary' />
            <span className='text-sm font-medium'>Custom instructions</span>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className='grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {cards.map((card, index) => (
        <FeatureCard
          key={index}
          icon={card.icon}
          title={card.title}
          description={card.description}
          className={card.className}
          delay={card.delay}
          isInView={isInView}
        >
          {card.children}
        </FeatureCard>
      ))}
    </div>
  )
}
