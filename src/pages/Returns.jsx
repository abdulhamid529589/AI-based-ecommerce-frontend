import { useState } from 'react'
import { ArrowLeft, FileText, Clock, DollarSign, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSystemSettings } from '../hooks/useSystemSettings'
import Breadcrumb from '../components/Navigation/Breadcrumb'

const Returns = () => {
  const { settings, loading } = useSystemSettings()
  const [activeTab, setActiveTab] = useState('policy')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-20">
        <p className="text-gray-600 dark:text-gray-400">Loading return policy...</p>
      </div>
    )
  }

  const returnSettings = settings?.returns || {
    returnEnabled: true,
    returnWindowDays: 30,
    refundProcessingDays: 5,
    restockingFee: 5,
  }

  if (!returnSettings.returnEnabled) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb />
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-card rounded-lg shadow-lg p-8 text-center">
              <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Returns Disabled</h1>
              <p className="text-muted-foreground mb-6">
                Returns are currently not available on our platform. Please contact our customer
                support team if you have any issues with your purchase.
              </p>
              <Link
                to="/contact"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Header */}
        <div className="max-w-4xl mx-auto mt-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <ArrowLeft className="w-6 h-6 text-blue-600" />
            <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Back Home
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-2">Return & Refund Policy</h1>
          <p className="text-muted-foreground text-lg">
            We want you to be completely satisfied with your purchase. If you're not happy, we make
            returns easy.
          </p>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex gap-2 border-b dark:border-gray-700">
            {[
              { id: 'policy', label: '📋 Return Policy', icon: FileText },
              { id: 'process', label: '🔄 How to Return', icon: Clock },
              { id: 'faq', label: '❓ FAQ', icon: AlertCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* POLICY TAB */}
          {activeTab === 'policy' && (
            <div className="bg-card rounded-lg shadow-lg p-8 space-y-8">
              {/* Return Window */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                  Return Window
                </h2>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-6">
                  <p className="text-lg text-gray-800 dark:text-gray-200">
                    You have{' '}
                    <span className="font-bold text-2xl text-blue-600">
                      {returnSettings.returnWindowDays} days
                    </span>{' '}
                    from the date of purchase to initiate a return.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Items must be in original condition, unused, and with all original packaging and
                    documentation.
                  </p>
                </div>
              </div>

              {/* Refund Processing */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  Refund Processing
                </h2>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-6">
                  <p className="text-lg text-gray-800 dark:text-gray-200">
                    Once we receive and inspect your returned item, refunds will be processed within{' '}
                    <span className="font-bold text-green-600">
                      {returnSettings.refundProcessingDays} business days
                    </span>
                    .
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Refunds will be credited to your original payment method.
                  </p>
                </div>
              </div>

              {/* Restocking Fee */}
              {returnSettings.restockingFee > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Restocking Fee</h2>
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900 rounded-lg p-6">
                    <p className="text-lg text-gray-800 dark:text-gray-200">
                      A{' '}
                      <span className="font-bold text-orange-600">
                        {returnSettings.restockingFee}%
                      </span>{' '}
                      restocking fee will be deducted from your refund to cover handling and
                      inspection costs.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Example: If you return a ৳10,000 item, you'll receive ৳
                      {(10000 - 10000 * (returnSettings.restockingFee / 100)).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              {/* What's Returnable */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">What Can Be Returned?</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                    <h3 className="font-bold text-green-700 dark:text-green-400 mb-3">
                      ✓ Returnable
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Unused items in original packaging</li>
                      <li>• Items with all tags attached</li>
                      <li>• Defective or damaged items</li>
                      <li>• Items not as described</li>
                      <li>• Wrong item received</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
                    <h3 className="font-bold text-red-700 dark:text-red-400 mb-3">
                      ✗ Non-Returnable
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Used or worn items</li>
                      <li>• Items without original packaging</li>
                      <li>• Customized or personalized items</li>
                      <li>• Clearance or final sale items</li>
                      <li>• Perishable items</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROCESS TAB */}
          {activeTab === 'process' && (
            <div className="bg-card rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-foreground mb-8">How to Return an Item</h2>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-lg">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      Request Return Authorization
                    </h3>
                    <p className="text-muted-foreground">
                      Contact our customer support team within {returnSettings.returnWindowDays}{' '}
                      days of purchase to request a return. Provide your order number and reason for
                      return.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-lg">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      Receive Prepaid Shipping Label
                    </h3>
                    <p className="text-muted-foreground">
                      We'll send you a prepaid shipping label via email. Use this label to ship the
                      item back to us at no cost.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-lg">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Ship the Item Back</h3>
                    <p className="text-muted-foreground">
                      Pack the item securely in its original packaging. Drop it off at any shipping
                      location. Keep your tracking number for reference.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-lg">
                      4
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">We Inspect & Process</h3>
                    <p className="text-muted-foreground">
                      Once we receive your item, we'll inspect it. If approved, your refund will be
                      processed within {returnSettings.refundProcessingDays} business days.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Support */}
              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                <h3 className="font-bold text-foreground mb-2">Need Help?</h3>
                <p className="text-muted-foreground mb-4">
                  Contact our customer support team for any questions about returns.
                </p>
                <Link
                  to="/contact"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          )}

          {/* FAQ TAB */}
          {activeTab === 'faq' && (
            <div className="bg-card rounded-lg shadow-lg p-8 space-y-6">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                {[
                  {
                    q: 'When can I return an item?',
                    a: `You have ${returnSettings.returnWindowDays} days from your purchase date to initiate a return. The item must be unused and in original packaging.`,
                  },
                  {
                    q: 'How long does refund processing take?',
                    a: `Once we receive and inspect your returned item, refunds are typically processed within ${returnSettings.refundProcessingDays} business days. You'll see the credit in your original payment method.`,
                  },
                  {
                    q: 'Do I have to pay for return shipping?',
                    a: 'No! We provide a prepaid shipping label for all approved returns. Return shipping is completely free.',
                  },
                  {
                    q: `What is the ${returnSettings.restockingFee}% restocking fee?`,
                    a: `The ${returnSettings.restockingFee}% restocking fee covers the cost of handling, inspection, and restocking. This fee is deducted from your refund amount.`,
                  },
                  {
                    q: 'Can I exchange an item instead of returning it?',
                    a: 'Yes! Contact our support team and we can arrange an exchange for a different size, color, or product.',
                  },
                  {
                    q: 'What if my item arrives damaged?',
                    a: 'Contact us immediately with photos of the damage. We can arrange a replacement or refund without needing to return the item.',
                  },
                  {
                    q: 'Do sale items qualify for returns?',
                    a: 'Most sale items are returnable within our standard return window. However, clearance and final sale items cannot be returned.',
                  },
                ].map((faq, idx) => (
                  <div key={idx} className="border-b dark:border-gray-700 pb-6 last:border-b-0">
                    <h3 className="font-bold text-foreground mb-3 text-lg">{faq.q}</h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Returns
