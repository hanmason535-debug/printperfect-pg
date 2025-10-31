/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Sanity CMS GROQ Queries - Content Fetching
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview GROQ query definitions for fetching content from Sanity CMS.
 * These queries define what data to fetch and how to structure it.
 *
 * @description
 * This file contains GROQ (Graph-Relational Object Queries) for Sanity CMS:
 *
 * **GROQ Syntax Overview**:
 * - `*[_type=="service"]`: Filter documents by type
 * - `|order(priority asc)`: Sort by priority field ascending
 * - `{_id, title, ...}`: Project specific fields (select columns)
 *
 * **Query Optimization**:
 * - Only fetch needed fields (not entire documents)
 * - Server-side sorting (order by priority)
 * - Cached by Sanity CDN for performance
 * - No pagination (datasets are small ~25-50 items)
 *
 * **Field Explanations**:
 * - `_id`: Unique document identifier
 * - `title`: Display name
 * - `description`: Optional text content
 * - `image`: Sanity image reference
 * - `priority`: Sort order (lower = higher priority)
 * - `category`: Filter/grouping field
 * - `link`: Optional external URL
 * - `hoverId`: Optional ID for hover interactions
 * - `filters`/`categorySlugs`: Array fields for filtering
 *
 * @module cms/queries
 * @see {@link https://www.sanity.io/docs/groq} GROQ Language Reference
 * @see {@link https://www.sanity.io/docs/query-cheat-sheet} Query Cheat Sheet
 */

/**
 * Fetch all printing services sorted by priority
 *
 * @constant {string} Q_SERVICES
 *
 * @description
 * GROQ query to fetch all service documents from Sanity CMS.
 *
 * **Query Breakdown**:
 * - `*[_type=="service"]`: Select all documents of type "service"
 * - `|order(priority asc)`: Sort by priority field (ascending, 1-100)
 * - `{...}`: Project (select) specific fields
 *
 * **Returned Fields**:
 * - `_id`: Unique identifier (e.g., "service-123")
 * - `title`: Service name (e.g., "Banner Printing")
 * - `description`: Service description text
 * - `image`: Sanity image reference object
 * - `priority`: Sort order number (1 = highest priority)
 * - `filters`: Array of filter tags (optional)
 * - `hoverId`: ID for hover state tracking (optional)
 *
 * **Usage**:
 * ```typescript
 * import { sanity } from '@/lib/sanity'
 * import { Q_SERVICES } from '@/cms/queries'
 *
 * const services = await sanity.fetch<Service[]>(Q_SERVICES)
 * ```
 *
 * **Expected Result**:
 * ```json
 * [
 *   {
 *     "_id": "service-banner",
 *     "title": "Banner Printing",
 *     "description": "High-quality vinyl banners...",
 *     "image": { "asset": { "_ref": "image-abc123-..." } },
 *     "priority": 1
 *   },
 *   ...
 * ]
 * ```
 */
export const Q_SERVICES = `*[_type=="service"]|order(priority asc){
  _id, title, description, image, priority, filters, hoverId
}`;

/**
 * Fetch all portfolio items sorted by priority
 *
 * @constant {string} Q_PORTFOLIO
 *
 * @description
 * GROQ query to fetch all portfolio items from Sanity CMS.
 *
 * **Query Breakdown**:
 * - `*[_type=="portfolioItem"]`: Select all portfolio documents
 * - `|order(priority asc)`: Sort by priority (ascending)
 * - `{...}`: Project specific fields
 *
 * **Returned Fields**:
 * - `_id`: Unique identifier (e.g., "portfolio-abc123")
 * - `title`: Item title (e.g., "Wedding Banner Set")
 * - `description`: Optional description text
 * - `image`: Sanity image reference (main portfolio image)
 * - `link`: Optional external URL (e.g., client website)
 * - `category`: Category name (e.g., "Banners", "Business Cards")
 * - `priority`: Sort order number (1 = featured/first)
 * - `categorySlugs`: Array of category slugs for filtering
 * - `hoverId`: ID for hover state tracking (optional)
 *
 * **Usage**:
 * ```typescript
 * import { sanity } from '@/lib/sanity'
 * import { Q_PORTFOLIO } from '@/cms/queries'
 *
 * const items = await sanity.fetch<PortfolioItem[]>(Q_PORTFOLIO)
 * ```
 *
 * **Expected Result**:
 * ```json
 * [
 *   {
 *     "_id": "portfolio-001",
 *     "title": "Corporate Banners",
 *     "description": "Large format banners for XYZ Corp",
 *     "image": { "asset": { "_ref": "image-xyz789-..." } },
 *     "category": "Banners",
 *     "priority": 1
 *   },
 *   ...
 * ]
 * ```
 *
 * **Filtering by Category**:
 * To filter by category in your component, use:
 * ```typescript
 * const banners = items.filter(item => item.category === 'Banners')
 * ```
 */
export const Q_PORTFOLIO = `*[_type=="portfolioItem"]|order(priority asc){
  _id, title, description, image, link, category, priority, categorySlugs, hoverId
}`;

// ─── Advanced Queries ─────────────────────────────────────────────────────

/**
 * Fetch single service by slug
 *
 * @constant {string} Q_SERVICE_BY_SLUG
 *
 * @example
 * ```typescript
 * const service = await sanity.fetch(Q_SERVICE_BY_SLUG, { slug: 'banner-printing' })
 * ```
 */
export const Q_SERVICE_BY_SLUG = `*[_type=="service" && slug.current==$slug][0]{
  _id, title, slug, description, image, priority, filters, hoverId, seo
}`;

/**
 * Fetch single portfolio item by slug
 *
 * @constant {string} Q_PORTFOLIO_BY_SLUG
 *
 * @example
 * ```typescript
 * const item = await sanity.fetch(Q_PORTFOLIO_BY_SLUG, { slug: 'wedding-banners' })
 * ```
 */
export const Q_PORTFOLIO_BY_SLUG = `*[_type=="portfolioItem" && slug.current==$slug][0]{
  _id, title, slug, description, image, link, category, priority, categorySlugs, hoverId, seo
}`;

/**
 * Fetch portfolio items by category
 *
 * @constant {string} Q_PORTFOLIO_BY_CATEGORY
 *
 * @example
 * ```typescript
 * const banners = await sanity.fetch(Q_PORTFOLIO_BY_CATEGORY, { category: 'Banners' })
 * ```
 */
export const Q_PORTFOLIO_BY_CATEGORY = `*[_type=="portfolioItem" && category==$category]|order(priority asc){
  _id, title, slug, description, image, link, category, priority, categorySlugs, hoverId
}`;

/**
 * Search across services and portfolio items
 *
 * @constant {string} Q_SEARCH
 *
 * @description
 * Performs full-text search across titles and descriptions
 *
 * @example
 * ```typescript
 * const results = await sanity.fetch(Q_SEARCH, { searchTerm: 'banner*' })
 * ```
 */
export const Q_SEARCH = `*[_type in ["service", "portfolioItem"] && 
  (title match $searchTerm || description match $searchTerm)]|order(priority asc){
  _id, _type, title, slug, description, image, priority
}`;

/**
 * Fetch all unique portfolio categories
 *
 * @constant {string} Q_PORTFOLIO_CATEGORIES
 *
 * @example
 * ```typescript
 * const categories = await sanity.fetch<string[]>(Q_PORTFOLIO_CATEGORIES)
 * // ['Banners', 'Business Cards', 'Flyers', ...]
 * ```
 */
export const Q_PORTFOLIO_CATEGORIES = `array::unique(*[_type=="portfolioItem"].category)`;

/**
 * Fetch featured/priority items (priority <= 3)
 *
 * @constant {string} Q_FEATURED_PORTFOLIO
 *
 * @example
 * ```typescript
 * const featured = await sanity.fetch(Q_FEATURED_PORTFOLIO)
 * ```
 */
export const Q_FEATURED_PORTFOLIO = `*[_type=="portfolioItem" && priority <= 3]|order(priority asc){
  _id, title, slug, description, image, link, category, priority
}`;
