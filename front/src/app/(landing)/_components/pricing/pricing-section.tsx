'use client'

import { useSectionReveal } from '@/app/(landing)/_hooks/use-section-reveal'
import { motion } from 'framer-motion'
import { Container } from '../shared/container'
import { PricingCard } from './pricing-card'

const plans = [
  {
    name: 'Hobby',
    price: '$0',
    description: 'Perfect for side projects and learning.',
    features: [
      'Up to 3 repositories',
      '50 reviews/month',
      'CLI access',
      'Community support',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'month',
    description: 'For professional developers and small teams.',
    features: [
      'Unlimited repositories',
      'Unlimited reviews',
      'CLI + GitHub App',
      'Priority support',
      'Custom rules',
      'Team dashboard',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: 'month',
    description: 'For growing teams that need more control.',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'SSO integration',
      'Analytics & insights',
      'Dedicated support',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
  },
]

export function PricingSection() {
  const { ref, isInView } = useSectionReveal()

  return (
    <section
      id='pricing'
      ref={ref}
      className='relative z-10 scroll-mt-20 rounded-t-3xl bg-background py-32 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]'
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className='mb-16 text-center'
        >
          <h2 className='mb-4 text-4xl text-balance text-foreground md:text-5xl'>
            Simple, transparent pricing
          </h2>
          <p className='mx-auto max-w-xl text-lg text-pretty text-text-secondary'>
            Start free, upgrade when you need more. No hidden fees, no
            surprises.
          </p>
        </motion.div>

        <div className='mx-auto grid max-w-6xl gap-10 md:grid-cols-3'>
          {plans.map((plan, i) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              price={plan.price}
              period={plan.period}
              description={plan.description}
              features={plan.features}
              cta={plan.cta}
              popular={plan.popular}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
