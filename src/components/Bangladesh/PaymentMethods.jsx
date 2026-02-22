import React, { useState } from 'react'
import BangladeshConfig from '../../config/BangladeshConfig'

export const PaymentMethods = ({ onSelect, selectedMethod }) => {
  const methods = BangladeshConfig.paymentMethods

  return (
    <div className="payment-methods">
      <h2 className="text-xl font-bold mb-4">পেমেন্ট পদ্ধতি নির্বাচন করুন</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((method) => (
          <div
            key={method.id}
            className={`payment-option p-4 border-2 rounded-lg cursor-pointer transition ${
              selectedMethod?.id === method.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => onSelect(method)}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={selectedMethod?.id === method.id}
                onChange={() => onSelect(method)}
              />
              <div className="flex-1">
                <h3 className="font-bold text-sm">{method.label}</h3>
                <p className="text-xs text-gray-600">{method.description}</p>
                <span className="text-xs text-green-600 font-bold">
                  {method.fee === 0 ? '০ টাকা চার্জ' : `${method.fee} টাকা চার্জ`}
                </span>
              </div>
            </div>
            {method.emi && (
              <span className="mt-2 inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                কিস্তি সুবিধা উপলব্ধ
              </span>
            )}
            {method.popular && (
              <span className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                সবচেয়ে জনপ্রিয়
              </span>
            )}
          </div>
        ))}
      </div>

      {selectedMethod && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>প্রক্রিয়াকরণ সময়:</strong> {selectedMethod.processingTime}
          </p>
          {selectedMethod.transactionLimit && (
            <p className="text-sm text-blue-800">
              <strong>লেনদেন সীমা:</strong> ৳{selectedMethod.transactionLimit.min} - ৳
              {selectedMethod.transactionLimit.max}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default PaymentMethods
