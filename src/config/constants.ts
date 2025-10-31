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

/**
 * Performance Configuration
 */
export const PERFORMANCE = {
  // Lazy loading thresholds
  lazyLoadThreshold: '50px', // Distance before lazy loading triggers

  // Animation settings
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,

  // Debounce/Throttle timings
  scrollDebounce: 100, // ms
  resizeDebounce: 200, // ms
  searchDebounce: 300, // ms
} as const;

/**
 * UI Configuration
 */
export const UI = {
  // Display limits
  initialServicesDisplay: 9, // 3x3 grid
  initialPortfolioDisplay: 12, // 4x3 grid
  maxPortfolioItems: 50,

  // Animation durations
  transitionDuration: 300, // ms
  toastDuration: 4000, // ms

  // Breakpoints (matching Tailwind)
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
} as const;

/**
 * API Configuration
 */
export const API = {
  // Sanity CMS
  sanityProjectId: import.meta.env.VITE_SANITY_PROJECT_ID || '',
  sanityDataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  sanityApiVersion: '2024-01-01',

  // Cache settings
  cacheTime: 1000 * 60 * 10, // 10 minutes
  staleTime: 1000 * 60 * 5, // 5 minutes
} as const;
