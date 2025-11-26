'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'

export const MotionDiv = forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  (props, ref) => <motion.div ref={ref} {...props} />,
)
MotionDiv.displayName = 'MotionDiv'

export const MotionSection = forwardRef<
  HTMLElement,
  HTMLMotionProps<'section'>
>((props, ref) => <motion.section ref={ref} {...props} />)
MotionSection.displayName = 'MotionSection'

export const MotionSpan = forwardRef<HTMLSpanElement, HTMLMotionProps<'span'>>(
  (props, ref) => <motion.span ref={ref} {...props} />,
)
MotionSpan.displayName = 'MotionSpan'

export const MotionHeader = forwardRef<HTMLElement, HTMLMotionProps<'header'>>(
  (props, ref) => <motion.header ref={ref} {...props} />,
)
MotionHeader.displayName = 'MotionHeader'

export const MotionMain = forwardRef<HTMLElement, HTMLMotionProps<'main'>>(
  (props, ref) => <motion.main ref={ref} {...props} />,
)
MotionMain.displayName = 'MotionMain'

export const MotionArticle = forwardRef<
  HTMLElement,
  HTMLMotionProps<'article'>
>((props, ref) => <motion.article ref={ref} {...props} />)
MotionArticle.displayName = 'MotionArticle'

export const MotionNav = forwardRef<HTMLElement, HTMLMotionProps<'nav'>>(
  (props, ref) => <motion.nav ref={ref} {...props} />,
)
MotionNav.displayName = 'MotionNav'

export const MotionUl = forwardRef<HTMLUListElement, HTMLMotionProps<'ul'>>(
  (props, ref) => <motion.ul ref={ref} {...props} />,
)
MotionUl.displayName = 'MotionUl'

export const MotionLi = forwardRef<HTMLLIElement, HTMLMotionProps<'li'>>(
  (props, ref) => <motion.li ref={ref} {...props} />,
)
MotionLi.displayName = 'MotionLi'

export const MotionButton = forwardRef<
  HTMLButtonElement,
  HTMLMotionProps<'button'>
>((props, ref) => <motion.button ref={ref} {...props} />)
MotionButton.displayName = 'MotionButton'

export const MotionA = forwardRef<HTMLAnchorElement, HTMLMotionProps<'a'>>(
  (props, ref) => <motion.a ref={ref} {...props} />,
)
MotionA.displayName = 'MotionA'
