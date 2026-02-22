import BangladeshConfig from '../../config/BangladeshConfig'

export const formatPriceBD = (amount, options = {}) => {
  const { showSymbol = true, showComma = true, decimals = 0 } = options

  if (!amount && amount !== 0) return ''

  const formattedAmount = amount.toLocaleString('bn-BD', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  if (showSymbol) {
    return `${BangladeshConfig.currency.symbol}${formattedAmount}`
  }
  return formattedAmount
}

export const formatSavings = (originalPrice, salePrice) => {
  const savings = originalPrice - salePrice
  const savingsPercent = Math.round((savings / originalPrice) * 100)

  return {
    amount: formatPriceBD(savings),
    percent: savingsPercent,
    text: `${savingsPercent}% ছাড়`,
  }
}

export const getPriceRange = (price) => {
  const ranges = BangladeshConfig.priceRanges || [
    { min: 0, max: 500, label: 'বাজেট-বান্ধব', icon: '💰' },
    { min: 501, max: 2000, label: 'মধ্য-মূল্য', icon: '💵' },
    { min: 2001, max: 10000, label: 'প্রিমিয়াম', icon: '💎' },
    { min: 10001, max: 50000, label: 'লাক্সারি', icon: '👑' },
    { min: 50001, max: Infinity, label: 'এক্সক্লুসিভ', icon: '🌟' },
  ]

  const range = ranges.find((r) => price >= r.min && price <= r.max)
  return range || ranges[0]
}

export const getCharmPrice = (price) => {
  // Charm pricing: 999 instead of 1000
  const str = Math.floor(price).toString()
  const lastDigit = str.charAt(str.length - 1)

  if (lastDigit === '0' || lastDigit === '5') {
    return Math.floor(price) - 1
  }

  return Math.floor(price)
}

export const formatProductPrice = (price, originalPrice = null) => {
  const formatted = formatPriceBD(price)

  if (originalPrice && originalPrice > price) {
    const savings = formatSavings(originalPrice, price)
    return {
      current: formatted,
      original: formatPriceBD(originalPrice),
      savings: savings.text,
      savingsAmount: savings.amount,
      savingsPercent: savings.percent,
    }
  }

  return {
    current: formatted,
    original: null,
    savings: null,
  }
}

export const formatBDTAmount = (amount) => {
  return amount.toLocaleString('bn-BD')
}
