/**
 * Dynamic Sitemap Generator
 * Generates sitemap.xml from Sanity CMS data
 */

import { createClient } from '@sanity/client';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Sanity client
const projectId = process.env.VITE_SANITY_PROJECT_ID || '';
const dataset = process.env.VITE_SANITY_DATASET || 'production';

// Only create client if we have credentials
const client = projectId ? createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion: '2024-01-01',
}) : null;

// Base URL - update this to your actual domain
const BASE_URL = 'https://parasgraphics.com';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

async function generateSitemap() {
  console.log('🗺️  Generating sitemap.xml...');
  
  const urls: SitemapUrl[] = [];
  
  // Static pages
  urls.push({
    loc: `${BASE_URL}/`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '1.0',
  });
  
  try {
    // Only fetch from Sanity if client is configured
    if (!client) {
      console.log('⚠️  No Sanity credentials found, generating static sitemap only');
      throw new Error('No Sanity client');
    }
    
    // Fetch portfolio items from Sanity
    const portfolioItems = await client.fetch(`
      *[_type == "portfolioItem" && !(_id in path("drafts.**"))] {
        _id,
        _updatedAt,
        title,
        "slug": lower(title)
      }
    `);
    
    // Add portfolio items
    portfolioItems.forEach((item: any) => {
      const slug = item.slug.replace(/\s+/g, '-');
      urls.push({
        loc: `${BASE_URL}/portfolio/${slug}`,
        lastmod: item._updatedAt.split('T')[0],
        changefreq: 'monthly',
        priority: '0.7',
      });
    });
    
    console.log(`✅ Found ${portfolioItems.length} portfolio items`);
    
    // Fetch services from Sanity
    const services = await client.fetch(`
      *[_type == "service" && !(_id in path("drafts.**"))] {
        _id,
        _updatedAt,
        title,
        "slug": lower(title)
      }
    `);
    
    // Add service pages
    services.forEach((service: any) => {
      const slug = service.slug.replace(/\s+/g, '-');
      urls.push({
        loc: `${BASE_URL}/services/${slug}`,
        lastmod: service._updatedAt.split('T')[0],
        changefreq: 'monthly',
        priority: '0.8',
      });
    });
    
    console.log(`✅ Found ${services.length} services`);
    
  } catch (error) {
    console.error('❌ Error fetching CMS data:', error);
    console.log('⚠️  Falling back to static sitemap');
  }
  
  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  // Write to public folder
  const sitemapPath = join(process.cwd(), 'public', 'sitemap.xml');
  writeFileSync(sitemapPath, xml, 'utf-8');
  
  console.log(`✅ Sitemap generated: ${sitemapPath}`);
  console.log(`📊 Total URLs: ${urls.length}`);
}

generateSitemap().catch(console.error);
