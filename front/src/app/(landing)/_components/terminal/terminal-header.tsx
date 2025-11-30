import { MotionDiv } from '@/components/motion'
import { SectionDescription } from '../shared/section-description'
import { SectionHeading } from '../shared/section-heading'

export function TerminalHeader({ isInView }: { isInView: boolean }) {
  return (
    <MotionDiv isInView={isInView}>
      <SectionHeading>Built for the terminal</SectionHeading>
      <SectionDescription>
        4 review modes that integrate with your existing workflow. No context
        switching, no web UI required.
      </SectionDescription>
    </MotionDiv>
  )
}
