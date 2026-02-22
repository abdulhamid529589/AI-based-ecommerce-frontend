import { formatBDT, calculateDiscount } from '../lib/currencyFormatter'
import PropTypes from 'prop-types'
import './PriceDisplay.css'

/**
 * Price Display Component
 * Shows price in BDT format with optional discount
 */
export const PriceDisplay = ({
  price,
  discount = 0,
  showDiscount = false,
  size = 'md',
  className = '',
}) => {
  if (!price && price !== 0) {
    return <span className={`price-display ${size} ${className}`}>-</span>
  }

  if (!showDiscount) {
    return <span className={`price-display ${size} ${className}`}>{formatBDT(price)}</span>
  }

  const { original, total, discountPercent } = calculateDiscount(price, discount)

  return (
    <div className={`price-display-group ${size} ${className}`}>
      <span className="original-price">{formatBDT(original)}</span>
      <span className="discounted-price">{formatBDT(total)}</span>
      <span className="discount-badge">{discountPercent}% OFF</span>
    </div>
  )
}

PriceDisplay.propTypes = {
  price: PropTypes.number.isRequired,
  discount: PropTypes.number,
  showDiscount: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
}

/**
 * Price Range Component
 */
export const PriceRange = ({ minPrice, maxPrice, className = '' }) => {
  return (
    <span className={`price-range ${className}`}>
      {formatBDT(minPrice)} — {formatBDT(maxPrice)}
    </span>
  )
}

PriceRange.propTypes = {
  minPrice: PropTypes.number.isRequired,
  maxPrice: PropTypes.number.isRequired,
  className: PropTypes.string,
}

/**
 * Price Breakdown Component
 */
export const PriceBreakdown = ({
  subtotal,
  shipping = 0,
  tax = 0,
  discount = 0,
  className = '',
}) => {
  const total = subtotal + shipping + tax - discount

  return (
    <div className={`price-breakdown ${className}`}>
      <div className="breakdown-row">
        <span className="label">Subtotal:</span>
        <span className="value">{formatBDT(subtotal)}</span>
      </div>

      {shipping > 0 && (
        <div className="breakdown-row">
          <span className="label">Shipping:</span>
          <span className="value">{formatBDT(shipping)}</span>
        </div>
      )}

      {tax > 0 && (
        <div className="breakdown-row">
          <span className="label">Tax:</span>
          <span className="value">{formatBDT(tax)}</span>
        </div>
      )}

      {discount > 0 && (
        <div className="breakdown-row discount">
          <span className="label">Discount:</span>
          <span className="value">-{formatBDT(discount)}</span>
        </div>
      )}

      <div className="breakdown-row total">
        <span className="label">Total:</span>
        <span className="value">{formatBDT(total)}</span>
      </div>
    </div>
  )
}

PriceBreakdown.propTypes = {
  subtotal: PropTypes.number.isRequired,
  shipping: PropTypes.number,
  tax: PropTypes.number,
  discount: PropTypes.number,
  className: PropTypes.string,
}

/**
 * Installment Calculator Component
 */
export const InstallmentCalculator = ({ amount, months = 3, className = '' }) => {
  const monthlyPayment = amount / months

  return (
    <div className={`installment-calculator ${className}`}>
      <p className="installment-text">
        Pay in {months} installments of <strong>{formatBDT(monthlyPayment)}</strong>
      </p>
      <small className="installment-info">Interest-free installment available</small>
    </div>
  )
}

InstallmentCalculator.propTypes = {
  amount: PropTypes.number.isRequired,
  months: PropTypes.number,
  className: PropTypes.string,
}

export default {
  PriceDisplay,
  PriceRange,
  PriceBreakdown,
  InstallmentCalculator,
}
