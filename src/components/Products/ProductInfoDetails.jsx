import { Calendar, Tag, AlertCircle, CheckCircle2, Package, Truck, Zap, Shield } from 'lucide-react'
import '../../styles/ProductInfoDetails.css'

const ProductInfoDetails = ({ productDetails }) => {
  // Parse product data
  const price =
    typeof productDetails.price === 'string'
      ? parseFloat(productDetails.price)
      : productDetails.price

  const salePrice = productDetails.sale_price ? parseFloat(productDetails.sale_price) : null
  const displayPrice = salePrice || price
  const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently added'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="product-info-details">
      {/* Product Meta Information */}
      <div className="product-meta-grid">
        {/* Availability Status */}
        <div className="meta-item">
          <div className="meta-label">Availability</div>
          <div className="meta-value">
            {productDetails.stock > 0 ? (
              <div className="status-badge in-stock">
                <CheckCircle2 className="w-4 h-4" />
                <span>In Stock ({productDetails.stock} available)</span>
              </div>
            ) : (
              <div className="status-badge out-of-stock">
                <AlertCircle className="w-4 h-4" />
                <span>Out of Stock</span>
              </div>
            )}
          </div>
        </div>

        {/* Added Date */}
        {(productDetails.created_at || productDetails.createdAt) && (
          <div className="meta-item">
            <div className="meta-label">Added</div>
            <div className="meta-value">
              <div className="status-badge">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(productDetails.created_at || productDetails.createdAt)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Category */}
        <div className="meta-item">
          <div className="meta-label">Category</div>
          <div className="meta-value">
            <div className="status-badge category">
              <Tag className="w-4 h-4" />
              <span className="capitalize">{productDetails.category}</span>
            </div>
          </div>
        </div>

        {/* Price Tier */}
        <div className="meta-item">
          <div className="meta-label">Price Tier</div>
          <div className="meta-value">
            <div className="status-badge">
              {price < 5000 ? (
                <span>Budget-friendly</span>
              ) : price < 15000 ? (
                <span>Mid-range</span>
              ) : price < 50000 ? (
                <span>Premium</span>
              ) : (
                <span>Luxury</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Product Information Grid */}
      <div className="enhanced-product-info">
        {/* Pricing Section */}
        <div className="info-section">
          <h4 className="section-title">💰 Pricing</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Regular Price:</span>
              <span className="info-value">৳ {price.toLocaleString()}</span>
            </div>
            {salePrice && (
              <>
                <div className="info-item">
                  <span className="info-label">Sale Price:</span>
                  <span className="info-value sale-price">৳ {salePrice.toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Discount:</span>
                  <span className="info-value discount-badge">{discount}% OFF</span>
                </div>
              </>
            )}
            {productDetails.cost_price && (
              <div className="info-item">
                <span className="info-label">Cost Price:</span>
                <span className="info-value">
                  ৳ {parseFloat(productDetails.cost_price).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Identifiers */}
        {(productDetails.sku || productDetails.barcode || productDetails.slug) && (
          <div className="info-section">
            <h4 className="section-title">📦 Product IDs</h4>
            <div className="info-grid">
              {productDetails.sku && (
                <div className="info-item">
                  <span className="info-label">SKU:</span>
                  <span className="info-value">{productDetails.sku}</span>
                </div>
              )}
              {productDetails.barcode && (
                <div className="info-item">
                  <span className="info-label">Barcode:</span>
                  <span className="info-value">{productDetails.barcode}</span>
                </div>
              )}
              {productDetails.slug && (
                <div className="info-item">
                  <span className="info-label">Slug:</span>
                  <span className="info-value">{productDetails.slug}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shipping Information */}
        {(productDetails.weight ||
          productDetails.length ||
          productDetails.width ||
          productDetails.height) && (
          <div className="info-section">
            <h4 className="section-title">🚚 Shipping Details</h4>
            <div className="info-grid">
              {productDetails.weight && (
                <div className="info-item">
                  <span className="info-label">Weight:</span>
                  <span className="info-value">
                    {productDetails.weight} {productDetails.weight_unit || 'kg'}
                  </span>
                </div>
              )}
              {productDetails.length && (
                <div className="info-item">
                  <span className="info-label">Length:</span>
                  <span className="info-value">{productDetails.length} cm</span>
                </div>
              )}
              {productDetails.width && (
                <div className="info-item">
                  <span className="info-label">Width:</span>
                  <span className="info-value">{productDetails.width} cm</span>
                </div>
              )}
              {productDetails.height && (
                <div className="info-item">
                  <span className="info-label">Height:</span>
                  <span className="info-value">{productDetails.height} cm</span>
                </div>
              )}
              {productDetails.shipping_class && (
                <div className="info-item">
                  <span className="info-label">Shipping Class:</span>
                  <span className="info-value capitalize">{productDetails.shipping_class}</span>
                </div>
              )}
              {productDetails.free_shipping && (
                <div className="info-item highlight">
                  <span className="info-label">✨ Free Shipping</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inventory Management */}
        {(productDetails.low_stock_threshold ||
          productDetails.stock_status ||
          productDetails.allow_backorders) && (
          <div className="info-section">
            <h4 className="section-title">📊 Inventory</h4>
            <div className="info-grid">
              {productDetails.low_stock_threshold && (
                <div className="info-item">
                  <span className="info-label">Low Stock Alert:</span>
                  <span className="info-value">
                    &lt; {productDetails.low_stock_threshold} units
                  </span>
                </div>
              )}
              {productDetails.stock_status && (
                <div className="info-item">
                  <span className="info-label">Stock Status:</span>
                  <span className="info-value capitalize">
                    {productDetails.stock_status.replace('-', ' ')}
                  </span>
                </div>
              )}
              {productDetails.allow_backorders && (
                <div className="info-item highlight">
                  <span className="info-label">✓ Backorders Allowed</span>
                </div>
              )}
              {productDetails.sold_individually && (
                <div className="info-item">
                  <span className="info-label">Sale Limit:</span>
                  <span className="info-value">1 unit per order</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Short Description */}
        {productDetails.short_description && (
          <div className="info-section">
            <h4 className="section-title">📝 Summary</h4>
            <div className="info-grid">
              <div className="info-item">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {productDetails.short_description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Product Type */}
        {productDetails.product_type && (
          <div className="info-section">
            <h4 className="section-title">📦 Product Type</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Type:</span>
                <span className="info-value capitalize">
                  {productDetails.product_type.replace('-', ' ').replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Brand & Taxonomy */}
        {(productDetails.brand || productDetails.tags) && (
          <div className="info-section">
            <h4 className="section-title">🏷️ Classification</h4>
            <div className="info-grid">
              {productDetails.brand && (
                <div className="info-item">
                  <span className="info-label">Brand:</span>
                  <span className="info-value">{productDetails.brand}</span>
                </div>
              )}
              {productDetails.tags &&
                Array.isArray(productDetails.tags) &&
                productDetails.tags.length > 0 && (
                  <div className="info-item">
                    <span className="info-label">Tags:</span>
                    <div className="tags-list">
                      {productDetails.tags.map((tag) => (
                        <span key={tag} className="tag-badge">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Product Features */}
        {(productDetails.featured || productDetails.enable_reviews) && (
          <div className="info-section">
            <h4 className="section-title">⭐ Features</h4>
            <ul className="feature-list">
              {productDetails.featured && (
                <li>
                  <Zap className="w-4 h-4" />
                  <span>Featured Product</span>
                </li>
              )}
              {productDetails.enable_reviews && (
                <li>
                  <Shield className="w-4 h-4" />
                  <span>Customer Reviews Enabled</span>
                </li>
              )}
            </ul>
          </div>
        )}

        {/* SEO Information */}
        {(productDetails.meta_title ||
          productDetails.meta_description ||
          productDetails.focus_keyword) && (
          <div className="info-section">
            <h4 className="section-title">🔍 SEO Information</h4>
            <div className="info-grid">
              {productDetails.meta_title && (
                <div className="info-item">
                  <span className="info-label">Meta Title:</span>
                  <span className="info-value text-sm">{productDetails.meta_title}</span>
                </div>
              )}
              {productDetails.meta_description && (
                <div className="info-item">
                  <span className="info-label">Meta Description:</span>
                  <span className="info-value text-sm">{productDetails.meta_description}</span>
                </div>
              )}
              {productDetails.focus_keyword && (
                <div className="info-item">
                  <span className="info-label">Focus Keyword:</span>
                  <span className="info-value">
                    <span className="tag-badge">{productDetails.focus_keyword}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Purchase Note */}
        {productDetails.purchase_note && (
          <div className="info-section">
            <h4 className="section-title">📌 Important Note</h4>
            <div className="info-grid">
              <div className="info-item">
                <p className="text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 p-3 rounded border border-amber-200 dark:border-amber-800">
                  {productDetails.purchase_note}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Highlights */}
      {productDetails.stock > 0 && (
        <div className="product-highlights">
          <h4 className="highlights-title">Why Choose This Product?</h4>
          <ul className="highlights-list">
            <li>
              <span className="highlight-icon">✓</span>
              <span>Authentic and verified product</span>
            </li>
            <li>
              <span className="highlight-icon">✓</span>
              <span>Fast and reliable delivery</span>
            </li>
            <li>
              <span className="highlight-icon">✓</span>
              <span>Easy returns and exchanges</span>
            </li>
            <li>
              <span className="highlight-icon">✓</span>
              <span>Competitive pricing guaranteed</span>
            </li>
          </ul>
        </div>
      )}

      {/* Stock Warning */}
      {productDetails.stock > 0 && productDetails.stock <= 5 && (
        <div className="stock-warning">
          <AlertCircle className="w-5 h-5" />
          <span>
            Only {productDetails.stock} left in stock - Order now to avoid disappointment!
          </span>
        </div>
      )}

      {/* Out of Stock Message */}
      {productDetails.stock <= 0 && (
        <div className="out-of-stock-message">
          <p>
            This product is currently out of stock. Please check back soon or notify me when it's
            available.
          </p>
        </div>
      )}
    </div>
  )
}

export default ProductInfoDetails
