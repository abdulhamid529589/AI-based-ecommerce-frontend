import React from 'react'
import { Loader2 } from 'lucide-react'

// Premium Button Components

/**
 * Primary Button - Main Call to Action
 * @param {string} variant - 'solid' | 'outline' | 'ghost'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} loading - Show loading state
 */
export const PrimaryButton = ({
  children,
  variant = 'solid',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 focus-glow'
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]',
  }

  const variantStyles = {
    solid: 'bg-gradient-primary text-white hover:shadow-hover active:scale-95 hover-lift ripple',
    outline:
      'border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 active:scale-95',
    ghost:
      'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 active:scale-95',
  }

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className} ${
        loading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
      {children}
    </button>
  )
}

/**
 * Secondary Button
 */
export const SecondaryButton = ({ children, variant = 'outline', size = 'md', ...props }) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 focus-glow'
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]',
  }

  const variantStyles = {
    solid:
      'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:shadow-soft active:scale-95',
    outline:
      'border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95',
    ghost:
      'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95',
  }

  return (
    <button className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`} {...props}>
      {children}
    </button>
  )
}

/**
 * Danger Button
 */
export const DangerButton = ({ children, size = 'md', variant = 'solid', ...props }) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 focus-glow'
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]',
  }

  const variantStyles = {
    solid: 'bg-gradient-danger text-white hover:shadow-hover active:scale-95',
    outline:
      'border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 active:scale-95',
    ghost: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950 active:scale-95',
  }

  return (
    <button className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`} {...props}>
      {children}
    </button>
  )
}

/**
 * Success Button
 */
export const SuccessButton = ({ children, size = 'md', variant = 'solid', ...props }) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 focus-glow'
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]',
  }

  const variantStyles = {
    solid: 'bg-gradient-success text-white hover:shadow-hover active:scale-95',
    outline:
      'border-2 border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 active:scale-95',
    ghost:
      'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 active:scale-95',
  }

  return (
    <button className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`} {...props}>
      {children}
    </button>
  )
}

// Premium Badge Components

export const Badge = ({ children, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200',
    success: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200',
    danger: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200',
    secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200',
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${variants[variant]}`}
      {...props}
    >
      {children}
    </span>
  )
}

// Premium Card Component

export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={`bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-4 sm:p-6 transition-all duration-300 ${
        hover ? 'hover-lift hover:shadow-hover' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// Premium Input Component

export const PremiumInput = ({ label, error, helperText, icon: Icon, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        )}
        <input
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 sm:py-3 rounded-lg border-2 transition-all duration-300 focus-glow bg-gray-50 dark:bg-gray-700 dark:text-white ${
            error
              ? 'border-red-500 focus:border-red-600'
              : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
          }`}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-semibold text-red-500 mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helperText}</p>
      )}
    </div>
  )
}

// Premium Loading Skeleton

export const SkeletonLoader = ({ count = 1, variant = 'card' }) => {
  if (variant === 'card') {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 skeleton-shimmer" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 skeleton-shimmer" />
      ))}
    </div>
  )
}

// Premium Alert Component

export const Alert = ({ variant = 'info', title, children, dismissible = false, onDismiss }) => {
  const [visible, setVisible] = React.useState(true)

  const variants = {
    info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    success:
      'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    warning:
      'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
    danger:
      'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  }

  if (!visible) return null

  return (
    <div className={`rounded-lg border-2 p-4 animate-slide-down ${variants[variant]}`}>
      <div className="flex justify-between items-start">
        <div>
          {title && <h4 className="font-bold mb-1">{title}</h4>}
          <p className="text-sm">{children}</p>
        </div>
        {dismissible && (
          <button
            onClick={() => {
              setVisible(false)
              onDismiss?.()
            }}
            className="text-lg font-bold opacity-70 hover:opacity-100"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

// Premium Tag/Chip Component

export const Chip = ({ label, icon: Icon, onDelete, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200',
    secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200',
    success: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200',
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-soft ${variants[variant]}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
      {onDelete && (
        <button onClick={onDelete} className="ml-1 hover:opacity-70 transition-opacity">
          ×
        </button>
      )}
    </div>
  )
}

export default {
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  SuccessButton,
  Badge,
  Card,
  PremiumInput,
  SkeletonLoader,
  Alert,
  Chip,
}
