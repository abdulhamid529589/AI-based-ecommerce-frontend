import React from 'react'
import PremiumHero from '../components/Home/PremiumHero'
import CategoryGrid from '../components/Home/CategoryGrid'
import ProductSlider from '../components/Home/ProductSlider'
import FeatureSection from '../components/Home/FeatureSection'
import NewsletterSection from '../components/Home/NewsletterSection'
import RecentlyViewed from '../components/Products/RecentlyViewed'
import { useSelector, shallowEqual } from 'react-redux'

const Index = () => {
  const { topRatedProducts, newProducts } = useSelector((state) => state.product, shallowEqual)
  return (
    <div className="min-h-screen">
      <PremiumHero />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8">
        <CategoryGrid />
        <RecentlyViewed />
        {newProducts.length > 0 && <ProductSlider title="New Arrivals" products={newProducts} />}
        {topRatedProducts.length > 0 && (
          <ProductSlider title="Top Rated Products" products={topRatedProducts} />
        )}
        <FeatureSection />
        <NewsletterSection />
      </div>
    </div>
  )
}

export default Index
