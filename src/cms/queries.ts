/**
 * Sanity GROQ Queries
 *
 * GROQ (Graph-Relational Object Queries) queries for fetching data from Sanity CMS.
 * These queries are used by the useServices() and usePortfolio() hooks.
 */

/**
 * Q_SERVICES
 *
 * Fetches all services ordered by priority (ascending).
 * 
 * Fields returned:
 * - _id: Unique identifier
 * - title: Service name
 * - description: Service description
 * - image: Service image reference (Sanity image)
 * - priority: Sort order (lower = first)
 * - filters: Category filters (array)
 * - hoverId: Hover state identifier
 */
export const Q_SERVICES = `*[_type=="service"]|order(priority asc){
  _id, title, description, image, priority, filters, hoverId
}`;

/**
 * Q_PORTFOLIO
 *
 * Fetches all portfolio items ordered by priority (ascending).
 *
 * Fields returned:
 * - _id: Unique identifier
 * - title: Portfolio item title
 * - description: Project description
 * - image: Portfolio image reference (Sanity image)
 * - link: External project link (optional)
 * - category: Category name (e.g., "Branding", "Print")
 * - priority: Sort order (lower = first)
 * - categorySlugs: URL-friendly category slugs (array)
 * - hoverId: Hover state identifier
 */
export const Q_PORTFOLIO = `*[_type=="portfolioItem"]|order(priority asc){
  _id, title, description, image, link, category, priority, categorySlugs, hoverId
}`;

