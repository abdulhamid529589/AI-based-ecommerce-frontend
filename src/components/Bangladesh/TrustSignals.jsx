import React from 'react'

export const TrustSignals = ({ variant = 'default' }) => {
  const signals = [
    {
      icon: '✓',
      title: 'সহজ রিটার্ন',
      description: '৭ দিনের মধ্যে রিটার্ন',
      color: 'text-green-600',
    },
    {
      icon: '🔒',
      title: 'নিরাপদ পেমেন্ট',
      description: '১০০% এনক্রিপ্টেড',
      color: 'text-blue-600',
    },
    {
      icon: '📦',
      title: 'দ্রুত ডেলিভারি',
      description: 'ঢাকায় ১ দিন',
      color: 'text-orange-600',
    },
    {
      icon: '💬',
      title: '২৪/৭ সাপোর্ট',
      description: 'বাংলায় সেবা',
      color: 'text-purple-600',
    },
  ]

  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {signals.map((signal, idx) => (
          <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
            <div className={`text-2xl mb-1 ${signal.color}`}>{signal.icon}</div>
            <p className="text-xs font-bold text-gray-800">{signal.title}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {signals.map((signal, idx) => (
        <div
          key={idx}
          className="p-4 bg-white border border-gray-200 rounded-lg text-center hover:shadow-md transition"
        >
          <div className={`text-3xl mb-2 ${signal.color}`}>{signal.icon}</div>
          <h3 className="font-bold text-sm mb-1">{signal.title}</h3>
          <p className="text-xs text-gray-600">{signal.description}</p>
        </div>
      ))}
    </div>
  )
}

export default TrustSignals
