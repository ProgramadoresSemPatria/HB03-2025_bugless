'use client'

import { MotionDiv } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { useSectionReveal } from '../../_hooks/use-section-reveal'
import { Container } from '../shared/container'
import { SectionDescription } from '../shared/section-description'
import { SectionHeading } from '../shared/section-heading'

export function CTASection() {
  const { ref, isInView } = useSectionReveal()

  return (
    <section ref={ref} className='border-t py-24'>
      <Container className='text-center'>
        <MotionDiv isInView={isInView} className='mb-0'>
          <SectionHeading>Ready to catch more bugs?</SectionHeading>
          <SectionDescription className='mb-6'>
            Get started with Bugless for free
          </SectionDescription>

          <Button>Get started</Button>
        </MotionDiv>
      </Container>
    </section>
  )
}
