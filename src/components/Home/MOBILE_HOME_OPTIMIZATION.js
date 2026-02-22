/**
 * Mobile-First Home Page Optimization Guide
 *
 * This file documents best practices for mobile home page optimization
 * to maximize engagement for mobile-first users
 */

/*
HOME PAGE MOBILE SECTIONS
========================

1. HERO SECTION (Above Fold)
   - Full viewport width and height on mobile
   - Text centered and readable at small sizes
   - CTA button large and thumb-reachable
   - No content cut off in viewport

2. CATEGORY GRID
   - 2 columns on mobile (width: 160-180px each)
   - 3 columns on tablet
   - 4 columns on desktop
   - Touch-friendly spacing (gap: 12px mobile)

3. PRODUCT SLIDERS
   - Horizontal scroll on mobile
   - Carousel indicators visible
   - Touch-swipe optimized
   - Next/Prev buttons on desktop only

4. FEATURED SECTION
   - Image-first design on mobile
   - Full-width cards
   - Minimal text
   - CTA buttons large and clear

5. NEWSLETTER SECTION
   - Single column input on mobile
   - Full-width button
   - Large touch targets

SPACING SYSTEM
==============

Mobile Container Padding:  16px (4px safe margin)
Mobile Gap Between Items:  12px
Mobile Section Margin:     20px

Tablet Container Padding:  24px
Tablet Gap:                16px
Tablet Section Margin:     24px

Desktop Container Padding: 32px
Desktop Gap:               20px
Desktop Section Margin:    32px
*/

// CSS Classes for Home Page Mobile
const mobileHomeClasses = {
  // Hero section
  heroSection: 'min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8',
  heroTitle: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center',
  heroSubtitle: 'text-sm sm:text-base md:text-lg lg:text-xl text-center mt-4',
  heroCTA:
    'mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg font-bold min-h-[48px]',

  // Category grid
  categoryGrid: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6',
  categoryCard:
    'flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition',
  categoryImage: 'w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded-lg',
  categoryLabel: 'text-xs sm:text-sm font-semibold text-center line-clamp-2',

  // Product slider
  productSlider: 'overflow-x-auto scrollbar-hide -mx-4 sm:mx-0',
  sliderContent: 'flex gap-3 sm:gap-4 md:gap-6 px-4 sm:px-0 pb-4',
  sliderItem: 'flex-shrink-0 w-[calc(50vw-12px)] sm:w-48 md:w-56 lg:w-64',

  // Feature section
  featureGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8',
  featureCard: 'rounded-lg overflow-hidden shadow-soft hover:shadow-lg transition',
  featureImage: 'w-full h-40 sm:h-48 md:h-56 object-cover',
  featureContent: 'p-4 sm:p-6',

  // Newsletter section
  newsletterForm: 'max-w-md mx-auto flex flex-col sm:flex-row gap-2 sm:gap-3',
  newsletterInput:
    'flex-1 px-4 py-3 sm:py-4 rounded-lg border-2 border-gray-300 dark:border-gray-700 min-h-[48px]',
  newsletterButton:
    'px-6 py-3 sm:py-4 bg-blue-600 text-white rounded-lg font-bold min-h-[48px] whitespace-nowrap',
}

// Mobile Optimization Checklist for Home Page
const mobileOptimizationChecklist = {
  layout: [
    'Hero section responsive text sizes',
    'Product grid 2 columns on mobile',
    'Category icons properly sized',
    'Slider scrollable on mobile',
    'Newsletter form single column',
  ],
  images: [
    'Hero image optimized for mobile',
    'Category icons small size',
    'Product images proper aspect ratio',
    'Lazy loading implemented',
    'WebP format with fallback',
  ],
  interaction: [
    'All buttons 44x44px minimum',
    'Touch feedback on interactions',
    'Smooth scroll transitions',
    'Mobile menu hamburger',
    'Tap targets well-spaced',
  ],
  performance: [
    'Images lazy loaded',
    'CSS minified',
    'JavaScript code split',
    'Fonts optimized',
    'No layout shifts',
  ],
  accessibility: [
    'Color contrast meets WCAG AA',
    'Font sizes minimum 12px',
    'Focus states visible',
    'Semantic HTML',
    'Alt text for images',
  ],
}

// Component Example Structure
const mobileHomeExample = {
  heroSection: `
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white">
        Welcome to Bedtex
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-center text-gray-600 dark:text-gray-400 mt-4">
        Premium bedding & textile products
      </p>
      <button className="mt-8 px-6 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg min-h-[48px] transition active:scale-95">
        Shop Now
      </button>
    </div>
  `,

  categoryGrid: `
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-4">
      {categories.map(category => (
        <div key={category.id} className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
          <img src={category.icon} alt={category.name} className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded-lg" />
          <p className="text-xs sm:text-sm font-semibold text-center line-clamp-2">{category.name}</p>
        </div>
      ))}
    </div>
  `,

  productSlider: `
    <div className="overflow-x-auto scrollbar-hide -mx-4">
      <div className="flex gap-3 sm:gap-4 md:gap-6 px-4 pb-4">
        {products.map(product => (
          <div key={product.id} className="flex-shrink-0 w-[calc(50vw-12px)] sm:w-48 md:w-56 lg:w-64">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  `,

  newsletterSection: `
    <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 sm:gap-3 px-4">
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 px-4 py-3 sm:py-4 rounded-lg border-2 min-h-[48px]"
        required
      />
      <button
        type="submit"
        className="px-6 py-3 sm:py-4 bg-blue-600 text-white rounded-lg font-bold min-h-[48px] whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  `,
}

export { mobileHomeClasses, mobileOptimizationChecklist, mobileHomeExample }
