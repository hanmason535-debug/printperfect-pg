/**
 * Sanity CMS Type Definitions
 * Strict type definitions for content from Sanity CMS
 */

export type SanityImage = {
  asset: {
    _ref: string
    _type: 'reference'
  }
  _type: 'image'
}

export type Service = {
  _id: string
  _type: 'service'
  title: string
  description?: string
  image?: SanityImage
  priority: number
  filters?: readonly string[]
  hoverId?: string
}

export type PortfolioItem = {
  _id: string
  _type: 'portfolioItem'
  title: string
  description?: string
  image?: SanityImage
  link?: string
  category?: string
  priority: number
  categorySlugs?: readonly string[]
  hoverId?: string
}

/**
 * Utility Types
 */

// Extract image URL from Sanity image
export type ImageUrl = string

// API Response wrapper
export type ApiResponse<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}

// Common props for components
export interface BaseComponentProps {
  className?: string
  'data-testid'?: string
}

// Hook return type for data fetching
export type UseDataResult<T> = {
  data: T[]
  loading: boolean
  error: Error | null
}
