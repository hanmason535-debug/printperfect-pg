import {createClient} from '@sanity/client'

/**
 * Sanity Client Configuration
 *
 * Initializes the Sanity CMS client with environment variables.
 * Used throughout the app to fetch content (services, portfolio items, etc.)
 *
 * Configuration:
 * - `projectId`: Sanity project ID (from env: VITE_SANITY_PROJECT_ID)
 * - `dataset`: Sanity dataset name (from env: VITE_SANITY_DATASET, default: 'production')
 * - `apiVersion`: Sanity API version (pinned to '2023-10-01' for stability)
 * - `useCdn`: Enable CDN caching for faster query responses
 */
export const sanity = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2023-10-01',
  useCdn: true,
})

export default sanity

