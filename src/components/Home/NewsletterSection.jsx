import { useState } from 'react'
import { Mail, Send } from 'lucide-react'

const NewsletterSection = () => {
  const [email, setEmail] = useState('')

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6">
      <div className="glass-panel text-center px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-6 gradient-primary rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-foreground" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Stay in the Loop
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
            Subscribe to our newsletter and be the first to know about exclusive deals, new
            arrivals, and special offers.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground text-sm min-h-[44px]"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 sm:px-8 py-3 sm:py-4 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold flex items-center justify-center space-x-2 min-h-[44px] text-sm sm:text-base whitespace-nowrap"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Subscribe</span>
              <span className="sm:hidden">Join</span>
            </button>
          </form>

          <p className="text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}

export default NewsletterSection
