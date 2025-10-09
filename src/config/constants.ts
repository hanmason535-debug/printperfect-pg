/**
 * Application Constants
 * Centralized configuration for contact information and external links
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

export const SOCIAL_MEDIA = {
  facebook: '#',
  instagram: '#',
  linkedin: '#',
} as const;

export const COMPANY = {
  name: 'Paras Graphics',
  tagline: 'Premium Printing',
  foundedYear: 1997,
  description: 'Your trusted print partner in Ahmedabad for premium quality and fast turnarounds.',
} as const;
