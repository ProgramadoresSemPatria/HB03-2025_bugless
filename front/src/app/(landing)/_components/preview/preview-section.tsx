'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Container } from '../shared/container'

export function PreviewSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.3], [0.6, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  return (
    <section
      ref={containerRef}
      className='relative bg-background lg:-mt-16 lg:min-h-[150vh]'
    >
      <div className='sticky top-0 z-10 flex h-[50vh] items-center justify-center sm:h-screen'>
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          style={{
            scale,
            opacity,
          }}
          className='w-full'
        >
          <Container className='max-w-7xl px-4'>
            <div className='aspect-video w-full overflow-hidden rounded-xl shadow-2xl'>
              <video
                className='size-full object-fill'
                autoPlay
                loop
                muted
                playsInline
                preload='metadata'
              >
                <source
                  src='assets/videos/bugless-preview.mp4'
                  type='video/mp4'
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </Container>
        </motion.div>
      </div>
    </section>
  )
}
