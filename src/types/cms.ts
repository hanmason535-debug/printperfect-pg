/**
 * Sanity CMS Type Definitions
 *
 * TypeScript interfaces for Sanity CMS data structures.
 * These types are used throughout the application for type safety.
 */

/**
 * SanityImage
 *
 * Represents a Sanity image reference.
 * The `_ref` is a unique identifier pointing to an image asset in Sanity.
 *
 * Usage: Passed to `urlFor()` to generate optimized image URLs
 */
export type SanityImage = {asset: {_ref: string}}

/**
 * Service
 *
 * Represents a single printing service offered by the company.
 *
 * @property _id - Unique Sanity document ID
 * @property title - Service name (required)
 * @property description - Service description text (optional)
 * @property image - Sanity image reference (optional)
 * @property priority - Sort order in the services grid (lower = first)
 * @property filters - Category filter tags (optional array)
 * @property hoverId - Identifier for hover/animation states (optional)
 */
export type Service = {
  _id: string
  title: string
  description?: string
  image?: SanityImage
  priority: number
  filters?: string[]
  hoverId?: string
}

/**
 * PortfolioItem
 *
 * Represents a completed printing project in the portfolio.
 *
 * @property _id - Unique Sanity document ID
 * @property title - Project title (required)
 * @property description - Project description/details (optional)
 * @property image - Sanity image reference (optional)
 * @property link - External project URL or reference (optional)
 * @property category - Category name for filtering (e.g., "Branding", "Print") (optional)
 * @property priority - Sort order in the portfolio grid (lower = first)
 * @property categorySlugs - URL-friendly category identifiers for filtering (optional array)
 * @property hoverId - Identifier for hover/animation states (optional)
 */
export type PortfolioItem = {
  _id: string
  title: string
  description?: string
  image?: SanityImage
  link?: string
  category?: string
  priority: number
  categorySlugs?: string[]
  hoverId?: string
}

