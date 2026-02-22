import { useState } from 'react'
import { axiosInstance } from '../../lib/axios'
import { toast } from 'react-toastify'
import { Loader } from 'lucide-react'
import { getOperationErrorMessage } from '../../utils/errorHandler'

const NagadPayment = ({ orderId, amount, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleNagadPayment = async (e) => {
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
      const response = await axiosInstance.post('/payment/nagad/initiate', {
        orderId,
        amount,
        customerEmail: email,
        customerPhone: phoneNumber,
      })

      if (response.data.success) {
        // Redirect to Nagad payment URL with payment data
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = response.data.paymentURL

        Object.keys(response.data.paymentData).forEach((key) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = response.data.paymentData[key]
          form.appendChild(input)
        })

        document.body.appendChild(form)
        form.submit()
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
      <h4 className="form-title">Nagad Payment</h4>
      <p className="form-description">You will be redirected to Nagad checkout page</p>

      <form onSubmit={handleNagadPayment}>
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
            'Pay with Nagad'
          )}
        </button>
      </form>

      <div className="payment-info">
        <h5>How it works:</h5>
        <ol>
          <li>Enter your Nagad registered phone number</li>
          <li>You will be redirected to Nagad website</li>
          <li>Enter your Nagad PIN to complete payment</li>
          <li>Return to our website for confirmation</li>
        </ol>
      </div>
    </div>
  )
}

export default NagadPayment
