import React from 'react'
import { Zap, AlertCircle, TrendingUp } from 'lucide-react'
import '../../styles/StockIndicator.css'

const StockIndicator = ({ stock, maxStock = 20 }) => {
  // Determine urgency level
  const getUrgency = () => {
    if (stock <= 0) return 'out-of-stock'
    if (stock <= 3) return 'critical'
    if (stock <= 5) return 'low'
    if (stock <= 10) return 'medium'
    return 'high'
  }

  // Get percentage
  const percentage = Math.max(0, (stock / maxStock) * 100)
  const urgency = getUrgency()

  const getLabel = () => {
    if (stock <= 0) return 'Out of Stock'
    if (stock <= 3) return 'Low Stock'
    if (stock <= 5) return 'Limited Stock'
    if (stock < 10) return 'Available'
    return 'In Stock'
  }

  return (
    <div className={`stock-indicator stock-${urgency}`}>
      <div className="stock-header">
        <span className="stock-label">{getLabel()}</span>
        {stock <= 5 && stock > 0 && <Zap className="stock-urgent-icon" />}
      </div>

      <div className="stock-bar-container">
        <div className={`stock-bar stock-bar-${urgency}`} style={{ width: `${percentage}%` }}></div>
      </div>

      {stock <= 3 && stock > 0 && (
        <p className="stock-warning">
          <AlertCircle className="w-3.5 h-3.5" />
          Hurry! Limited quantity available
        </p>
      )}

      {stock > 10 && (
        <p className="stock-info">
          <TrendingUp className="w-3.5 h-3.5" />
          Popular item - Frequently purchased
        </p>
      )}
    </div>
  )
}

export default StockIndicator
