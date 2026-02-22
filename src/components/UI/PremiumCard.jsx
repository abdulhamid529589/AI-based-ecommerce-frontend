import React from 'react'
import { motion } from 'framer-motion'

/**
 * PremiumCard Component
 * Advanced card with glassmorphism, gradients, and smooth animations
 * Supports hover effects and multiple style options
 */
const PremiumCard = ({
  children,
  className = '',
  hover = true,
  glass = false,
  gradient = false,
  gradientColor = 'primary',
  animated = true,
  onClick = null,
  ...props
}) => {
  const baseStyles = 'rounded-xl p-6 transition-all duration-300'

  const glassStyles = glass
    ? 'bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-glass'
    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-elegant'

  const gradientStyles = {
    primary: gradient ? 'bg-gradient-primary text-white' : '',
    accent: gradient ? 'bg-gradient-accent text-white' : '',
    success: gradient ? 'bg-gradient-success text-white' : '',
    purple: gradient ? 'bg-gradient-purple text-white' : '',
    pink: gradient ? 'bg-gradient-pink text-white' : '',
  }

  const hoverStyles = hover
    ? 'hover:shadow-2xl hover:shadow-primary-500/20 dark:hover:shadow-primary-500/10'
    : ''

  const motionProps = animated
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        whileHover: hover ? { y: -5, scale: 1.02 } : {},
        transition: { duration: 0.3 },
      }
    : {}

  const Component = animated ? motion.div : 'div'

  return (
    <Component
      className={`${baseStyles} ${glassStyles} ${gradientStyles[gradientColor]} ${hoverStyles} ${className}`}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
}

export default PremiumCard
