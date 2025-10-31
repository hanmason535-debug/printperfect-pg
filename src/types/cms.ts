/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CMS Type Definitions - Sanity Content Types
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview TypeScript type definitions for content fetched from Sanity CMS.
 * Provides type safety and IntelliSense for portfolio items, services, and utilities.
 *
 * @description
 * This file defines the shape of data from Sanity CMS:
 *
 * **Content Types**:
 * - `SanityImage`: Image reference structure
 * - `Service`: Printing service schema
 * - `PortfolioItem`: Portfolio work sample schema
 *
 * **Utility Types**:
 * - `ImageUrl`: String alias for image URLs
 * - `ApiResponse<T>`: Generic API response wrapper
 * - `BaseComponentProps`: Common component props
 * - `UseDataResult<T>`: Hook return type for data fetching
 *
 * **Type Safety Benefits**:
 * - IntelliSense autocomplete for CMS fields
 * - Compile-time error checking
 * - Prevents typos in field names
 * - Documents expected data structure
 * - Refactoring support (rename fields safely)
 *
 * **Sanity Integration**:
 * - Matches schema defined in sanity.config.ts
 * - Used with GROQ queries from cms/queries.ts
 * - Compatible with Sanity image URL builder
 *
 * @module types/cms
 * @see {@link SanityImage} for image reference structure
 * @see {@link Service} for service content type
 * @see {@link PortfolioItem} for portfolio content type
 */

/**
 * Sanity image reference type
 *
 * @typedef {Object} SanityImage
 * @property {Object} asset - Image asset reference
 * @property {string} asset._ref - Asset ID (e.g., "image-abc123-1920x1080-jpg")
 * @property {"reference"} asset._type - Always "reference" for asset links
 * @property {"image"} _type - Always "image" for image fields
 *
 * @description
 * Represents an image stored in Sanity CMS.
 *
 * **Structure**:
 * - Nested object with asset reference
 * - `_ref` contains unique asset ID
 * - Used with `urlFor()` to generate image URLs
 *
 * @example
 * // Example Sanity image object
 * const image: SanityImage = {
 *   asset: {
 *     _ref: "image-abc123def456-1920x1080-jpg",
 *     _type: "reference"
 *   },
 *   _type: "image"
 * }
 *
 * @example
 * // Generate image URL
 * import { urlFor } from '@/lib/image'
 * const url = urlFor(image).width(800).url()
 */
export type SanityImage = {
  asset: {
    _ref: string;
    _type: 'reference';
  };
  _type: 'image';
};

/**
 * Printing service content type
 *
 * @typedef {Object} Service
 * @property {string} _id - Unique document ID
 * @property {"service"} _type - Document type (always "service")
 * @property {string} title - Service name (e.g., "Banner Printing")
 * @property {string} [description] - Optional service description
 * @property {SanityImage} [image] - Optional service image
 * @property {number} priority - Sort order (lower = higher priority)
 * @property {readonly string[]} [filters] - Optional filter tags
 * @property {string} [hoverId] - Optional hover state identifier
 *
 * @description
 * Represents a printing service offered by the business.
 *
 * **Required Fields**:
 * - `_id`: Unique identifier
 * - `_type`: Always "service"
 * - `title`: Display name
 * - `priority`: Sort order
 *
 * **Optional Fields**:
 * - `description`: Detailed service info
 * - `image`: Service preview image
 * - `filters`: Tags for filtering
 * - `hoverId`: For interactive states
 *
 * @example
 * // Example service object
 * const service: Service = {
 *   _id: "service-banner-printing",
 *   _type: "service",
 *   title: "Banner Printing",
 *   description: "High-quality vinyl banners in all sizes",
 *   image: { asset: { _ref: "image-abc123...", _type: "reference" }, _type: "image" },
 *   priority: 1
 * }
 */
export type Service = {
  _id: string;
  _type: 'service';
  title: string;
  description?: string;
  image?: SanityImage;
  priority: number;
  filters?: readonly string[];
  hoverId?: string;
};

