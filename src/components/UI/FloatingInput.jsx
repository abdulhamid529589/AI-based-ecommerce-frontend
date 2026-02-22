import React, { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * FloatingInput Component
 * Advanced input with animated floating labels
 * Includes validation feedback and smooth transitions
 */
const FloatingInput = ({
  label,
  type = 'text',
  error = null,
  value,
  onChange,
  onFocus,
  onBlur,
  helperText = null,
  icon: Icon = null,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = (e) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e) => {
    setIsFocused(value ? true : false)
    onBlur?.(e)
  }

  const hasValue = value && value.toString().length > 0
  const hasError = error && error.length > 0

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {/* Input Container */}
      <motion.div
        className={`relative flex items-center px-4 py-3 border-b-2 transition-all ${
          hasError
            ? 'border-red-500 focus-within:border-red-600'
            : isFocused
              ? 'border-primary-500'
              : 'border-gray-300 dark:border-gray-600'
        }`}
        animate={{
          backgroundColor: isFocused || hasValue ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
        }}
      >
        {/* Icon */}
        {Icon && (
          <motion.div
            className={`mr-2 transition-colors ${
              isFocused || hasValue ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'
            }`}
            animate={{
              scale: isFocused ? 1.1 : 1,
            }}
          >
            <Icon size={18} />
          </motion.div>
        )}

        {/* Input Field */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-transparent transition-colors ${className}`}
          placeholder={label}
          {...props}
        />
      </motion.div>

      {/* Floating Label */}
      <motion.label
        initial={{ y: 20, opacity: 0 }}
        animate={{
          y: isFocused || hasValue ? -25 : 0,
          opacity: isFocused || hasValue ? 1 : 0.7,
        }}
        transition={{ duration: 0.2 }}
        className={`absolute left-4 text-sm font-medium cursor-text ${
          hasError
            ? 'text-red-500'
            : isFocused || hasValue
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {label}
      </motion.label>

      {/* Error Message */}
      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 text-sm mt-2 flex items-center gap-1"
        >
          <span>⚠️</span>
          {error}
        </motion.p>
      )}

      {/* Helper Text */}
      {helperText && !hasError && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 dark:text-gray-400 text-xs mt-2"
        >
          {helperText}
        </motion.p>
      )}
    </div>
  )
}

export default FloatingInput
