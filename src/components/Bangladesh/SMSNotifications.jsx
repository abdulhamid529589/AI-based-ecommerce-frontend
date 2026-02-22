import React, { useState } from 'react'

export const SMSNotificationBanner = ({ message, type = 'success', onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
  }[type]

  const textColor = {
    success: 'text-green-800',
    info: 'text-blue-800',
    warning: 'text-yellow-800',
    error: 'text-red-800',
  }[type]

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  return (
    <div className={`border rounded-lg p-4 flex items-center justify-between ${bgColor}`}>
      <div className={`flex items-center gap-3 ${textColor}`}>
        <span className="text-lg">
          {type === 'success' && '✓'}
          {type === 'info' && 'ℹ'}
          {type === 'warning' && '⚠'}
          {type === 'error' && '✕'}
        </span>
        <p className="font-medium">{message}</p>
      </div>
      <button onClick={handleClose} className={`${textColor} hover:opacity-75`}>
        ✕
      </button>
    </div>
  )
}

export const SMSNotificationPreferences = ({ onSave }) => {
  const [preferences, setPreferences] = useState({
    orderConfirmation: true,
    shipmentUpdates: true,
    deliveryNotification: true,
    promotionalOffers: false,
    reviewReminder: true,
  })

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = () => {
    onSave?.(preferences)
  }

  const options = [
    { key: 'orderConfirmation', label: 'অর্ডার নিশ্চিতকরণ', icon: '✓' },
    { key: 'shipmentUpdates', label: 'শিপমেন্ট আপডেট', icon: '📦' },
    { key: 'deliveryNotification', label: 'ডেলিভারি নোটিফিকেশন', icon: '🚚' },
    { key: 'promotionalOffers', label: 'প্রচারমূলক অফার', icon: '🎉' },
    { key: 'reviewReminder', label: 'পর্যালোচনা অনুস্মারক', icon: '⭐' },
  ]

  return (
    <div className="bg-white border rounded-lg p-6 space-y-4">
      <h3 className="font-bold text-lg">SMS নোটিফিকেশন পছন্দ</h3>
      <p className="text-sm text-gray-600">
        আপনার গুরুত্বপূর্ণ তথ্য এবং অফারগুলি SMS এর মাধ্যমে পান
      </p>

      <div className="space-y-3 border-t pt-4">
        {options.map((option) => (
          <div
            key={option.key}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{option.icon}</span>
              <label className="font-medium text-sm cursor-pointer">{option.label}</label>
            </div>
            <input
              type="checkbox"
              checked={preferences[option.key]}
              onChange={() => handleToggle(option.key)}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition mt-4"
      >
        সংরক্ষণ করুন
      </button>
    </div>
  )
}

export default SMSNotificationBanner
