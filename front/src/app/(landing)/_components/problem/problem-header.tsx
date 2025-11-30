import { MotionDiv } from '@/components/motion'
import { SectionDescription } from '../shared/section-description'
import { SectionHeading } from '../shared/section-heading'

export function ProblemHeader({ isInView }: { isInView: boolean }) {
  return (
    <MotionDiv isInView={isInView} className='pb-16'>
      <SectionHeading>
        Stop shipping bugs. Start shipping confidence.
      </SectionHeading>
      <SectionDescription className='mx-auto max-w-2xl text-lg text-text-secondary'>
        Every developer knows the frustration: code that looked perfect breaks
        in production. Manual reviews miss edge cases. Static linters throw
        false positives. You need a smarter way to catch problems before they
        become incidents.
      </SectionDescription>
    </MotionDiv>
  )
}