/**
 * Portfolio work sample content type
 *
 * @typedef {Object} PortfolioItem
 * @property {string} _id - Unique document ID
 * @property {"portfolioItem"} _type - Document type (always "portfolioItem")
 * @property {string} title - Portfolio item title
 * @property {string} [description] - Optional item description
 * @property {SanityImage} [image] - Portfolio image
 * @property {string} [link] - Optional external link (client website)
 * @property {string} [category] - Category name (e.g., "Banners", "Business Cards")
 * @property {number} priority - Sort order (lower = featured first)
 * @property {readonly string[]} [categorySlugs] - Category slug array for filtering
 * @property {string} [hoverId] - Optional hover state identifier
 *
 * @description
 * Represents a completed print project showcased in the portfolio.
 *
 * **Required Fields**:
 * - `_id`: Unique identifier
 * - `_type`: Always "portfolioItem"
 * - `title`: Project name
 * - `priority`: Display order
 *
 * **Optional Fields**:
 * - `description`: Project details
 * - `image`: Main portfolio image
 * - `link`: Client website URL
 * - `category`: For filtering (e.g., "Banners")
 * - `categorySlugs`: Array of slugs
 * - `hoverId`: For interactions
 *
 * @example
 * // Example portfolio item
 * const item: PortfolioItem = {
 *   _id: "portfolio-wedding-banners",
 *   _type: "portfolioItem",
 *   title: "Wedding Banner Set",
 *   description: "Custom designed wedding banners for Smith-Johnson wedding",
 *   image: { asset: { _ref: "image-xyz789...", _type: "reference" }, _type: "image" },
 *   category: "Banners",
 *   priority: 5
 * }
 */
export type PortfolioItem = {
  _id: string;
  _type: 'portfolioItem';
  title: string;
  description?: string;
  image?: SanityImage;
  link?: string;
  category?: string;
  priority: number;
  categorySlugs?: readonly string[];
  hoverId?: string;
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Utility Types
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Image URL string type alias
 *
 * @typedef {string} ImageUrl
 *
 * @description
 * Represents a fully-qualified image URL string.
 * Used for clarity when functions return image URLs.
 *
 * @example
 * function getImageUrl(image: SanityImage): ImageUrl {
 *   return urlFor(image).url()
 * }
 */
export type ImageUrl = string;

/**
 * Generic API response wrapper
 *
 * @template T - Type of data being returned
 * @typedef {Object} ApiResponse
 * @property {T|null} data - Response data (null if loading or error)
 * @property {boolean} loading - Loading state indicator
 * @property {Error|null} error - Error object if request failed
 *
 * @description
 * Standard structure for API responses with loading/error states.
 *
 * @example
 * async function fetchData(): Promise<ApiResponse<Service[]>> {
 *   try {
 *     const data = await sanity.fetch(Q_SERVICES)
 *     return { data, loading: false, error: null }
 *   } catch (error) {
 *     return { data: null, loading: false, error: error as Error }
 *   }
 * }
 */
export type ApiResponse<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

/**
 * Common component props interface
 *
 * @interface BaseComponentProps
 * @property {string} [className] - Optional CSS class names
 * @property {string} [data-testid] - Optional test ID for testing
 *
 * @description
 * Base props that most components accept.
 * Extend this interface for component-specific props.
 *
 * @example
 * interface ButtonProps extends BaseComponentProps {
 *   variant?: 'primary' | 'secondary'
 *   onClick?: () => void
 * }
 *
 * function Button({ className, 'data-testid': testId, variant, onClick }: ButtonProps) {
 *   return (
 *     <button
 *       className={cn('btn', `btn-${variant}`, className)}
 *       data-testid={testId}
 *       onClick={onClick}
 *     />
 *   )
 * }
 */
export interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
}

/**
 * Hook return type for data fetching
 *
 * @template T - Type of items in the data array
 * @typedef {Object} UseDataResult
 * @property {T[]} data - Array of fetched items (empty during loading/error)
 * @property {boolean} loading - Whether data is currently being fetched
 * @property {Error|null} error - Error object if fetch failed, null otherwise
 *
 * @description
 * Standard return type for custom data-fetching hooks.
 * Used by usePortfolio, useServices, etc.
 *
 * @example
 * function usePortfolio(): UseDataResult<PortfolioItem> {
 *   const [data, setData] = useState<PortfolioItem[]>([])
 *   const [loading, setLoading] = useState(true)
 *   const [error, setError] = useState<Error | null>(null)
 *
 *   // ... fetch logic
 *
 *   return { data, loading, error }
 * }
 *
 * @example
 * // Usage in component
 * function PortfolioSection() {
 *   const { data: items, loading, error } = usePortfolio()
 *
 *   if (loading) return <Spinner />
 *   if (error) return <Error message={error.message} />
 *   return <Grid items={items} />
 * }
 */
export type UseDataResult<T> = {
  data: T[];
  loading: boolean;
  error: Error | null;
};
