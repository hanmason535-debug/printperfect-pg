import imageUrlBuilder from '@sanity/image-url'
import {sanity} from './sanity'

// Initialize Sanity image URL builder with the configured client
const builder = imageUrlBuilder(sanity)

/**
 * urlFor
 *
 * Builds optimized image URLs from Sanity image references with chainable builder methods.
 * 
 * Usage:
 * ```
 * urlFor(imageRef).width(800).height(600).fit('crop').url()
 * ```
 *
 * @param src - Sanity image object (typically from CMS query result)
 * @returns ImageUrlBuilder instance with chainable methods (width, height, fit, format, quality, url, etc.)
 */
export const urlFor = (src: any) => builder.image(src)

