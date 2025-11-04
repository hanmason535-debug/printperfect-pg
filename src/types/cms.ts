/**
 * CMS Type Definitions - Sanity Content Types
 *
 * Centralized TypeScript types used across the app for Sanity CMS content.
 */

export type SanityImage = {
  asset: {
    _ref: string
    _type?: 'reference'
  }
  _type?: 'image'
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

export type ImageUrl = string

export type ApiResponse<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}

export interface BaseComponentProps {
  className?: string
  'data-testid'?: string
}

export type UseDataResult<T> = {
  data: T[]
  loading: boolean
  error: Error | null
}
