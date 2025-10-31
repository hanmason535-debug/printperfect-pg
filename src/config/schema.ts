/**
 * SEO Schema Markup
 * Structured data for search engines
 */

interface SchemaOrganization {
  '@context': string;
  '@type': string;
  name: string;
  description?: string;
  url?: string;
  logo?: string;
  address?: any;
  contactPoint?: any[];
  sameAs?: string[];
}

interface SchemaBreadcrumb {
  '@context': string;
  '@type': string;
  itemListElement: any[];
}

interface SchemaFAQ {
  '@context': string;
  '@type': string;
  mainEntity: any[];
}

export const organizationSchema: SchemaOrganization = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Paras Graphics - PrintPerfect',
  description: 'Premium printing solutions for all your business needs in Ahmedabad, Gujarat',
  url: 'https://parasgraphics.com',
  logo: 'https://parasgraphics.com/logo.png',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Your Street Address',
    addressLocality: 'Ahmedabad',
    addressRegion: 'Gujarat',
    postalCode: '380001',
    addressCountry: 'IN',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91-XXXXXXXXXX',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi', 'Gujarati'],
    },
  ],
  sameAs: [
    'https://www.facebook.com/parasgraphics',
    'https://www.instagram.com/parasgraphics',
    'https://wa.me/91XXXXXXXXXX',
  ],
};

export const createBreadcrumbSchema = (path: string): SchemaBreadcrumb => {
  const parts = path.split('/').filter(Boolean);
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://parasgraphics.com/',
    },
  ];

  let currentPath = 'https://parasgraphics.com';
  parts.forEach((part, index) => {
    currentPath += `/${part}`;
    items.push({
      '@type': 'ListItem',
      position: index + 2,
      name: part.charAt(0).toUpperCase() + part.slice(1),
      item: currentPath,
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
};

export const faqSchema: SchemaFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What printing services do you offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer a wide range of printing services including banners, business cards, brochures, flyers, posters, catalogs, wedding cards, and custom printing solutions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the turnaround time for printing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Turnaround time varies by project complexity. Most standard orders are completed within 2-3 business days. Rush orders can be accommodated for an additional fee.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you deliver in Ahmedabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we provide free delivery within Ahmedabad city limits. We also ship across India for an additional charge.',
      },
    },
    {
      '@type': 'Question',
      name: 'What file formats do you accept?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We accept PDF, AI, EPS, PSD, and high-resolution JPEG files. For best results, we recommend PDF files with embedded fonts and CMYK color mode.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you help with design?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we offer professional design services. Our team can help create or refine your designs to ensure the best print quality.',
      },
    },
  ],
};

export const createImageObjectSchema = (image: any) => ({
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  contentUrl: image.url,
  name: image.title || 'Print Work Sample',
  description: image.description || `${image.category} printing sample from Paras Graphics`,
  author: {
    '@type': 'Organization',
    name: 'Paras Graphics',
  },
});

export const serviceSchema = (service: any) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.title,
  description: service.description,
  provider: {
    '@type': 'LocalBusiness',
    name: 'Paras Graphics',
  },
  areaServed: {
    '@type': 'City',
    name: 'Ahmedabad',
  },
  category: 'Printing Services',
});
