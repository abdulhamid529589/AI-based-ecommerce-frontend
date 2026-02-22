import { useCallback, useMemo } from 'react'
import BangladeshConfig from '../config/BangladeshConfig'

export const useBanglaMessages = () => {
  const messages = useMemo(
    () =>
      BangladeshConfig.messages || {
        welcome: 'স্বাগতম বাংলাদেশের সেরা অনলাইন শপিং প্ল্যাটফর্মে',
        addCart: 'কার্টে যোগ করুন',
        buyNow: 'এখনই কিনুন',
        outOfStock: 'স্টক শেষ',
        lowStock: 'সীমিত স্টক বাকি',
        freeShipping: 'ফ্রি ডেলিভারি',
        cashBack: 'ক্যাশব্যাক',
        topSelling: 'বেস্টসেলার',
        newArrival: 'নতুন পণ্য',
        verified: 'যাচাইকৃত ক্রেতা',
        returnable: 'রিটার্নেবল',
        warranty: 'ওয়ারেন্টি',
        cod: 'ক্যাশ অন ডেলিভারি',
        secure: 'নিরাপদ',
        fastDelivery: 'দ্রুত ডেলিভারি',
      },
    [],
  )

  const getMessage = useCallback(
    (key, defaultMessage = '') => {
      return messages[key] || defaultMessage
    },
    [messages],
  )

  const formatUrgencyMessage = useCallback((count, action) => {
    const banglaCount = count.toLocaleString('bn-BD')
    const actions = {
      stock: `শুধুমাত্র ${banglaCount}টি বাকি`,
      cart: `${banglaCount} জনের কার্টে আছে`,
      sold: `গত ২৪ ঘন্টায় ${banglaCount}টি বিক্রিত`,
      viewed: `${banglaCount} জন দেখেছেন`,
    }
    return actions[action] || ''
  }, [])

  const formatDeliveryMessage = useCallback((deliveryDays, zone = '') => {
    if (deliveryDays === 'same-day') {
      return 'একই দিনে ডেলিভারি'
    } else if (deliveryDays === 1) {
      return 'আগামীকাল ডেলিভারি'
    } else if (deliveryDays === 2) {
      return '২ দিনে ডেলিভারি'
    } else if (typeof deliveryDays === 'number') {
      const banglaNum = deliveryDays.toLocaleString('bn-BD')
      return `${banglaNum} দিনে ডেলিভারি`
    }
    return 'ডেলিভারি তথ্য পাওয়া যাচ্ছে না'
  }, [])

  const formatReviewMessage = useCallback((rating, reviewCount) => {
    const banglaRating = rating.toLocaleString('bn-BD')
    const banglaCount = reviewCount.toLocaleString('bn-BD')
    const stars = '⭐'.repeat(Math.round(rating))

    return {
      text: `${stars} ${banglaRating} (${banglaCount} মতামত)`,
      stars,
      rating: banglaRating,
      count: banglaCount,
    }
  }, [])

  const formatTimeMessage = useCallback((timestamp) => {
    const date = new Date(timestamp)
    const bengaliFormatter = new Intl.DateTimeFormat('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    return bengaliFormatter.format(date)
  }, [])

  return {
    messages,
    getMessage,
    formatUrgencyMessage,
    formatDeliveryMessage,
    formatReviewMessage,
    formatTimeMessage,
  }
}

export default useBanglaMessages
