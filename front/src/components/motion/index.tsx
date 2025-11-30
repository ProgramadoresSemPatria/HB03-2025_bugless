import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export function MotionDiv({
  isInView,
  children,
  className,
}: React.ComponentProps<'div'> & { isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={cn('mb-20 text-center', className)}
    >
      {children}
    </motion.div>
  )
}
