/**
 * Application Constants
 *
 * Centralized configuration for:
 * - Contact information (phone, email, address, business hours)
 * - Social media links
 * - Company metadata
 *
 * All constants are marked as `const` to ensure immutability at compile time.
 */

/**
 * CONTACT
 *
 * Business contact details used throughout the application.
 *
 * - `phone`: Full phone number with country code (for tel: links)
 * - `phoneDisplay`: Formatted phone number for UI display
 * - `phoneRaw`: Phone number without + or formatting (for WhatsApp URLs)
 * - `address`: Business address split into 3 lines
 * - `mapsUrl`: Google Maps link to business location
 * - `businessHours`: Operating hours for weekdays and Sunday
 */
export const CONTACT = {
  phone: '+919377476343',
  phoneDisplay: '+91 9377 476 343',
  phoneRaw: '919377476343',
  email: 'parasgph@gmail.com',
  address: {
    line1: '2, Chandrika Chamber, Mirzapur Rd,',
    line2: 'Opposite Jansatta Karyalay, Mirzapur,',
    line3: 'Ahmedabad, Gujarat 380001',
  },
  mapsUrl: 'https://maps.app.goo.gl/yt63M1mqnfSYL9he8',
  businessHours: {
    weekdays: 'Mon – Sat: 9 AM – 7 PM',
    sunday: 'Sunday: Closed',
  },
} as const;

/**
 * SOCIAL_MEDIA
 *
 * Social media profile links.
 * Currently set to '#' placeholders - update with actual profile URLs.
 */
export const SOCIAL_MEDIA = {
  facebook: '#',
  instagram: '#',
  linkedin: '#',
} as const;

/**
 * COMPANY
 *
 * Company metadata for branding and footer information.
 *
 * - `name`: Official company name
 * - `tagline`: Short brand tagline
 * - `foundedYear`: Year the company was established
 * - `description`: Brief company description
 */
export const COMPANY = {
  name: 'Paras Graphics',
  tagline: 'Premium Printing',
  foundedYear: 1997,
  description: 'Your trusted print partner in Ahmedabad for premium quality and fast turnarounds.',
} as const;


