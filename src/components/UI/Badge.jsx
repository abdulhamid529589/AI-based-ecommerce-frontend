import React from 'react'
import { motion } from 'framer-motion'

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  animated = false,
  icon: Icon,
}) => {
  const variantStyles = {
    default: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    accent:
      'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30',
    outline: 'border-2 border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
    ghost: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  }

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-sm',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  const animationVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } },
  }

  const Component = animated ? motion.span : 'span'

  return (
    <Component
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold
        transition-all duration-200 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...(animated && {
        variants: animationVariants,
        initial: 'initial',
        animate: 'animate',
        exit: 'exit',
      })}
    >
      {Icon && <Icon className="w-3 h-3" />}
      <span>{children}</span>
    </Component>
  )
}

export default Badge
