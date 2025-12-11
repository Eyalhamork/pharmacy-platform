import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mopharma.com';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get all active products for dynamic URLs
    const { data: products } = await supabase
      .from('products')
      .select('id, updated_at')
      .eq('is_available', true)
      .order('updated_at', { ascending: false });

    // Get all active categories
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, created_at')
      .eq('is_active', true);

    // Static pages with their priority and change frequency
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' }, // Homepage
      { url: '/products', priority: '0.9', changefreq: 'daily' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/how-it-works', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/faq', priority: '0.7', changefreq: 'monthly' },
      { url: '/track-order', priority: '0.6', changefreq: 'weekly' },
      { url: '/shipping-delivery', priority: '0.6', changefreq: 'monthly' },
      { url: '/returns-policy', priority: '0.6', changefreq: 'monthly' },
      { url: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
      { url: '/terms-of-service', priority: '0.5', changefreq: 'yearly' },
      { url: '/login', priority: '0.6', changefreq: 'monthly' },
      { url: '/signup', priority: '0.6', changefreq: 'monthly' },
      { url: '/cart', priority: '0.7', changefreq: 'weekly' },
    ];

    // Build XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
  ${
    categories
      ?.map(
        (category) => `
  <url>
    <loc>${BASE_URL}/products?category=${category.slug}</loc>
    <lastmod>${new Date(category.created_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      )
      .join('') || ''
  }
  ${
    products
      ?.map(
        (product) => `
  <url>
    <loc>${BASE_URL}/products/${product.id}</loc>
    <lastmod>${new Date(product.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
      )
      .join('') || ''
  }
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
