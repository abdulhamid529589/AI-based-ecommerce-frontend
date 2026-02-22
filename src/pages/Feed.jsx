import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPersonalizedFeed, fetchUserInsights } from '../store/slices/feedSlice'
import ProductCard from '../components/Products/ProductCard'
import '../styles/Feed.css'

const Feed = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { feed, insights, loading, error } = useSelector((state) => state.feed)

  useEffect(() => {
    dispatch(fetchPersonalizedFeed())
    if (user?.id) {
      dispatch(fetchUserInsights())
    }
  }, [dispatch, user?.id])

  if (loading) {
    return (
      <div className="feed-container">
        <div className="feed-loading">
          <div className="spinner">Loading your personalized feed...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="feed-container">
        <div className="feed-error">
          <p>Error loading feed: {error}</p>
          <button onClick={() => dispatch(fetchPersonalizedFeed())}>Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1>Your Personalized Feed</h1>
        <p>Curated just for you based on your preferences and browsing history</p>
      </div>

      {/* User Insights Section */}
      {insights && insights.purchaseStats && (
        <div className="insights-section">
          <h2>Your Shopping Insights</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-label">Total Orders</div>
              <div className="insight-value">{insights.purchaseStats.totalOrders || 0}</div>
            </div>
            <div className="insight-card">
              <div className="insight-label">Total Spent</div>
              <div className="insight-value">
                ${(insights.purchaseStats.totalSpent || 0).toFixed(2)}
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-label">Avg Order Value</div>
              <div className="insight-value">
                ${(insights.purchaseStats.avgOrderValue || 0).toFixed(2)}
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-label">Products Bought</div>
              <div className="insight-value">{insights.purchaseStats.uniqueProducts || 0}</div>
            </div>
          </div>

          {/* Favorite Categories */}
          {insights.favoriteCategories && insights.favoriteCategories.length > 0 && (
            <div className="favorite-categories">
              <h3>Your Favorite Categories</h3>
              <div className="category-list">
                {insights.favoriteCategories.map((cat, idx) => (
                  <div key={idx} className="category-tag">
                    <span>{cat.name}</span>
                    <small>{cat.purchases} purchases</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spending Trend */}
          {insights.spendingTrend && insights.spendingTrend.length > 0 && (
            <div className="spending-trend">
              <h3>Last 30 Days Activity</h3>
              <div className="trend-items">
                {insights.spendingTrend.slice(0, 7).map((trend, idx) => (
                  <div key={idx} className="trend-item">
                    <div className="trend-date">
                      {new Date(trend.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="trend-bar">
                      <div
                        className="trend-fill"
                        style={{
                          height: `${Math.max(10, (trend.amount / 1000) * 100)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="trend-value">${trend.amount.toFixed(0)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feed Sections */}
      {feed && feed.feed && feed.feed.length > 0 ? (
        <>
          {/* Recommended Products */}
          {feed.feed.filter((p) => p.feed_type === 'recommended').length > 0 && (
            <FeedSection
              title="Recommended For You"
              subtitle="Based on your preferences"
              products={feed.feed.filter((p) => p.feed_type === 'recommended')}
            />
          )}

          {/* Trending Products */}
          {feed.feed.filter((p) => p.feed_type === 'trending').length > 0 && (
            <FeedSection
              title="Trending This Week"
              subtitle="Popular with other shoppers"
              products={feed.feed.filter((p) => p.feed_type === 'trending')}
            />
          )}

          {/* Flash Deals */}
          {feed.feed.filter((p) => p.feed_type === 'flash_deal').length > 0 && (
            <FeedSection
              title="Flash Deals"
              subtitle="Limited time offers"
              products={feed.feed.filter((p) => p.feed_type === 'flash_deal')}
              highlight={true}
            />
          )}

          {/* All Feed Items */}
          <FeedSection title="All Items" subtitle="Everything in your feed" products={feed.feed} />
        </>
      ) : (
        <div className="feed-empty">
          <p>
            No personalized feed available yet. Start shopping to get personalized recommendations!
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Feed Section Component
 */
const FeedSection = ({ title, subtitle, products, highlight = false }) => {
  return (
    <div className={`feed-section ${highlight ? 'highlight' : ''}`}>
      <div className="section-header">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="products-grid">
        {products && products.length > 0 ? (
          products
            .slice(0, 12)
            .map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showBadge={highlight}
                badge={product.savings ? `${product.savings}% OFF` : undefined}
              />
            ))
        ) : (
          <div className="grid-empty">No products in this section</div>
        )}
      </div>
    </div>
  )
}

export default Feed
