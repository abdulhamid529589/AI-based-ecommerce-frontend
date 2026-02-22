// Currency formatting utilities for Bangladesh

const CURRENCY_CONFIG = {
  code: 'BDT',
  symbol: '৳',
  name: 'Bangladeshi Taka',
  locale: 'bn-BD',
}

/**
 * Format number to BDT currency
 * @param {number} amount - Amount in BDT
 * @param {object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export const formatBDT = (amount, options = {}) => {
  const { symbol = true, decimals = 0, separator = true, locale = 'en-US' } = options

  if (amount === null || amount === undefined) {
    return '৳ 0'
  }

  const number = parseFloat(amount)

  if (isNaN(number)) {
    return '৳ 0'
  }

  // Format with separators (e.g., 10,000 or 10,00,000 for Indian style)
  let formatted

  if (locale === 'bn-BD') {
    // Bangladesh format: 10,00,000
    formatted = formatBengaliStyle(number, decimals)
  } else {
    // Standard format: 1,000,000
    formatted = number.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  return symbol ? `${CURRENCY_CONFIG.symbol} ${formatted}` : formatted
}

/**
 * Format number in Bengali/Indian style (10,00,000)
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted number
 */
const formatBengaliStyle = (num, decimals = 0) => {
  const parts = num.toFixed(decimals).split('.')
  let numberStr = parts[0]
  let result = ''

  // Reverse the string for processing
  numberStr = numberStr.split('').reverse().join('')

  for (let i = 0; i < numberStr.length; i++) {
    if (i === 3 || (i > 3 && (i - 3) % 2 === 0)) {
      result = ',' + result
    }
    result = numberStr[i] + result
  }

  // Add decimal part if exists
  if (decimals > 0) {
    result += '.' + parts[1]
  }

  return result
}

/**
 * Format number in standard style (1,000,000)
 * @param {number} amount - Amount to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted number
 */
export const formatBDTSimple = (amount, decimals = 0) => {
  if (amount === null || amount === undefined) {
    return '0'
  }

  const number = parseFloat(amount)

  if (isNaN(number)) {
    return '0'
  }

  return number.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Convert BDT to other currency
 * @param {number} amount - Amount in BDT
 * @param {string} targetCurrency - Target currency code
 * @param {number} exchangeRate - Exchange rate (BDT to target)
 * @returns {number} Converted amount
 */
export const convertBDT = (amount, targetCurrency, exchangeRate) => {
  if (!exchangeRate || exchangeRate <= 0) {
    return amount
  }

  return amount / exchangeRate
}

/**
 * Parse BDT formatted string back to number
 * @param {string} formattedString - Formatted BDT string
 * @returns {number} Parsed number
 */
export const parseBDT = (formattedString) => {
  if (!formattedString) {
    return 0
  }

  // Remove currency symbol and whitespace
  let cleaned = formattedString.replace(/৳/g, '').replace(/BDT/gi, '').trim()

  // Remove commas
  cleaned = cleaned.replace(/,/g, '')

  return parseFloat(cleaned) || 0
}

/**
 * Get currency symbol
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = () => {
  return CURRENCY_CONFIG.symbol
}

/**
 * Get currency code
 * @returns {string} Currency code
 */
export const getCurrencyCode = () => {
  return CURRENCY_CONFIG.code
}

/**
 * Get currency name
 * @returns {string} Currency name
 */
export const getCurrencyName = () => {
  return CURRENCY_CONFIG.name
}

/**
 * Get currency config
 * @returns {object} Full currency config
 */
export const getCurrencyConfig = () => {
  return { ...CURRENCY_CONFIG }
}

/**
 * Format price range (e.g., "৳ 1,000 - ৳ 5,000")
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {string} Formatted price range
 */
export const formatPriceRange = (minPrice, maxPrice) => {
  return `${formatBDT(minPrice)} - ${formatBDT(maxPrice)}`
}

/**
 * Calculate total with discount
 * @param {number} price - Original price
 * @param {number} discountPercent - Discount percentage
 * @returns {object} { original, discount, total }
 */
export const calculateDiscount = (price, discountPercent) => {
  const discount = (price * discountPercent) / 100
  const total = price - discount

  return {
    original: price,
    discountAmount: discount,
    discountPercent: discountPercent,
    total: total,
    formattedOriginal: formatBDT(price),
    formattedDiscount: formatBDT(discount),
    formattedTotal: formatBDT(total),
  }
}

/**
 * Format subtotal calculation
 * @param {number} quantity - Quantity
 * @param {number} price - Price per unit
 * @returns {object} Calculation result
 */
export const calculateSubtotal = (quantity, price) => {
  const subtotal = quantity * price

  return {
    quantity,
    price,
    subtotal,
    formattedPrice: formatBDT(price),
    formattedSubtotal: formatBDT(subtotal),
  }
}

/**
 * Format order total with breakdown
 * @param {object} breakdown - { subtotal, shipping, tax, discount }
 * @returns {object} Formatted breakdown with total
 */
export const calculateOrderTotal = (breakdown) => {
  const { subtotal = 0, shipping = 0, tax = 0, discount = 0 } = breakdown

  const total = subtotal + shipping + tax - discount

  return {
    subtotal,
    shipping,
    tax,
    discount,
    total,
    formattedSubtotal: formatBDT(subtotal),
    formattedShipping: formatBDT(shipping),
    formattedTax: formatBDT(tax),
    formattedDiscount: formatBDT(discount),
    formattedTotal: formatBDT(total),
  }
}

export default {
  formatBDT,
  formatBDTSimple,
  convertBDT,
  parseBDT,
  getCurrencySymbol,
  getCurrencyCode,
  getCurrencyName,
  getCurrencyConfig,
  formatPriceRange,
  calculateDiscount,
  calculateSubtotal,
  calculateOrderTotal,
}
