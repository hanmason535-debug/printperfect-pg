/**
 * Application Constants
 *
 * Centralized configuration for app-wide values used across components and hooks.
 */

export const PERFORMANCE = {
  // Lazy loading thresholds
  lazyLoadThreshold: '50px',

  // Respect reduced motion when available (safe check for SSR)
  reducedMotion:
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,

  // Debounce/Throttle timings (ms)
  scrollDebounce: 100,
  resizeDebounce: 200,
  searchDebounce: 300,
} as const;

export const UI = {
  // Display limits
  initialServicesDisplay: 9,
  initialPortfolioDisplay: 12,
  maxPortfolioItems: 50,

  // Animation durations
  transitionDuration: 300,
  toastDuration: 4000,

  // Breakpoints (matching Tailwind)
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
} as const;

export const API = {
  sanityProjectId: import.meta.env.VITE_SANITY_PROJECT_ID || '',
  sanityDataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  sanityApiVersion: '2024-01-01',

  // Cache settings
  cacheTime: 1000 * 60 * 10, // 10 minutes
  staleTime: 1000 * 60 * 5, // 5 minutes
} as const;

export const CONTACT = {
  phoneRaw: import.meta.env.VITE_CONTACT_PHONE_RAW || '+919999999999',
  phone: import.meta.env.VITE_CONTACT_PHONE || '+91-99999-99999',
  phoneDisplay: import.meta.env.VITE_CONTACT_PHONE_DISPLAY || '+91 99999 99999',
  email: import.meta.env.VITE_CONTACT_EMAIL || 'info@parasgraphics.example',
  mapsUrl:
    import.meta.env.VITE_CONTACT_MAPS_URL ||
    'https://www.google.com/maps/place/Paras+Graphics/',
  address: {
    line1: '2, Chandrika Chamber, Mirzapur Rd',
    line2: 'Mirzapur, Ahmedabad',
    line3: 'Gujarat 380001',
  },
  businessHours: {
    weekdays: 'Mon - Sat: 9:00 AM - 7:00 PM',
    sunday: 'Sun: Closed',
  },
} as const;

export const SOCIAL_MEDIA = {
  facebook: import.meta.env.VITE_SOCIAL_FB || 'https://facebook.com/parasgraphics',
  instagram: import.meta.env.VITE_SOCIAL_IG || 'https://instagram.com/parasgraphics',
  linkedin: import.meta.env.VITE_SOCIAL_LI || 'https://linkedin.com/company/parasgraphics',
} as const;

export const COMPANY = {
  name: import.meta.env.VITE_COMPANY_NAME || 'Paras Graphics',
  tagline: import.meta.env.VITE_COMPANY_TAGLINE || 'Print Perfect',
  description:
    import.meta.env.VITE_COMPANY_DESC ||
    'Paras Graphics provides high-quality printing services for businesses and individuals.',
  foundedYear: import.meta.env.VITE_COMPANY_FOUNDED || 2015,
} as const;
