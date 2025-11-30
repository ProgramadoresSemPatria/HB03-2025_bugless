import { COMPARISON_DATA, COMPARISON_PRODUCTS } from '@/lib/constants'
import { motion } from 'framer-motion'
import { ComparisonFeatureIcon } from './comparison-feature-icon'

export function ComparisonCards() {
  return (
    <div className='space-y-4 md:hidden'>
      {COMPARISON_DATA.map((row, index) => (
        <motion.div
          key={row.feature}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 * index }}
          className='overflow-hidden rounded-lg border border-border/50 bg-card/30 p-4 backdrop-blur-sm'
        >
          <div className='mb-3 text-base font-semibold'>{row.feature}</div>
          <div className='space-y-2'>
            {COMPARISON_PRODUCTS.map((product) => (
              <div
                key={product.key}
                className='flex items-center justify-between'
              >
                <span
                  className={
                    product.isPrimary
                      ? 'font-medium text-primary'
                      : 'text-muted-foreground'
                  }
                >
                  {product.name}
                </span>
                <ComparisonFeatureIcon
                  checked={row[product.key as keyof typeof row] as boolean}
                  isPrimary={product.isPrimary}
                />
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
