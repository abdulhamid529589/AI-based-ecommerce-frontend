import React from 'react'
import { ShoppingCart, TrendingUp } from 'lucide-react'

/**
 * CROSS-SELL & UPSELL COMPONENTS
 * Marketing strategy: Increase Average Order Value (AOV)
 * - Frequently bought together (bundle recommendation)
 * - Complete the look (styled bundles)
 * - Customers also viewed (trading up)
 */

export const FrequentlyBoughtTogether = ({ mainProduct, bundleProducts = [], onAddBundle }) => {
  if (!bundleProducts.length) return null

  const bundleTotal = bundleProducts.reduce((sum, p) => sum + p.price, 0) + mainProduct.price
  const bundleSavings = bundleProducts.reduce((sum, p) => sum + (p.originalPrice - p.price), 0)
  const savingPercent = Math.round((bundleSavings / bundleTotal) * 100)

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
        ফ্রিকোয়েন্টলি বট টুগেদার
      </h3>

      <div className="space-y-4">
        {/* Bundle Items */}
        <div className="space-y-3">
          {/* Main Product */}
          <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
            <input type="checkbox" defaultChecked disabled className="w-5 h-5" />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">{mainProduct.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ৳{mainProduct.price?.toLocaleString('bn-BD')}
              </p>
            </div>
          </div>

          {/* Bundle Products */}
          {bundleProducts.map((product) => (
            <div key={product.id} className="flex items-center gap-3 p-3 bg-card rounded-lg">
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    ৳{product.price?.toLocaleString('bn-BD')}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through">
                      ৳{product.originalPrice?.toLocaleString('bn-BD')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bundle Summary */}
        <div className="bg-card rounded-lg p-4 border-2 border-blue-300 dark:border-blue-600">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">মোট মূল্য:</span>
              <span className="font-bold text-gray-900 dark:text-white">
                ৳{bundleTotal?.toLocaleString('bn-BD')}
              </span>
            </div>
            {savingPercent > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>সঞ্চয়:</span>
                <span className="font-bold">
                  ৳{bundleSavings?.toLocaleString('bn-BD')} ({savingPercent}%)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onAddBundle}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          <ShoppingCart size={20} />
          এই বান্ডেল কার্টে যোগ করুন
        </button>

        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          একসাথে কিনলে সর্বোচ্চ সঞ্চয় পাবেন
        </p>
      </div>
    </div>
  )
}

export const CompleteTheLook = ({ styleProducts = [], onAddProduct }) => {
  if (!styleProducts.length) return null

  const totalSavings = styleProducts.reduce((sum, p) => sum + (p.originalPrice - p.price), 0)

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">✨ লুক সম্পূর্ণ করুন</h3>

      <div className="space-y-4">
        {/* Curated Style Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {styleProducts.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    -{product.discount}%
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {product.name}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    ৳{product.price?.toLocaleString('bn-BD')}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through">
                      ৳{product.originalPrice?.toLocaleString('bn-BD')}
                    </span>
                  )}
                </div>

                {/* Add Button */}
                <button
                  onClick={() => onAddProduct(product)}
                  className="w-full mt-2 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold py-1 rounded transition"
                >
                  যোগ করুন
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-card rounded-lg p-3 space-y-2 text-sm">
          <p className="text-gray-700 dark:text-gray-300">
            📸 <strong>স্টাইল কিউরেটেড:</strong> ফ্যাশন বিশেষজ্ঞদের দ্বারা নির্বাচিত
          </p>
          {totalSavings > 0 && (
            <p className="text-green-600 dark:text-green-400 font-bold">
              💰 সবগুলি কিনলে ৳{totalSavings?.toLocaleString('bn-BD')} সঞ্চয় করুন
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export const CustomersAlsoViewed = ({ products = [], onProductClick }) => {
  if (!products.length) return null

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">আরও কাস্টমাররা দেখেছেন</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {products.slice(0, 4).map((product) => (
          <div
            key={product.id}
            onClick={() => onProductClick(product.id)}
            className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
          >
            {/* Image */}
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              {product.discount && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  -{product.discount}%
                </div>
              )}

              {/* Price Comparison Badge */}
              <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                আপগ্রেড করুন
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {product.name}
              </p>

              {/* Rating */}
              {product.rating && (
                <p className="text-xs text-yellow-500 mt-1">
                  ⭐ {product.rating.toFixed(1)} ({product.reviewCount || 0})
                </p>
              )}

              {/* Price */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ৳{product.price?.toLocaleString('bn-BD')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    ৳{product.originalPrice?.toLocaleString('bn-BD')}
                  </span>
                )}
              </div>

              {/* Compare */}
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {product.originalPrice > 5000 ? '🏆 প্রিমিয়াম অপশন' : '💰 বাজেট অপশন'}
              </p>

              <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded transition">
                দেখুন
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FrequentlyBoughtTogether
