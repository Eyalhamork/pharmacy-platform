import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mopharma.com';

export async function GET() {
  const robots = `# MoPharma Robots.txt
# Allow all search engines to crawl the site

User-agent: *
Allow: /

# Disallow private areas
Disallow: /api/
Disallow: /staff/
Disallow: /account/
Disallow: /checkout/
Disallow: /reset-password/
Disallow: /forgot-password/

# Sitemap location
Sitemap: ${BASE_URL}/sitemap.xml

# Crawl-delay for good citizenship
Crawl-delay: 1
`;

  return new NextResponse(robots, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}
