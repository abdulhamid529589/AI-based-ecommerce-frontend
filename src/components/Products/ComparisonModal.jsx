import React, { useState } from 'react'
import { X, Check, X as XIcon, ShoppingCart, Zap } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { toast } from 'react-toastify'
import '../../styles/ComparisonModal.css'

const ComparisonModal = ({ products = [], isOpen, onClose }) => {
  const dispatch = useDispatch()

  if (!isOpen || products.length === 0) return null

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url,
        quantity: 1,
      }),
    )
    toast.success(`${product.name} added to cart!`)
  }

  // Get all unique specification keys
  const allKeys = new Set()
  products.forEach((p) => {
    if (p.specifications) {
      Object.keys(p.specifications).forEach((key) => allKeys.add(key))
    }
  })

  return (
    <div className="comparison-modal-overlay" onClick={onClose}>
      <div className="comparison-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="comparison-header">
          <h2 className="comparison-title">Compare Products</h2>
          <button onClick={onClose} className="comparison-close" aria-label="Close modal">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="comparison-scrollable">
          <table className="comparison-table">
            <tbody>
              {/* Product Images and Names */}
              <tr className="comparison-row comparison-header-row">
                <td className="comparison-label">Product</td>
                {products.map((product) => (
                  <td key={product._id || product.id} className="comparison-product">
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.name}
                      className="comparison-img"
                    />
                    <h4 className="comparison-product-name">{product.name}</h4>
                  </td>
                ))}
              </tr>

              {/* Price */}
              <tr className="comparison-row">
                <td className="comparison-label">Price</td>
                {products.map((product) => (
                  <td key={product._id || product.id} className="comparison-cell">
                    <span className="comparison-price">
                      ৳{Math.round(product.price || 0).toLocaleString()}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr className="comparison-row">
                <td className="comparison-label">Rating</td>
                {products.map((product) => (
                  <td key={product._id || product.id} className="comparison-cell">
                    <div className="comparison-rating">
                      <span className="comparison-stars">
                        {'★'.repeat(Math.floor(product.ratings || 0))}
                      </span>
                      <span className="comparison-rating-value">
                        {(product.ratings || 0).toFixed(1)}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Stock */}
              <tr className="comparison-row">
                <td className="comparison-label">Stock</td>
                {products.map((product) => (
                  <td key={product._id || product.id} className="comparison-cell">
                    <span
                      className={`comparison-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}
                    >
                      {product.stock >= 10
                        ? 'In Stock'
                        : product.stock > 0
                          ? 'Limited Stock'
                          : 'Out of Stock'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Category */}
              <tr className="comparison-row">
                <td className="comparison-label">Category</td>
                {products.map((product) => (
                  <td key={product._id || product.id} className="comparison-cell">
                    {product.category}
                  </td>
                ))}
              </tr>

              {/* Specifications */}
              {Array.from(allKeys).map((key) => (
                <tr key={key} className="comparison-row">
                  <td className="comparison-label">{key}</td>
                  {products.map((product) => (
                    <td key={product._id || product.id} className="comparison-cell">
                      {product.specifications?.[key] ? (
                        <span className="comparison-available">
                          <Check className="w-4 h-4" />
                          {product.specifications[key]}
                        </span>
                      ) : (
                        <span className="comparison-unavailable">
                          <XIcon className="w-4 h-4" />
                          N/A
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Actions */}
              <tr className="comparison-row comparison-actions-row">
                <td className="comparison-label">Action</td>
                {products.map((product) => (
                  <td key={product._id || product.id} className="comparison-cell">
                    <div className="comparison-actions">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className={`comparison-btn comparison-btn-add ${
                          product.stock <= 0 ? 'disabled' : ''
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add
                      </button>
                      <button className="comparison-btn comparison-btn-buy">
                        <Zap className="w-4 h-4" />
                        Buy
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ComparisonModal
