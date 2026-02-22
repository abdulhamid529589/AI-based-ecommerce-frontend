import { useSearchParams, Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'

const PaymentFailed = () => {
  const [searchParams] = useSearchParams()
  const paymentID = searchParams.get('paymentID')

  return (
    <div className="payment-status-page">
      <div className="status-container failed-container">
        <div className="status-icon failed-icon">
          <AlertCircle className="w-16 h-16" />
        </div>

        <h1 className="status-title">Payment Failed</h1>
        <p className="status-message">
          Unfortunately, your payment could not be processed. Please try again.
        </p>

        <div className="failed-details">
          <p className="detail-text">
            If you continue to experience issues, please contact our support team or try a different
            payment method.
          </p>
          {paymentID && (
            <p className="transaction-id">
              Payment ID: <code>{paymentID}</code>
            </p>
          )}
        </div>

        <div className="status-actions">
          <Link to="/payment" className="btn-primary">
            Try Again
          </Link>
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>

        <div className="status-info">
          <h4>Why did my payment fail?</h4>
          <ul>
            <li>Insufficient balance in your account</li>
            <li>Incorrect payment details</li>
            <li>Payment gateway temporary issue</li>
            <li>Connection timeout during payment</li>
          </ul>
          <p className="support-text">For support, please contact us at support@bedtex.com</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailed
