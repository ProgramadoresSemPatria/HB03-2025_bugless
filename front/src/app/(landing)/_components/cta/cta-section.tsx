'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Container } from '../shared/container'

export function CTASection() {
  return (
    <section className='border-t py-24'>
      <Container className='text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='mb-4 text-4xl text-foreground md:text-5xl'>
            Ready to catch more bugs?
          </h2>
          <p className='mx-auto mb-8 max-w-xl text-lg text-text-secondary'>
            Get started with Bugless for free
          </p>

          <Button>Get started</Button>
        </motion.div>
      </Container>
    </section>
  )
}
