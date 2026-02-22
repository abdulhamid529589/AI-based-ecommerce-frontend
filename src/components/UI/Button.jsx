import React from 'react'
import { motion } from 'framer-motion'

/**
 * Enhanced Button Component with Animations
 * Supports multiple variants, sizes, and states
 * Includes hover effects, loading states, and smooth transitions
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  fullWidth = false,
  icon: Icon = null,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles =
    'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 whitespace-nowrap'

  const variants = {
    primary:
      'bg-gradient-primary text-white hover:shadow-lg hover:shadow-blue-500/50 active:scale-95 focus:ring-blue-500/20 dark:focus:ring-offset-gray-900',
    secondary:
      'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95',
    accent:
      'bg-gradient-accent text-white hover:shadow-lg hover:shadow-orange-500/50 active:scale-95 focus:ring-orange-500/20',
    outlined:
      'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 active:scale-95',
    ghost:
      'text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 active:scale-95',
    danger:
      'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/50 active:scale-95',
    success:
      'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/50 active:scale-95',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  }

  const buttonClass = `${baseStyles} ${variants[variant]} ${sizes[size]} ${
    fullWidth ? 'w-full' : ''
  } ${className}`

  const content = (
    <>
      {Icon && iconPosition === 'left' && !isLoading && <Icon size={20} />}
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{children}</span>
        </>
      ) : (
        children
      )}
      {Icon && iconPosition === 'right' && !isLoading && <Icon size={20} />}
    </>
  )

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      className={buttonClass}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {content}
    </motion.button>
  )
}

export default Button
