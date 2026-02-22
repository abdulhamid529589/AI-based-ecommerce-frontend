import { useSettings } from '../contexts/SettingsContext'

/**
 * Hook to access shop settings from global SettingsContext
 * Synced with dashboard settings for real-time updates
 */
const useShopSettings = () => {
  const { shopInfo, loading } = useSettings()

  // Map context data to expected format for backward compatibility
  const mappedShopInfo = {
    shopName: shopInfo.shopName || 'BedTex Bangladesh',
    shopEmail: shopInfo.email || 'contact@bedtex.bd',
    shopPhone: shopInfo.phone || '+880 1234 567890',
    shopAddress: shopInfo.address || 'Dhaka, Bangladesh',
    shopDescription: shopInfo.description || 'Premium bedding and home textile store',
    shopLogo: shopInfo.logo || '/logo.png',
    shopFavicon: shopInfo.favicon || '/favicon.png',
    currency: shopInfo.currency || 'BDT',
    timezone: shopInfo.timezone || 'Asia/Dhaka',
  }

  return { shopInfo: mappedShopInfo, loading }
}

export default useShopSettings
