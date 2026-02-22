import React, { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react'

const Toast = ({ type = 'info', title, message, isVisible, onClose, duration = 4000, action }) => {
  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const bgColorMap = {
    success: 'bg-green-50 dark:bg-green-900/20',
    error: 'bg-red-50 dark:bg-red-900/20',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20',
    info: 'bg-blue-50 dark:bg-blue-900/20',
  }

  const borderColorMap = {
    success: 'border-green-200 dark:border-green-800',
    error: 'border-red-200 dark:border-red-800',
    warning: 'border-yellow-200 dark:border-yellow-800',
    info: 'border-blue-200 dark:border-blue-800',
  }

  const iconColorMap = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
  }

  const Icon = iconMap[type]

  React.useEffect(() => {
    if (isVisible && duration) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const toastVariants = {
    hidden: {
      opacity: 0,
      x: 100,
      y: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed top-4 right-4 max-w-sm w-full rounded-lg border
            ${bgColorMap[type]} ${borderColorMap[type]}
            shadow-lg overflow-hidden z-50`}
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColorMap[type]}`} />

              <div className="flex-1">
                {title && (
                  <h3
                    className={`font-semibold ${
                      type === 'success'
                        ? 'text-green-900 dark:text-green-300'
                        : type === 'error'
                          ? 'text-red-900 dark:text-red-300'
                          : type === 'warning'
                            ? 'text-yellow-900 dark:text-yellow-300'
                            : 'text-blue-900 dark:text-blue-300'
                    }`}
                  >
                    {title}
                  </h3>
                )}

                {message && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{message}</p>
                )}

                {action && (
                  <motion.button
                    onClick={action.onClick}
                    className="text-sm font-medium mt-2 underline hover:no-underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {action.label}
                  </motion.button>
                )}
              </div>

              <motion.button
                onClick={onClose}
                className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-700
                  dark:text-gray-400 dark:hover:text-gray-300 rounded-md
                  hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Progress bar */}
          {duration && (
            <motion.div
              className={`h-1 ${
                type === 'success'
                  ? 'bg-green-500'
                  : type === 'error'
                    ? 'bg-red-500'
                    : type === 'warning'
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
              }`}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              style={{ transformOrigin: 'left' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
