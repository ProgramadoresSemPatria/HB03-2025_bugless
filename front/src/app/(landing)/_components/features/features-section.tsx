'use client'

import { useSectionReveal } from '@/app/(landing)/_hooks/use-section-reveal'
import type { Icon } from '@phosphor-icons/react'
import {
  Brain,
  GithubLogo,
  Lightning,
  Sliders,
  Target,
  Terminal,
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Container } from '../shared/container'
import { ConnectionGraph } from './connection-graph'
import { FeatureCard } from './feature-card'

interface Feature {
  icon: Icon
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: Terminal,
    title: 'Built for the terminal',
    description: '4 review modes that integrate seamlessly with your workflow.',
  },
  {
    icon: GithubLogo,
    title: 'Automatic PR reviews',
    description: 'Install once, get reviews on every PR with 1-click fixes.',
  },
  {
    icon: Lightning,
    title: 'Understands TypeScript',
    description: 'Type inference, generics, decorators. Not generic rules.',
  },
  {
    icon: Target,
    title: 'Catch bugs early',
    description: 'Review uncommitted changes before they hit git.',
  },
  {
    icon: Sliders,
    title: 'Your team, your rules',
    description: 'Focus on security, performance, or custom patterns.',
  },
  {
    icon: Brain,
    title: 'Gets smarter over time',
    description: 'Learns from your feedback. Adapts to your codebase.',
  },
]

export function FeaturesSection() {
  const { ref, isInView } = useSectionReveal()

  return (
    <section ref={ref} className='relative overflow-hidden py-32'>
      <ConnectionGraph />

      <Container className='relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className='mb-12 text-center'
        >
          <h2 className='mb-4 text-4xl text-foreground md:text-5xl'>
            Features
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-text-secondary'>
            Everything you need to catch bugs before they catch you.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
