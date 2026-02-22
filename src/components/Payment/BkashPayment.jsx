import { useState } from 'react'
import { axiosInstance } from '../../lib/axios'
import { toast } from 'react-toastify'
import { Loader } from 'lucide-react'
import { getOperationErrorMessage } from '../../utils/errorHandler'

const BkashPayment = ({ orderId, amount, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleBkashPayment = async (e) => {
    e.preventDefault()
    setError('')

    if (!phoneNumber || !email) {
      setError('Please enter phone number and email')
      return
    }

    if (!phoneNumber.match(/^01[0-9]{9}$/)) {
      setError('Please enter a valid Bangladesh phone number (01XXXXXXXXX)')
      return
    }

    setLoading(true)

    try {
      const response = await axiosInstance.post('/payment/bkash/initiate', {
        orderId,
        amount,
        customerEmail: email,
        customerPhone: phoneNumber,
      })

      if (response.data.success) {
        // Redirect to bKash payment URL
        window.location.href = response.data.paymentURL
      }
    } catch (error) {
      const errorMessage = getOperationErrorMessage('payment', error)
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="payment-form">
      <h4 className="form-title">bKash Payment</h4>
      <p className="form-description">You will be redirected to bKash checkout page</p>

      <form onSubmit={handleBkashPayment}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            placeholder="01700000000"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={loading}
            required
          />
          <small>Format: 01XXXXXXXXX (Bangladesh number)</small>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="amount-display">
          <span>Total Amount:</span>
          <span className="amount">৳ {amount.toLocaleString()}</span>
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Pay with bKash'
          )}
        </button>
      </form>

      <div className="payment-info">
        <h5>How it works:</h5>
        <ol>
          <li>Enter your bKash registered phone number</li>
          <li>You will be redirected to bKash website</li>
          <li>Enter your bKash PIN to complete payment</li>
          <li>Return to our website for confirmation</li>
        </ol>
      </div>
    </div>
  )
}

export default BkashPayment
