export type SanityImage = {asset: {_ref: string}}

export type Service = {
  _id: string
  title: string
  description?: string
  image?: SanityImage
  priority: number
  filters?: string[]
  hoverId?: string
}

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
