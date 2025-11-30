import { COMPARISON_DATA, COMPARISON_PRODUCTS } from '@/lib/constants'
import { motion } from 'framer-motion'
import { ComparisonFeatureIcon } from './comparison-feature-icon'

export function ComparisonTable() {
  return (
    <motion.div className='hidden md:block'>
      <div className='grid grid-cols-4 items-center gap-4 p-6'>
        <div className='text-lg font-semibold'>Feature</div>
        {COMPARISON_PRODUCTS.map((product) => (
          <div key={product.key} className='text-center'>
            {product.isPrimary ? (
              <div className='inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2'>
                <span className='font-bold text-primary'>{product.name}</span>
              </div>
            ) : (
              <span className='font-semibold text-muted-foreground'>
                {product.name}
              </span>
            )}
          </div>
        ))}
      </div>

      {COMPARISON_DATA.map((row, index) => (
        <motion.div
          key={row.feature}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 * index }}
          className='grid grid-cols-4 gap-4 border-b p-6 last:border-b-0'
        >
          <div className='font-medium'>{row.feature}</div>
          {COMPARISON_PRODUCTS.map((product) => (
            <div key={product.key} className='flex justify-center'>
              <ComparisonFeatureIcon
                checked={row[product.key as keyof typeof row] as boolean}
                isPrimary={product.isPrimary}
              />
            </div>
          ))}
        </motion.div>
      ))}
    </motion.div>
  )
}
