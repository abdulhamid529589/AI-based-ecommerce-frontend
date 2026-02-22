import React from 'react'
import { Check } from 'lucide-react'

/**
 * Mobile-Optimized Payment Methods Component
 * Features:
 * - Full-width touch targets (44x44px minimum)
 * - Grid layout responsive to screen size
 * - Clear selection indicator
 * - Descriptive text for each method
 */

const MobilePaymentMethods = ({ methods, selectedMethod, onSelectMethod }) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelectMethod(method.id)}
            className={`relative p-4 sm:p-5 border-2 rounded-lg sm:rounded-xl transition-all duration-200 active:scale-95 min-h-[100px] sm:min-h-[110px] flex flex-col items-center justify-center text-center ${
              selectedMethod === method.id
                ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-soft'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {/* Selection Checkmark */}
            {selectedMethod === method.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Icon */}
            <span className="text-3xl sm:text-4xl mb-2">{method.icon}</span>

            {/* Name */}
            <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
              {method.name}
            </h4>

            {/* Description */}
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              {method.description}
            </p>
          </button>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-300">
          <strong>💡 Tip:</strong> All payment methods are secure and encrypted for your safety.
        </p>
      </div>
    </div>
  )
}

export default MobilePaymentMethods
