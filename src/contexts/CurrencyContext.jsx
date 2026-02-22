import { createContext, useContext, useState } from 'react'
import { formatBDT, getCurrencyConfig } from '../lib/currencyFormatter'

const CurrencyContext = createContext()

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('BDT')
  const [locale, setLocale] = useState('bn-BD')

  const value = {
    currency,
    setCurrency,
    locale,
    setLocale,
    config: getCurrencyConfig(),
  }

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext)

  if (!context) {
    console.warn('useCurrency called outside CurrencyProvider, using default currency')
    // Return safe defaults instead of crashing
    return {
      currency: 'BDT',
      setCurrency: () => console.warn('setCurrency called outside CurrencyProvider'),
      locale: 'bn-BD',
      setLocale: () => console.warn('setLocale called outside CurrencyProvider'),
      config: getCurrencyConfig(),
    }
  }

  return context
}
