/**
 * UI Components Index
 * Central export point for all UI components
 * Import pattern: import { Button, Card, Input } from '@/components/UI'
 */

export { default as Button } from './Button'
export { default as Badge } from './Badge'
export { default as Dropdown } from './Dropdown'
export { default as FloatingInput } from './FloatingInput'
export { default as Modal } from './Modal'
export { default as PremiumCard } from './PremiumCard'
export { default as SkeletonLoader } from './SkeletonLoader'
export { default as Toast } from './Toast'

// Export animation utilities
export {
  pageVariants,
  containerVariants,
  itemVariants,
  cardHoverVariants,
  buttonVariants,
  slideInVariants,
  fadeInUpVariants,
  staggerContainerVariants,
  scaleInVariants,
  rotateInVariants,
  pulseVariants,
  shimmerVariants,
  bounceVariants,
  floatVariants,
  createCombinedVariants,
  delayChildren,
} from '@/animations/pageTransitions'
