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
 * - API Version: '2023-10-01' (stable API version)
 * - CDN: Enabled for faster content delivery
 *
 * **Environment Variables Required**:
 * - `VITE_SANITY_PROJECT_ID`: Your Sanity project ID (required)
 * - `VITE_SANITY_DATASET`: Dataset name (optional, defaults to 'production')
 *
 * **CDN Benefits**:
 * - Cached responses for faster load times
 * - Global edge network for low latency
 * - Automatically purged when content updates
 * - Free tier includes generous CDN usage
 *
 * **Usage**:
 * ```typescript
 * import { sanity } from '@/lib/sanity'
 *
 * // Fetch data using GROQ query
 * const posts = await sanity.fetch('*[_type == "post"]')
 *
 * // Fetch with parameters
 * const post = await sanity.fetch(
 *   '*[_type == "post" && slug.current == $slug][0]',
 *   { slug: 'my-post' }
 * )
 * ```
 *
 * **API Version**:
 * - Using '2023-10-01' for stability
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
 * - Stable API version (2023-10-01)
 * - No authentication needed (public read)
 *
 * @example
 * // Fetch all portfolio items
 * const items = await sanity.fetch('*[_type == "portfolioItem"]')
 *
 * @example
 * // Fetch with parameters
 * const service = await sanity.fetch(
 *   '*[_type == "service" && _id == $id][0]',
 *   { id: 'service-123' }
 * )
 */
export const sanity = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2023-10-01',
  useCdn: true,
});

export default sanity;
