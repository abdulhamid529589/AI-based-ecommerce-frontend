import { useState } from 'react'
import { CreditCard, Smartphone, DollarSign, Truck } from 'lucide-react'
import BkashPayment from './BkashPayment'
import NagadPayment from './NagadPayment'
import RocketPayment from './RocketPayment'
import './PaymentMethods.css'

const PaymentMethods = ({ orderId, amount, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('bkash')
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const paymentMethods = [
    {
      id: 'bkash',
      name: 'bKash',
      icon: <Smartphone className="w-8 h-8" />,
      description: 'Pay instantly with bKash',
      color: 'from-red-500 to-red-600',
    },
    {
      id: 'nagad',
      name: 'Nagad',
      icon: <CreditCard className="w-8 h-8" />,
      description: 'Pay with Nagad',
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'rocket',
      name: 'Rocket',
      icon: <DollarSign className="w-8 h-8" />,
      description: 'Pay with Rocket',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <Truck className="w-8 h-8" />,
      description: 'Pay when you receive',
      color: 'from-green-500 to-green-600',
    },
  ]

  const handleProceed = () => {
    if (selectedMethod === 'cod') {
      // Direct COD without form
      setShowPaymentForm(true)
    } else {
      setShowPaymentForm(true)
    }
  }

  return (
    <div className="payment-container">
      <div className="payment-wrapper">
        <h2 className="payment-title">Select Payment Method</h2>
        <p className="payment-subtitle">Choose how you want to pay</p>

        <div className="payment-grid">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`payment-card ${selectedMethod === method.id ? 'active' : ''}`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className={`payment-icon bg-gradient-to-r ${method.color}`}>{method.icon}</div>
              <h3 className="payment-name">{method.name}</h3>
              <p className="payment-description">{method.description}</p>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Order ID:</span>
            <span className="font-semibold">{orderId}</span>
          </div>
          <div className="summary-row">
            <span>Amount:</span>
            <span className="font-semibold text-lg">৳ {amount.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Payment Method:</span>
            <span className="font-semibold">
              {paymentMethods.find((m) => m.id === selectedMethod)?.name}
            </span>
          </div>
        </div>

        {/* Payment Forms */}
        {showPaymentForm && selectedMethod === 'bkash' && (
          <BkashPayment orderId={orderId} amount={amount} onSuccess={onPaymentSuccess} />
        )}

        {showPaymentForm && selectedMethod === 'nagad' && (
          <NagadPayment orderId={orderId} amount={amount} onSuccess={onPaymentSuccess} />
        )}

        {showPaymentForm && selectedMethod === 'rocket' && (
          <RocketPayment orderId={orderId} amount={amount} onSuccess={onPaymentSuccess} />
        )}

        {showPaymentForm && selectedMethod === 'cod' && (
          <div className="cod-confirmation">
            <div className="confirmation-icon">
              <Truck className="w-12 h-12 text-green-600" />
            </div>
            <h4>Cash on Delivery</h4>
            <p>You will pay when the delivery agent arrives at your location.</p>
            <button
              className="btn-confirm"
              onClick={() => onPaymentSuccess({ method: 'COD', orderId })}
            >
              Confirm Order
            </button>
          </div>
        )}

        {!showPaymentForm && (
          <button className="btn-proceed" onClick={handleProceed}>
            Proceed to Payment
          </button>
        )}

        {showPaymentForm && selectedMethod !== 'cod' && (
          <button className="btn-back" onClick={() => setShowPaymentForm(false)}>
            ← Back to Methods
          </button>
        )}
      </div>
    </div>
  )
}

export default PaymentMethods
