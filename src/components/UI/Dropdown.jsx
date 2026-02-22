import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const Dropdown = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  icon: Icon,
  variant = 'default',
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)
  const selectedLabel = selectedOption?.label || placeholder

  const sizeStyles = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-5 text-lg',
  }

  const variantStyles = {
    default: `border border-gray-300 bg-white text-gray-900
              hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
              dark:border-gray-600 dark:bg-gray-800 dark:text-white`,
    glass: `border border-white/20 bg-white/10 backdrop-blur-md text-gray-900
            hover:bg-white/20 focus:ring-1 focus:ring-white/50
            dark:text-white dark:border-white/10`,
    ghost: `border-b-2 border-gray-300 bg-transparent text-gray-900
            hover:border-blue-400 focus:border-blue-500
            dark:text-white dark:border-gray-600`,
  }

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
      },
    }),
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      <motion.button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between rounded-lg font-medium
          transition-all duration-200 ${sizeStyles[size]} ${variantStyles[variant]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}`}
        whileHover={!disabled ? { y: -1 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
          <span>{selectedLabel}</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-gray-200
              bg-white shadow-lg z-50 overflow-hidden dark:border-gray-700 dark:bg-gray-900"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="py-2 max-h-60 overflow-y-auto"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              {options.length > 0 ? (
                options.map((option, idx) => (
                  <motion.button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value)
                      setIsOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors
                      ${
                        value === option.value
                          ? 'bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/20 dark:text-blue-400'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                    variants={itemVariants}
                    custom={idx}
                  >
                    {option.label}
                  </motion.button>
                ))
              ) : (
                <div className="px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400">
                  No options available
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dropdown
