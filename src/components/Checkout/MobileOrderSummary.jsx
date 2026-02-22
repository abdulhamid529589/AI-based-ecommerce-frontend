import React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

/**
 * Mobile-Optimized Order Summary Component
 * Features:
 * - Collapsible cart items on mobile
 * - Clear pricing breakdown
 * - Responsive spacing
 * - Touch-friendly interactions
 */

const MobileOrderSummary = ({ cartItems, subtotal, shipping, tax, total }) => {
  const [showItems, setShowItems] = React.useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Order Summary</h2>

      {/* Expandable Cart Items - Mobile Only */}
      <div className="sm:hidden">
        <button
          onClick={() => setShowItems(!showItems)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
        >
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ৳{subtotal.toLocaleString('en-BD', { maximumFractionDigits: 0 })}
            </p>
          </div>
          {showItems ? (
            <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        {/* Cart Items List - Expanded */}
        {showItems && (
          <div className="mt-3 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-8 h-8 rounded object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-gray-900 dark:text-white font-medium truncate">
                      {item.name}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">x{item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white flex-shrink-0 ml-2">
                  ৳
                  {(item.price * item.quantity).toLocaleString('en-BD', {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Cart Items - Always Visible */}
      <div className="hidden sm:block space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 flex-1">
              <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-medium line-clamp-1">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">x{item.quantity}</p>
              </div>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">
              ৳{(item.price * item.quantity).toLocaleString('en-BD', { maximumFractionDigits: 0 })}
            </p>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="text-gray-900 dark:text-white font-semibold">
            ৳{subtotal.toLocaleString('en-BD', { maximumFractionDigits: 0 })}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Shipping</span>
          <span className="text-gray-900 dark:text-white font-semibold">
            {shipping === 0 ? (
              <span className="text-green-600 dark:text-green-400">Free</span>
            ) : (
              `৳${shipping.toLocaleString('en-BD', { maximumFractionDigits: 0 })}`
            )}
          </span>
        </div>

        {/* Tax */}
        {tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tax (5%)</span>
            <span className="text-gray-900 dark:text-white font-semibold">
              ৳{tax.toLocaleString('en-BD', { maximumFractionDigits: 0 })}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between text-base sm:text-lg font-bold bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg">
          <span className="text-gray-900 dark:text-white">Total</span>
          <span className="text-blue-600 dark:text-blue-400">
            ৳{total.toLocaleString('en-BD', { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>

      {/* Money Back Guarantee */}
      <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-3">
        <p className="text-xs text-green-900 dark:text-green-300 text-center">
          <strong>✓ 30-Day Money Back Guarantee</strong>
          <br />
          Not satisfied? Full refund available within 30 days.
        </p>
      </div>
    </div>
  )
}

export default MobileOrderSummary
