import { motion } from 'framer-motion'

export function AnimatedLines({ isInView }: { isInView: boolean }) {
  const lineVariants = {
    hidden: { width: 0 },
    visible: (i: number) => ({
      width: ['0%', '100%', '0%'],
      transition: {
        times: [0, 0.5, 1],
        duration: 5,
        delay: i * 0.35,
        repeat: Infinity,
      },
    }),
  }

  return (
    <>
      {/* Lines left */}
      <div className='absolute top-1/2 left-0 hidden h-[400px] w-[250px] -translate-y-1/2 flex-col justify-between md:flex'>
        {[...Array(6).keys()].map((i) => (
          <motion.div
            key={i}
            custom={i}
            initial='hidden'
            animate={isInView ? 'visible' : 'hidden'}
            variants={lineVariants}
            className='h-0.5 w-full bg-linear-to-r from-primary to-transparent'
          />
        ))}
      </div>
      {/* Lines right */}
      <div className='absolute top-1/2 right-0 hidden h-[400px] w-[250px] -translate-y-1/2 flex-col items-end justify-between md:flex'>
        {[...Array(6).keys()].map((i) => (
          <motion.div
            key={i}
            custom={i}
            initial='hidden'
            animate={isInView ? 'visible' : 'hidden'}
            variants={lineVariants}
            className='h-0.5 w-full bg-linear-to-l from-primary to-transparent'
          />
        ))}
      </div>
    </>
  )
}
