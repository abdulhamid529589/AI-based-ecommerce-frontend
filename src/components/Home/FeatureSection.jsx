import { Truck, Shield, Headphones, CreditCard } from 'lucide-react'

const FeatureSection = () => {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50 worldwide',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure payment with SSL encryption',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated customer support available anytime',
    },
    {
      icon: CreditCard,
      title: 'Easy Returns',
      description: '30-day return policy for your peace of mind',
    },
  ]

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-0">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-foreground">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-4 sm:p-5 md:p-6 text-center hover:glow-on-hover animate-smooth hover:scale-105 transition-transform"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-foreground" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureSection
