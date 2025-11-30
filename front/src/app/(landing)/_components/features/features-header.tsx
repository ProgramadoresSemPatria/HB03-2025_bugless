'use client'

import { MotionDiv } from '@/components/motion'
import { SectionDescription } from '../shared/section-description'
import { SectionHeading } from '../shared/section-heading'

interface FeaturesHeaderProps {
  isInView: boolean
}

export function FeaturesHeader({ isInView }: FeaturesHeaderProps) {
  return (
    <MotionDiv isInView={isInView} className='mb-12 text-center'>
      <span className='mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary'>
        Features
      </span>
      <SectionHeading>Catch bugs before they ship</SectionHeading>
      <SectionDescription>
        Everything you need to catch bugs before they catch you.
      </SectionDescription>
    </MotionDiv>
  )
}
