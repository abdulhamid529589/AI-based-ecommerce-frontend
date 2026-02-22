import React, { useState } from 'react'

export const UrgencyIndicator = ({ type = 'stock', count, threshold = 10 }) => {
  const shouldShow = count <= threshold && count > 0

  if (!shouldShow) return null

  const config = {
    stock: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: '⚠',
      getMessage: (c) => `মাত্র ${c.toLocaleString('bn-BD')}টি বাকি`,
    },
    sold: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      icon: '🔥',
      getMessage: (c) => `গত ২৪ ঘন্টায় ${c.toLocaleString('bn-BD')}টি বিক্রিত`,
    },
    cart: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: '👥',
      getMessage: (c) => `${c.toLocaleString('bn-BD')} জনের কার্টে আছে`,
    },
  }

  const current = config[type] || config.stock

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${current.bg} ${current.border} ${current.text}`}
    >
      <span className="text-sm font-bold">{current.icon}</span>
      <span className="text-sm font-bold">{current.getMessage(count)}</span>
    </div>
  )
}

export const PopularityBadge = ({ type = 'bestseller' }) => {
  const badges = {
    bestseller: { text: 'বেস্টসেলার', bg: 'bg-orange-500', icon: '⭐' },
    trending: { text: 'ট্রেন্ডিং', bg: 'bg-purple-500', icon: '🔥' },
    new: { text: 'নতুন', bg: 'bg-green-500', icon: '✨' },
    limited: { text: 'সীমিত সংস্করণ', bg: 'bg-red-500', icon: '🎁' },
  }

  const badge = badges[type] || badges.new

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-bold ${badge.bg}`}
    >
      <span>{badge.icon}</span>
      {badge.text}
    </span>
  )
}

export const DeliverySpeedBadge = ({ days, highlight = false }) => {
  const getDayLabel = (d) => {
    if (d === 1) return 'আগামীকাল'
    if (d === 'same') return 'আজই'
    return `${d.toLocaleString('bn-BD')} দিনে`
  }

  return (
    <div
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
        highlight ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'
      }`}
    >
      <span>🚚</span>
      {getDayLabel(days)}
    </div>
  )
}

export const VerifiedSellerBadge = () => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-300">
      <span>✓</span>
      যাচাইকৃত বিক্রেতা
    </div>
  )
}

export const WarrantyBadge = ({ type = 'standard' }) => {
  const warranties = {
    standard: { text: '১ বছর ওয়ারেন্টি', color: 'bg-indigo-100 text-indigo-700' },
    extended: { text: '২ বছর ওয়ারেন্টি', color: 'bg-blue-100 text-blue-700' },
    lifetime: { text: 'আজীবন ওয়ারেন্টি', color: 'bg-purple-100 text-purple-700' },
  }

  const warranty = warranties[type] || warranties.standard

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${warranty.color}`}
    >
      <span>🛡️</span>
      {warranty.text}
    </div>
  )
}

export const CashbackBadge = ({ percent }) => {
  return (
    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
      <span>💰</span>
      {percent}% ক্যাশব্যাক
    </div>
  )
}

export default UrgencyIndicator
