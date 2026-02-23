import React from 'react'
import PremiumHero from '../components/Home/PremiumHero'
import MobileHeroSlider from '../components/Home/MobileHeroSlider'
import CategoryGrid from '../components/Home/CategoryGrid'
import ProductSlider from '../components/Home/ProductSlider'
import FeatureSection from '../components/Home/FeatureSection'
import NewsletterSection from '../components/Home/NewsletterSection'
import RecentlyViewed from '../components/Products/RecentlyViewed'
import { useSelector, shallowEqual } from 'react-redux'

const Index = () => {
  const { topRatedProducts, newProducts } = useSelector((state) => state.product, shallowEqual)
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile amazing hero slider */}
      <div className="md:hidden">
        <MobileHeroSlider />
      </div>

      {/* Desktop premium hero */}
      <div className="hidden md:block">
        <PremiumHero />
      </div>
      <div className="w-full">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8 lg:pt-12 mx-auto max-w-7xl">
          <CategoryGrid />
          <RecentlyViewed />
          {newProducts.length > 0 && <ProductSlider title="New Arrivals" products={newProducts} />}
          {topRatedProducts.length > 0 && (
            <ProductSlider title="Top Rated Products" products={topRatedProducts} />
          )}
          <FeatureSection />
        </div>
        <NewsletterSection />
      </div>
    </div>
  )
}

export default Index
