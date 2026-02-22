import { Users, Target, Award, Heart } from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We put our customers at the heart of everything we do.',
    },
    {
      icon: Award,
      title: 'Quality Products',
      description: 'We ensure all products meet our high standards.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building lasting relationships with our customers.',
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Constantly improving our platform and services.',
    },
  ]

  return (
    <div className="min-h-screen bg-background pt-16 sm:pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 sm:mb-6">
            About Bedtex
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Your trusted online platform for premium bedding & textile products with exceptional
            service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-secondary rounded-lg sm:rounded-xl p-4 sm:p-6 text-center"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <value.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                {value.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-secondary rounded-lg sm:rounded-xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Our Story</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Founded with a vision to provide premium bedding and textile products to customers
            worldwide, Bedtex has grown to become a trusted platform for thousands of satisfied
            customers. We believe that everyone deserves access to quality products at fair prices,
            backed by exceptional customer service and care.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
