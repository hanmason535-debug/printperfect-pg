import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-03-11'

if (!projectId) {
  throw new Error('Missing VITE_SANITY_PROJECT_ID environment variable.')
}

export const sanity = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

const builder = imageUrlBuilder(sanity)

export function urlFor(source: SanityImageSource | undefined) {
  if (!source) {
    throw new Error('Cannot build image URL without a valid Sanity image source.')
  }
  return builder.image(source)
}

export default sanity
