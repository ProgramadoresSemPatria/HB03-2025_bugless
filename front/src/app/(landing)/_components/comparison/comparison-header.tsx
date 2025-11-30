'use client'

import { MotionDiv } from '@/components/motion'
import { SectionDescription } from '../shared/section-description'
import { SectionHeading } from '../shared/section-heading'

interface ComparisonHeaderProps {
  isInView: boolean
}

export function ComparisonHeader({ isInView }: ComparisonHeaderProps) {
  return (
    <MotionDiv isInView={isInView}>
      <SectionHeading>
        Why Choose <span className='text-primary'>Bugless</span>?
      </SectionHeading>
      <SectionDescription>
        See how Bugless compares to other code review tools
      </SectionDescription>
    </MotionDiv>
  )
}
