/**
 * i18next Configuration
 * Internationalization setup for multi-language support
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Header
      'nav.home': 'Home',
      'nav.services': 'Services',
      'nav.portfolio': 'Portfolio',
      'nav.contact': 'Contact',

      // Hero
      'hero.title': 'Premium Printing Solutions',
      'hero.subtitle':
        'Transforming your vision into vibrant reality with cutting-edge printing technology',
      'hero.cta.upload': 'Upload File',
      'hero.cta.whatsapp': 'WhatsApp Us',

      // Services
      'services.title': 'Our Services',
      'services.subtitle': 'Comprehensive printing solutions for all your business needs',

      // Portfolio
      'portfolio.title': 'Our Portfolio',
      'portfolio.subtitle':
        'Explore our collection of premium print work showcasing quality, creativity, and attention to detail',
      'portfolio.filter.all': 'All',
      'portfolio.loadMore': 'Load More',
      'portfolio.showLess': 'Show Less',

      // Contact
      'contact.title': 'Get In Touch',
      'contact.subtitle':
        "We'd love to hear from you. Send us a message and we'll respond as soon as possible",
      'contact.form.name': 'Your Name',
      'contact.form.email': 'Email Address',
      'contact.form.phone': 'Phone Number',
      'contact.form.message': 'Your Message',
      'contact.form.submit': 'Send Message',
      'contact.form.sending': 'Sending...',

      // Why Choose Us
      'whyChooseUs.title': 'Why Choose Us',
      'whyChooseUs.quality.title': 'Premium Quality',
      'whyChooseUs.quality.desc':
        'State-of-the-art printing technology ensuring exceptional results',
      'whyChooseUs.fast.title': 'Fast Turnaround',
      'whyChooseUs.fast.desc': 'Quick delivery without compromising on quality',
      'whyChooseUs.support.title': 'Expert Support',
      'whyChooseUs.support.desc': 'Dedicated team ready to assist with your printing needs',

      // Common
      'common.loading': 'Loading...',
      'common.error': 'An error occurred',
      'common.tryAgain': 'Try Again',
      'common.close': 'Close',
    },
  },
  // Add more languages as needed
  // hi: { translation: { ... } }, // Hindi
  // gu: { translation: { ... } }, // Gujarati
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false, // React already escapes
  },

  // Only load in development
  debug: import.meta.env.DEV,
});

export default i18n;
