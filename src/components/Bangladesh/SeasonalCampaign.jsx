import React from 'react'
import BangladeshConfig from '../../config/BangladeshConfig'

export const SeasonalCampaign = ({ campaignId, featured = false }) => {
  const campaign = BangladeshConfig.seasonalCampaigns?.find((c) => c.id === campaignId)

  if (!campaign) return null

  const bannerColors = campaign.colors || ['#FF6B6B', '#FFFFFF']

  return (
    <div
      className={`seasonal-banner rounded-lg text-white text-center overflow-hidden transition hover:shadow-lg ${
        featured ? 'py-12 px-6' : 'py-8 px-4'
      }`}
      style={{
        background: `linear-gradient(135deg, ${bannerColors[0]} 0%, ${bannerColors[1]} 100%)`,
      }}
    >
      <div className="max-w-2xl mx-auto">
        <h2 className={`font-bold mb-2 ${featured ? 'text-4xl' : 'text-3xl'}`}>{campaign.name}</h2>
        <p className={`mb-4 ${featured ? 'text-xl' : 'text-lg'}`}>{campaign.message}</p>

        {campaign.discount && (
          <div className="text-3xl font-bold text-yellow-300 mb-4">{campaign.discount}</div>
        )}

        {campaign.dateRange && <p className="text-sm opacity-90 mb-4">{campaign.dateRange}</p>}

        {campaign.topProducts && (
          <div className="mt-4">
            <p className="text-sm mb-3 font-semibold">জনপ্রিয় পণ্য:</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {campaign.topProducts.map((product) => (
                <span
                  key={product}
                  className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {product}
                </span>
              ))}
            </div>
          </div>
        )}

        {campaign.paymentPlans && (
          <div className="mt-4 bg-white bg-opacity-20 p-3 rounded">
            <p className="text-sm font-medium">কিস্তিতে কিনুন - ৩ বা ৬ মাসের সুবিধা</p>
          </div>
        )}

        <button
          className={`mt-6 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 transition ${
            featured ? 'px-12 py-3 text-lg' : 'px-8 py-2'
          }`}
        >
          এখনই কিনুন
        </button>
      </div>
    </div>
  )
}

export default SeasonalCampaign
