/**
 * District to Shipping Zone Mapping
 * Maps all 64 Bangladesh districts to their corresponding shipping zones for cost calculation
 *
 * Structure:
 * - Zone 1: Chattogram Division (11 districts) = ৳60
 * - Zone 2: All Other Districts (53 districts) = ৳100
 */

// Complete list of all 64 Bangladesh districts mapped to zone IDs
const DISTRICT_TO_ZONE = {
  // Dhaka Division (13 Districts) → Zone 2 (All Other Districts)
  Dhaka: 2,
  Faridpur: 2,
  Gazipur: 2,
  Gopalganj: 2,
  Kishoreganj: 2,
  Madaripur: 2,
  Manikganj: 2,
  Munshiganj: 2,
  Narayanganj: 2,
  Narsingdi: 2,
  Rajbari: 2,
  Shariatpur: 2,
  Tangail: 2,

  // Chattogram Division (11 Districts) → Zone 1 (Chattogram)
  Chattogram: 1,
  Bandarban: 1,
  Brahmanbaria: 1,
  Chandpur: 1,
  Comilla: 1,
  "Cox's Bazar": 1,
  Feni: 1,
  Khagrachhari: 1,
  Lakshmipur: 1,
  Noakhali: 1,
  Rangamati: 1,

  // Khulna Division (10 Districts) → Zone 2 (All Other Districts)
  Bagerhat: 2,
  Chuadanga: 2,
  Jashore: 2,
  Jhenaidah: 2,
  Khulna: 2,
  Kushtia: 2,
  Magura: 2,
  Meherpur: 2,
  Narail: 2,
  Satkhira: 2,

  // Rajshahi Division (8 Districts) → Zone 2 (All Other Districts)
  Bogura: 2,
  Joypurhat: 2,
  Naogaon: 2,
  Natore: 2,
  'Chapai Nawabganj': 2,
  Pabna: 2,
  Rajshahi: 2,
  Sirajganj: 2,

  // Rangpur Division (8 Districts) → Zone 2 (All Other Districts)
  Dinajpur: 2,
  Gaibandha: 2,
  Kurigram: 2,
  Lalmonirhat: 2,
  Nilphamari: 2,
  Panchagarh: 2,
  Rangpur: 2,
  Thakurgaon: 2,

  // Barishal Division (6 Districts) → Zone 2 (All Other Districts)
  Barguna: 2,
  Barishal: 2,
  Bhola: 2,
  Jhalokati: 2,
  Patuakhali: 2,
  Pirojpur: 2,

  // Sylhet Division (4 Districts) → Zone 2 (All Other Districts)
  Habiganj: 2,
  Maulvibazar: 2,
  Sunamganj: 2,
  Sylhet: 2,

  // Mymensingh Division (4 Districts) → Zone 2 (All Other Districts)
  Jamalpur: 2,
  Mymensingh: 2,
  Netrokona: 2,
  Sherpur: 2,
}

/**
 * Get the shipping zone ID for a given district
 * @param {string} district - District name
 * @returns {number|null} Zone ID or null if district not found
 */
export const getZoneIdForDistrict = (district) => {
  if (!district || typeof district !== 'string') return null
  return DISTRICT_TO_ZONE[district] || null
}

/**
 * Get the shipping zone from settings by zone ID
 * @param {number} zoneId - Zone ID
 * @param {Array} zones - Array of shipping zones from settings
 * @returns {Object|null} Zone object or null if not found
 */
export const getZoneById = (zoneId, zones = []) => {
  if (!zoneId || !Array.isArray(zones)) return null
  return zones.find((zone) => zone.id === zoneId) || null
}

/**
 * Get shipping cost for a district based on available zones
 * @param {string} district - District name
 * @param {Array} zones - Array of shipping zones from settings
 * @returns {Object} { zoneId, zone, cost } or { zoneId: null, zone: null, cost: 0 }
 */
export const getShippingCostForDistrict = (district, zones = []) => {
  const zoneId = getZoneIdForDistrict(district)

  if (!zoneId) {
    return {
      zoneId: null,
      zone: null,
      cost: 0,
    }
  }

  const zone = getZoneById(zoneId, zones)

  return {
    zoneId,
    zone: zone || null,
    cost: zone?.cost || 0,
  }
}

/**
 * Format zone information for display
 * @param {Object} zone - Zone object from settings
 * @returns {string} Formatted zone description
 */
export const formatZoneDisplay = (zone) => {
  if (!zone) return 'No zone selected'
  return `${zone.name} (${zone.deliveryDays})`
}

/**
 * Get all districts in a specific zone
 * @param {number} zoneId - Zone ID
 * @returns {Array} Array of district names in that zone
 */
export const getDistrictsInZone = (zoneId) => {
  return Object.entries(DISTRICT_TO_ZONE)
    .filter(([, id]) => id === zoneId)
    .map(([district]) => district)
}

export default {
  DISTRICT_TO_ZONE,
  getZoneIdForDistrict,
  getZoneById,
  getShippingCostForDistrict,
  formatZoneDisplay,
  getDistrictsInZone,
}
