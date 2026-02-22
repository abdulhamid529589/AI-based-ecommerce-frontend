import React from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * Mobile Product Detail Specifications Component
 * Shows product specs in a mobile-friendly collapsible format
 */
const MobileProductSpecs = ({ productDetails }) => {
  const [openSpecs, setOpenSpecs] = React.useState({
    general: true,
    technical: false,
    warranty: false,
  })

  const toggleSpec = (section) => {
    setOpenSpecs((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  if (!productDetails) return null

  return (
    <div className="space-y-2">
      {/* General Specifications */}
      <div className="collapsible-section open">
        <div className="collapsible-header" onClick={() => toggleSpec('general')}>
          <span className="font-semibold">General Info</span>
          <ChevronDown className={`collapsible-icon ${openSpecs.general ? 'open' : ''}`} />
        </div>
        {openSpecs.general && (
          <div className="collapsible-content">
            <div className="space-y-3">
              {productDetails.category && (
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Category</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {productDetails.category}
                  </span>
                </div>
              )}
              {productDetails.brand && (
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Brand</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {productDetails.brand}
                  </span>
                </div>
              )}
              {productDetails.sku && (
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">SKU</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {productDetails.sku}
                  </span>
                </div>
              )}
              {productDetails.warranty && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">Warranty</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {productDetails.warranty}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Technical Specifications */}
      {productDetails.specifications && Object.keys(productDetails.specifications).length > 0 && (
        <div className="collapsible-section">
          <div className="collapsible-header" onClick={() => toggleSpec('technical')}>
            <span className="font-semibold">Technical Specs</span>
            <ChevronDown className={`collapsible-icon ${openSpecs.technical ? 'open' : ''}`} />
          </div>
          {openSpecs.technical && (
            <div className="collapsible-content">
              <div className="space-y-2">
                {Object.entries(productDetails.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700"
                  >
                    <span className="text-gray-600 dark:text-gray-400 capitalize">{key}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Warranty & Support */}
      <div className="collapsible-section">
        <div className="collapsible-header" onClick={() => toggleSpec('warranty')}>
          <span className="font-semibold">Warranty & Support</span>
          <ChevronDown className={`collapsible-icon ${openSpecs.warranty ? 'open' : ''}`} />
        </div>
        {openSpecs.warranty && (
          <div className="collapsible-content">
            <div className="space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                ✅ 30-day money-back guarantee
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                ✅ Free shipping on orders over ৳999
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">✅ 24/7 customer support</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                ✅ 1-year manufacturer warranty
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileProductSpecs
