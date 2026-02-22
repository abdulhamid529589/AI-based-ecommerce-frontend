import React, { useState } from 'react'
import BangladeshConfig from '../../config/BangladeshConfig'

export const DeliveryZones = ({ onSelect, selectedZone: initialZone }) => {
  const zones = BangladeshConfig.deliveryZones
  const [selectedZone, setSelectedZone] = useState(initialZone || null)

  const handleZoneSelect = (zone) => {
    setSelectedZone(zone)
    onSelect(zone)
  }

  return (
    <div className="delivery-zones">
      <h2 className="text-xl font-bold mb-4">ডেলিভারি বিকল্প নির্বাচন করুন</h2>

      <div className="space-y-3">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className={`zone-option p-4 border-2 rounded-lg cursor-pointer transition ${
              selectedZone?.id === zone.id ? 'border-green-500 bg-green-50' : 'border-gray-300'
            }`}
            onClick={() => handleZoneSelect(zone)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-bold">{zone.name}</h3>
                <p className="text-sm text-gray-600">{zone.cities?.join(', ')}</p>
              </div>
              <input
                type="radio"
                checked={selectedZone?.id === zone.id}
                onChange={() => handleZoneSelect(zone)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              {zone.standardShipping && (
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-xs text-gray-600 font-semibold">স্ট্যান্ডার্ড ডেলিভারি</p>
                  <p className="font-bold text-lg">৳{zone.standardShipping.cost}</p>
                  <p className="text-xs text-gray-600">{zone.standardShipping.days}</p>
                </div>
              )}
              {zone.expressShipping && (
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-xs text-gray-600 font-semibold">এক্সপ্রেস ডেলিভারি</p>
                  <p className="font-bold text-lg">৳{zone.expressShipping.cost}</p>
                  <p className="text-xs text-gray-600">{zone.expressShipping.days}</p>
                </div>
              )}
            </div>

            {zone.freeShippingThreshold && (
              <p className="text-xs text-green-600 mt-2 font-semibold">
                ✓ ৳{zone.freeShippingThreshold} এর উপরে ফ্রি শিপিং
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeliveryZones
