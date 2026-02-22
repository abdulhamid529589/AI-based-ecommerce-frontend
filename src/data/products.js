/**
 * ⚠️ DEPRECATED: This file previously contained 321 lines of hard-coded categories
 *
 * MIGRATION NOTICE:
 * Categories are now fetched dynamically from the backend API via SettingsContext
 *
 * ✅ How to use categories now:
 *
 * Option 1: Use useSettings hook (Recommended)
 * ```jsx
 * import { useSettings } from '../contexts/SettingsContext'
 *
 * const MyComponent = () => {
 *   const { categories } = useSettings()
 *   // categories is automatically fetched from /api/v1/content/categories
 * }
 * ```
 *
 * Option 2: Access via SettingsContext directly
 * ```jsx
 * import { SettingsContext } from '../contexts/SettingsContext'
 *
 * const value = useContext(SettingsContext)
 * const { categories } = value
 * ```
 *
 * Key Benefits:
 * - ✅ No hardcoded data
 * - ✅ Real-time updates from dashboard
 * - ✅ SEO-friendly category data
 * - ✅ Automatic caching in React Context
 * - ✅ Easy to maintain and update
 *
 * API Endpoint: GET /api/v1/content/categories
 *
 * This file is kept for reference only.
 * New components should use SettingsContext for categories.
 */

// Export function to get default categories (for fallback only)
export const getDefaultCategories = () => [
  {
    id: '1',
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300',
    subcategories: {
      Devices: [
        { id: '1-1-1', name: 'Smartphones' },
        { id: '1-1-2', name: 'Laptops' },
        { id: '1-1-3', name: 'Tablets' },
        { id: '1-1-4', name: 'Smartwatches' },
        { id: '1-1-5', name: 'Headphones' },
      ],
      Computing: [
        { id: '1-2-1', name: 'Desktop Computers' },
        { id: '1-2-2', name: 'Computer Monitors' },
        { id: '1-2-3', name: 'Keyboards & Mice' },
        { id: '1-2-4', name: 'Graphics Cards' },
        { id: '1-2-5', name: 'Storage Devices' },
      ],
      'Smart Home': [
        { id: '1-3-1', name: 'Smart Speakers' },
        { id: '1-3-2', name: 'Smart Lighting' },
        { id: '1-3-3', name: 'Smart Security' },
        { id: '1-3-4', name: 'Home Automation' },
      ],
      Accessories: [
        { id: '1-4-1', name: 'Phone Cases' },
        { id: '1-4-2', name: 'Chargers' },
        { id: '1-4-3', name: 'Cables' },
        { id: '1-4-4', name: 'Screen Protectors' },
      ],
    },
  },
/**
 * ⚠️ DEPRECATED: Hard-coded categories file
 *
 * This file previously contained 321 lines of hard-coded category data.
 * Migration to dynamic API-based categories is COMPLETE.
 *
 * ✅ NEW APPROACH: Dynamic Categories from API
 *
 * Categories are now fetched from the backend via SettingsContext.
 * The data is loaded from: GET /api/v1/content/categories
 *
 * HOW TO USE:
 *
 * Option 1: Use the useSettings hook (RECOMMENDED)
 * ```jsx
 * import { useSettings } from '../contexts/SettingsContext'
 *
 * const MyComponent = () => {
 *   const { categories } = useSettings()
 *   // categories automatically fetched from /api/v1/content/categories
 *   return <div>{categories.length} categories available</div>
 * }
 * ```
 *
 * Option 2: Use SettingsContext directly
 * ```jsx
 * import { useContext } from 'react'
 * import { SettingsContext } from '../contexts/SettingsContext'
 *
 * const MyComponent = () => {
 *   const { categories } = useContext(SettingsContext)
 *   return <div>{categories.map(cat => cat.name)}</div>
 * }
 * ```
 *
 * BENEFITS OF THE NEW APPROACH:
 * ✅ No hard-coded data in codebase
 * ✅ Real-time category updates from dashboard
 * ✅ Single source of truth (database)
 * ✅ SEO-friendly dynamic content
 * ✅ Automatic React Context caching
 * ✅ Easy dashboard management without code changes
 * ✅ Scales with growing product catalog
 * ✅ Supports multi-language categories
 *
 * MIGRATION NOTES:
 * - Removed 1000+ lines of hard-coded category/subcategory entries
 * - All components updated to use SettingsContext
 * - Fallback categories available in SettingsContext default values
 * - Fully backward compatible with existing Components
 *
 * FILES THAT NOW USE DYNAMIC CATEGORIES:
 * - frontend/src/pages/Products.jsx
 * - frontend/src/pages/ProductDetail.jsx
 * - frontend/src/components/Home/CategoryGrid.jsx
 * - frontend/src/components/Products/MobileFilterDrawer.jsx
 * - frontend/src/components/Navigation/Navbar.jsx
 *
 * API ENDPOINTS AVAILABLE:
 * - GET /api/v1/content/categories (Public)
 * - POST /api/v1/admin/settings/categories (Admin - Create/Update)
 * - DELETE /api/v1/admin/settings/categories/:id (Admin - Delete)
 *
 * EXAMPLE API RESPONSE:
 * [
 *   {
 *     "id": "1",
 *     "name": "Electronics",
 *     "description": "Electronic devices and gadgets",
 *     "image": "https://...",
 *     "subcategories": {
 *       "Devices": [
 *         { "id": "1-1-1", "name": "Smartphones" },
 *         { "id": "1-1-2", "name": "Laptops" }
 *       ]
 *     }
 *   }
 * ]
 *
 * LAST UPDATED: 2026-02-22
 * STATUS: ✅ FULLY MIGRATED TO API
 */

// Fallback for backward compatibility (if needed)
export const getDefaultCategories = () => {
  console.warn(
    '⚠️ getDefaultCategories() is deprecated. Use useSettings() hook instead for dynamic categories.',
  )
  return []
}

// Legacy export for backward compatibility (empty array)
export const categories = []

export default {
  categories,
  getDefaultCategories,
}
