/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Sanity Client - CMS Connection & Configuration
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview Sanity CMS client configuration for fetching portfolio items,
 * services, and other content from the headless CMS.
 *
 * @description
 * This file exports a configured Sanity client instance used throughout the app:
 *
 * **Configuration**:
 * - Project ID: Unique identifier for Sanity project (from env var)
 * - Dataset: Content environment (production/staging, defaults to 'production')
 * - API Version: '2024-03-11' (latest stable API version)
 * - CDN: Enabled for faster content delivery
 *
 * **Environment Variables Required**:
 * - `VITE_SANITY_PROJECT_ID`: Your Sanity project ID (required)
 * - `VITE_SANITY_DATASET`: Dataset name (optional, defaults to 'production')
 * - `VITE_SANITY_API_VERSION`: API version (optional, defaults to '2024-03-11')
 *
 * **CDN Benefits**:
 * - Cached responses for faster load times
 * - Global edge network for low latency
 * - Automatically purged when content updates
 * - Free tier includes generous CDN usage
 *
 * **Usage**:
 * ```typescript
 * import { sanity, urlFor } from '@/lib/sanity'
 *
 * // Fetch data using GROQ query
 * const posts = await sanity.fetch('*[_type == "post"]')
 *
 * // Build image URLs with transformations
 * const imageUrl = urlFor(image).width(800).height(600).url()
 * ```
 *
 * **API Version**:
 * - Using '2024-03-11' for latest stable features
 * - Locks API behavior to prevent breaking changes
 * - Update when you want to adopt newer Sanity features
 *
 * **Security**:
 * - No API token required for public read access
 * - Project ID is safe to expose in client-side code
 * - Dataset is also safe to expose (no sensitive data)
 *
 * @module lib/sanity
 * @see {@link https://www.sanity.io/docs/js-client} Sanity Client Documentation
 * @see {@link https://www.sanity.io/docs/query-cheat-sheet} GROQ Query Reference
 */

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// ─── Environment Configuration ────────────────────────────────────────────

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-03-11';

// ─── Validation ───────────────────────────────────────────────────────────

if (!projectId) {
  throw new Error('Missing VITE_SANITY_PROJECT_ID environment variable.');
}

if (!dataset) {
  throw new Error('Missing VITE_SANITY_DATASET environment variable.');
}

// ─── Client Instance ──────────────────────────────────────────────────────

/**
 * Sanity CMS client instance
 *
 * @constant {SanityClient} sanity
 * @description
 * Configured client for querying Sanity content.
 *
 * Features:
 * - CDN-enabled for performance
 * - Production dataset by default
 * - Latest stable API version (2024-03-11)
 * - No authentication needed (public read)
 *
 * @example
 * // Fetch all portfolio items
 * const items = await sanity.fetch('*[_type == "portfolioItem"]')
 *
 * @example
 * // Fetch with parameters
 * const service = await sanity.fetch(
 *   '*[_type == "service" && slug.current == $slug][0]',
 *   { slug: 'banner-printing' }
 * )
 */
export const sanity = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// ─── Image URL Builder ────────────────────────────────────────────────────

const builder = imageUrlBuilder(sanity);

/**
 * Build image URLs from Sanity image sources
 *
 * @function urlFor
 * @param {SanityImageSource | undefined} source - Sanity image reference
 * @returns {ImageUrlBuilder} Builder for generating image URLs with transformations
 *
 * @description
 * Helper function to build optimized image URLs from Sanity image assets.
 * Supports all Sanity image transformations (width, height, crop, format, etc.)
 *
 * **Transformations**:
 * - `.width(800)` - Resize to specific width
 * - `.height(600)` - Resize to specific height
 * - `.format('webp')` - Convert format
 * - `.quality(80)` - Set quality (1-100)
 * - `.fit('crop')` - Crop mode
 * - `.auto('format')` - Auto format selection
 *
 * @example
 * // Basic usage
 * const url = urlFor(service.image).url()
 *
 * @example
 * // With transformations
 * const url = urlFor(item.image)
 *   .width(800)
 *   .height(600)
 *   .format('webp')
 *   .quality(85)
 *   .url()
 *
 * @example
 * // Responsive images
 * const srcset = [
 *   urlFor(image).width(400).url() + ' 400w',
 *   urlFor(image).width(800).url() + ' 800w',
 *   urlFor(image).width(1200).url() + ' 1200w',
 * ].join(', ')
 *
 * @throws {Error} If source is undefined or invalid
 */
export function urlFor(source: SanityImageSource | undefined) {
  if (!source) {
    throw new Error('Cannot build image URL without a valid Sanity image source.');
  }
  return builder.image(source);
}

// ─── Exports ──────────────────────────────────────────────────────────────

export default sanity;
