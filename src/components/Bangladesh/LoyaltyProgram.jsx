import React from 'react'

export const BanglaLoyaltyProgram = ({ userPoints = 0, userTier = 'Bronze', onRedeem }) => {
  const tiers = [
    {
      id: 'bronze',
      name: '🥉 ব্রোঞ্জ',
      pointsRange: '০-৯৯৯',
      minPoints: 0,
      benefits: ['স্ট্যান্ডার্ড পয়েন্ট আর্নিং', 'জন্মদিনে ৳১০০ ডিসকাউন্ট', 'সকল প্রচারে এক্সেস'],
      color: 'from-orange-100 to-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      id: 'silver',
      name: '🥈 সিলভার',
      pointsRange: '১০০০-৪৯৯৯',
      minPoints: 1000,
      benefits: ['১.২৫x পয়েন্ট বোনাস', '২৪ ঘন্টা আগে সেল এক্সেস', 'ফ্রি স্ট্যান্ডার্ড শিপিং'],
      color: 'from-gray-100 to-gray-50',
      borderColor: 'border-gray-200',
    },
    {
      id: 'gold',
      name: '🏆 গোল্ড',
      pointsRange: '৫০০০-৯৯৯৯',
      minPoints: 5000,
      benefits: [
        '১.৫x পয়েন্ট বোনাস',
        'সব অর্ডারে ফ্রি শিপিং',
        'প্রিমিয়াম সাপোর্ট',
        'এক্সক্লুসিভ ডিল',
      ],
      color: 'from-yellow-100 to-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      id: 'platinum',
      name: '💎 প্ল্যাটিনাম',
      pointsRange: '১০০০০+',
      minPoints: 10000,
      benefits: [
        '২x পয়েন্ট বোনাস',
        'আজীবন ফ্রি শিপিং',
        'এক্সক্লুসিভ প্রিমিয়াম সাপোর্ট',
        'বিশেষ ডেলিভারি গ্যারান্টি',
        'মাসিক সারপ্রাইজ গিফট',
      ],
      color: 'from-blue-100 to-blue-50',
      borderColor: 'border-blue-200',
    },
  ]

  const getCurrentTier = () => {
    return tiers.find((t) => t.minPoints <= userPoints) || tiers[0]
  }

  const getNextTier = () => {
    const currentTierIndex = tiers.findIndex((t) => t.id === getCurrentTier().id)
    return tiers[currentTierIndex + 1] || null
  }

  const currentTier = getCurrentTier()
  const nextTier = getNextTier()
  const pointsToNextTier = nextTier ? nextTier.minPoints - userPoints : 0
  const progressPercent = nextTier
    ? ((userPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100

  return (
    <div className="loyalty-program space-y-6">
      <div
        className={`bg-gradient-to-br ${currentTier.color} border-2 ${currentTier.borderColor} rounded-lg p-6`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">আপনার বর্তমান টায়ার</p>
            <h2 className="text-3xl font-bold">{currentTier.name}</h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">মোট পয়েন্ট</p>
            <p className="text-3xl font-bold text-orange-600">
              {userPoints.toLocaleString('bn-BD')}
            </p>
          </div>
        </div>

        {nextTier && (
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span>পরবর্তী টায়ারে {pointsToNextTier.toLocaleString('bn-BD')} পয়েন্ট বাকি</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`border-2 rounded-lg p-4 transition ${
              tier.id === currentTier.id ? `${tier.borderColor} bg-opacity-50` : 'border-gray-200'
            }`}
          >
            <h3 className="font-bold text-lg mb-2">{tier.name}</h3>
            <p className="text-xs text-gray-600 mb-3">{tier.pointsRange} পয়েন্ট</p>

            <ul className="space-y-1">
              {tier.benefits.map((benefit, idx) => (
                <li key={idx} className="text-sm text-gray-700">
                  ✓ {benefit}
                </li>
              ))}
            </ul>

            {tier.id === currentTier.id && (
              <span className="inline-block mt-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                আপনার টায়ার
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-bold mb-3">পয়েন্ট রিডিম করুন</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[100, 500, 1000, 5000].map((points) => (
            <button
              key={points}
              onClick={() => onRedeem?.(points)}
              disabled={userPoints < points}
              className={`py-2 px-3 rounded text-sm font-bold transition ${
                userPoints >= points
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {points.toLocaleString('bn-BD')} পয়েন্ট
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BanglaLoyaltyProgram
