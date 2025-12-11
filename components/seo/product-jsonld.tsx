// components/seo/product-jsonld.tsx
// Schema.org JSON-LD structured data for products (SEO)

import { activeTheme } from '@/lib/theme-config';
import type { Database } from '@/lib/types/database';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductWithCategory extends Product {
  category?: {
    name: string;
    slug: string;
  } | null;
}

interface ProductJsonLdProps {
  product: ProductWithCategory;
  url: string;
}

/**
 * Generate Schema.org Product structured data
 * Helps search engines understand product information
 */
export function ProductJsonLd({ product, url }: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} available at ${activeTheme.name}`,
    image: product.image_url || `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`,
    sku: product.sku || product.id,
    brand: product.brand_name ? {
      '@type': 'Brand',
      name: product.brand_name,
    } : undefined,
    manufacturer: product.brand_name ? {
      '@type': 'Organization',
      name: product.brand_name,
    } : undefined,
    category: product.category?.name || 'Medications',
    offers: {
      '@type': 'Offer',
      url: url,
      priceCurrency: 'USD',
      price: product.price.toFixed(2),
      availability: product.is_available && product.stock_quantity > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: activeTheme.name,
      },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    ...(product.requires_prescription && {
      additionalProperty: {
        '@type': 'PropertyValue',
        name: 'Prescription Required',
        value: 'Yes',
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * Generate Schema.org Organization structured data
 * For the pharmacy business
 */
export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Pharmacy',
    name: activeTheme.name,
    description: `${activeTheme.name} - Online pharmacy serving Monrovia, Liberia with fast delivery and secure payments.`,
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`,
    image: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`,
    telephone: activeTheme.contact.phone,
    email: activeTheme.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: activeTheme.contact.address,
      addressLocality: 'Monrovia',
      addressRegion: 'Montserrado',
      addressCountry: 'LR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 6.3156,
      longitude: -10.8074,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    priceRange: '$$',
    paymentAccepted: ['MTN Mobile Money', 'Cash'],
    currenciesAccepted: 'USD',
    areaServed: {
      '@type': 'City',
      name: 'Monrovia',
    },
    sameAs: [
      // Add social media links here when available
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * Generate Schema.org BreadcrumbList structured data
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * Generate Schema.org WebSite structured data with search
 */
export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: activeTheme.name,
    url: process.env.NEXT_PUBLIC_APP_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * Generate Schema.org FAQPage structured data
 */
interface FAQItem {
  question: string;
  answer: string;
}

export function FAQJsonLd({ faqs }: { faqs: FAQItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
