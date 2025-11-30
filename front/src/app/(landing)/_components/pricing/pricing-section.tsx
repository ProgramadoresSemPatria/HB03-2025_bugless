'use client'

import { useSectionReveal } from '@/app/(landing)/_hooks/use-section-reveal'
import { PRICING_PLANS } from '@/lib/constants'
import { Container } from '../shared/container'
import { PricingCard } from './pricing-card'
import { PricingHeader } from './pricing-header'

export function PricingSection() {
  const { ref, isInView } = useSectionReveal()

  return (
    <section
      id='pricing'
      ref={ref}
      className='relative z-10 scroll-mt-20 rounded-t-3xl bg-background py-32 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]'
    >
      <Container>
        <PricingHeader isInView={isInView} />

        <div className='mx-auto grid max-w-6xl gap-10 md:grid-cols-3'>
          {PRICING_PLANS.map((plan) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              price={plan.price}
              period={plan.period}
              description={plan.description}
              features={plan.features}
              cta={plan.cta}
              popular={plan.popular}
              isInView={isInView}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
