import React, { useState } from 'react'
import {
  PaymentMethods,
  DeliveryZones,
  SeasonalCampaign,
  BanglaLoyaltyProgram,
  TrustSignals,
  SMSNotifications,
  SMSNotificationPreferences,
  UrgencyIndicator,
  PopularityBadge,
  DeliverySpeedBadge,
} from '@/components/Bangladesh'
import { formatPriceBD, formatSavings } from '@/utils/priceFormatter'
import { useBanglaMessages } from '@/hooks/useBanglaMessages'

/**
 * COMPLETE EXAMPLE: How to use all Bangladesh UI/UX components
 * This demonstrates a full checkout flow with all components integrated
 */

export const BangladeshCheckoutExample = () => {
  // State management
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [selectedZone, setSelectedZone] = useState(null)
  const [showNotificationPrefs, setShowNotificationPrefs] = useState(false)
  const [userPoints, setUserPoints] = useState(2500)

  // Use the Bangla messages hook
  const { getMessage, formatUrgencyMessage, formatDeliveryMessage } = useBanglaMessages()

  // Sample product data
  const sampleProduct = {
    id: 1,
    name: 'প্রিমিয়াম ওয়্যারলেস হেডফোন',
    price: 4999,
    originalPrice: 7999,
    stock: 5,
    reviews: 1250,
    rating: 4.5,
    deliveryDays: 1,
    warranty: 'extended',
  }

  const handlePaymentSelect = (method) => {
    setSelectedPayment(method)
    console.log('Payment method selected:', method.label)
  }

  const handleZoneSelect = (zone) => {
    setSelectedZone(zone)
    console.log('Delivery zone selected:', zone.name)
  }

  const handleSaveNotificationPrefs = (prefs) => {
    console.log('Notification preferences saved:', prefs)
    setShowNotificationPrefs(false)
  }

  const handleRedeemPoints = (points) => {
    if (userPoints >= points) {
      setUserPoints(userPoints - points)
      console.log(`${points} points redeemed!`)
    }
  }

  // Calculate price
  const priceInfo = {
    current: formatPriceBD(sampleProduct.price),
    original: formatPriceBD(sampleProduct.originalPrice),
    savings: formatSavings(sampleProduct.originalPrice, sampleProduct.price),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER SECTION */}
      <div className="bg-white border-b p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          ইকমার্স চেকআউট - সম্পূর্ণ উদাহরণ
        </h1>
        <p className="text-gray-600 mt-2">সকল Bangladesh UI/UX কম্পোনেন্ট প্রদর্শনী</p>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
        {/* NOTIFICATION BANNER */}
        <section>
          <h2 className="text-xl font-bold mb-4">1. SMS নোটিফিকেশন ব্যানার</h2>
          <SMSNotifications
            message="আপনার অর্ডার সফলভাবে নিশ্চিত হয়েছে! ট্র্যাকিং নম্বর: BD123456"
            type="success"
            onClose={() => console.log('Banner closed')}
          />
        </section>

        {/* TRUST SIGNALS */}
        <section className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">2. বিশ্বাস সংকেত</h2>
          <TrustSignals />
        </section>

        {/* PRODUCT SECTION */}
        <section className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-6">3. পণ্য তথ্য ও ব্যাজ</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image Placeholder */}
            <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
              <p className="text-gray-600">পণ্যের ছবি</p>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">{sampleProduct.name}</h3>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <PopularityBadge type="bestseller" />
                  <DeliverySpeedBadge days={sampleProduct.deliveryDays} highlight={true} />
                </div>

                {/* Urgency Indicator */}
                <div className="mb-4">
                  <UrgencyIndicator type="stock" count={sampleProduct.stock} threshold={10} />
                </div>
              </div>

              {/* Price Section */}
              <div className="border-t border-b py-4 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-orange-600">{priceInfo.current}</span>
                  <span className="text-lg text-gray-400 line-through">{priceInfo.original}</span>
                </div>
                <div className="text-red-600 font-bold text-lg">{priceInfo.savings.text}</div>
              </div>

              {/* Delivery Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>ডেলিভারি:</strong> {formatDeliveryMessage(sampleProduct.deliveryDays)}
                </p>
                <p className="text-sm">
                  <strong>নিরাপদ পেমেন্ট</strong> এবং <strong>৭ দিনের রিটার্ন</strong>
                </p>
              </div>

              {/* Reviews */}
              <div className="text-sm">
                <p className="font-bold mb-1">
                  ⭐ {sampleProduct.rating} ({sampleProduct.reviews.toLocaleString('bn-BD')} মতামত)
                </p>
                <p className="text-gray-600">গ্রাহক সন্তুষ্টি: অত্যন্ত সন্তোষজনক</p>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition">
                  কার্টে যোগ করুন
                </button>
                <button className="flex-1 bg-white text-orange-500 font-bold py-3 rounded-lg border-2 border-orange-500 hover:bg-orange-50 transition">
                  এখনই কিনুন
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SEASONAL CAMPAIGNS */}
        <section className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">4. মৌসুমী প্রচারাভিযান</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SeasonalCampaign campaignId="pohela-boishakh" />
            <SeasonalCampaign campaignId="eid-ul-fitr" />
          </div>
        </section>

        {/* PAYMENT METHODS */}
        <section className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">5. পেমেন্ট পদ্ধতি নির্বাচন</h2>
          <PaymentMethods onSelect={handlePaymentSelect} selectedMethod={selectedPayment} />

          {selectedPayment && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                ✓ নির্বাচিত: <strong>{selectedPayment.label}</strong>
              </p>
            </div>
          )}
        </section>

        {/* DELIVERY ZONES */}
        <section className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">6. ডেলিভারি অঞ্চল নির্বাচন</h2>
          <DeliveryZones onSelect={handleZoneSelect} selectedZone={selectedZone} />

          {selectedZone && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                ✓ নির্বাচিত অঞ্চল: <strong>{selectedZone.name}</strong>
              </p>
              <p className="text-sm text-gray-700 mt-2">
                স্ট্যান্ডার্ড শিপিং: {selectedZone.standardShipping.cost} টাকা (
                {selectedZone.standardShipping.days})
              </p>
            </div>
          )}
        </section>

        {/* LOYALTY PROGRAM */}
        <section className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">7. আনুগত্য প্রোগ্রাম</h2>
          <BanglaLoyaltyProgram
            userPoints={userPoints}
            userTier="Silver"
            onRedeem={handleRedeemPoints}
          />
        </section>

        {/* SMS NOTIFICATION PREFERENCES */}
        <section className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">8. SMS নোটিফিকেশন সেটিংস</h2>
          <button
            onClick={() => setShowNotificationPrefs(!showNotificationPrefs)}
            className="mb-4 bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            {showNotificationPrefs ? 'সেটিংস লুকান' : 'নোটিফিকেশন সেটিংস খুলুন'}
          </button>

          {showNotificationPrefs && (
            <SMSNotificationPreferences onSave={handleSaveNotificationPrefs} />
          )}
        </section>

        {/* ORDER SUMMARY */}
        <section className="bg-white p-6 rounded-lg border-2 border-orange-300">
          <h2 className="text-xl font-bold mb-4">অর্ডার সংক্ষিপ্ত তথ্য</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>পণ্যের মূল্য:</span>
              <span className="font-bold">{priceInfo.current}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>ছাড়:</span>
              <span className="font-bold">-{priceInfo.savings.amount}</span>
            </div>

            {selectedZone && (
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-bold">{selectedZone.standardShipping.cost} টাকা</span>
              </div>
            )}

            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>মোট পরিমাণ:</span>
              <span className="text-orange-600">
                {formatPriceBD(sampleProduct.price + (selectedZone?.standardShipping.cost || 0))}
              </span>
            </div>
          </div>

          <button className="w-full mt-6 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition">
            অর্ডার নিশ্চিত করুন
          </button>
        </section>

        {/* CODE EXAMPLES */}
        <section className="bg-gray-900 text-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">📝 কোড উদাহরণ</h2>

          <div className="space-y-4 text-sm">
            <div>
              <p className="font-bold mb-2">✓ মূল্য ফরম্যাটিং</p>
              <code className="bg-gray-800 p-2 rounded block">
                {`const price = formatPriceBD(4999)  // ৳৪,৯৯৯`}
              </code>
            </div>

            <div>
              <p className="font-bold mb-2">✓ বাংলা বার্তা</p>
              <code className="bg-gray-800 p-2 rounded block">
                {`const msg = getMessage('addCart')  // কার্টে যোগ করুন`}
              </code>
            </div>

            <div>
              <p className="font-bold mb-2">✓ জরুরি সূচক</p>
              <code className="bg-gray-800 p-2 rounded block">
                {`<UrgencyIndicator type="stock" count={5} />`}
              </code>
            </div>

            <div>
              <p className="font-bold mb-2">✓ সমস্ত কম্পোনেন্ট আমদানি করুন</p>
              <code className="bg-gray-800 p-2 rounded block">
                {`import { PaymentMethods, DeliveryZones, ... } from '@/components/Bangladesh'`}
              </code>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default BangladeshCheckoutExample
