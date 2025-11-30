import { MotionDiv } from '@/components/motion'
import { SectionDescription } from '../shared/section-description'
import { SectionHeading } from '../shared/section-heading'

export function PricingHeader({ isInView }: { isInView: boolean }) {
  return (
    <MotionDiv isInView={isInView}>
      <SectionHeading>Simple, transparent pricing</SectionHeading>
      <SectionDescription>
        Start free, upgrade when you need more. No hidden fees, no surprises.
      </SectionDescription>
    </MotionDiv>
  )
}
