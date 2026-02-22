import { Shield, Truck, RotateCcw, Headphones, Lock, Award } from 'lucide-react'
import '../../styles/TrustSignals.css'

const TrustSignals = () => {
  const signals = [
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure transactions with SSL encryption',
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over ৳500',
    },
    {
      icon: RotateCcw,
      title: '30-Day Returns',
      description: 'Easy return policy for your peace of mind',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated customer service always available',
    },
    {
      icon: Lock,
      title: 'Data Privacy',
      description: 'Your information is always protected',
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'All products verified and authentic',
    },
  ]

  return (
    <div className="trust-signals-section">
      <div className="trust-signals-grid">
        {signals.map((signal, index) => {
          const Icon = signal.icon
          return (
            <div key={index} className="trust-signal-card">
              <div className="signal-icon">
                <Icon className="w-6 h-6" />
              </div>
              <div className="signal-content">
                <h3 className="signal-title">{signal.title}</h3>
                <p className="signal-description">{signal.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TrustSignals
