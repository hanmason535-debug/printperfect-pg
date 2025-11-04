/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Sanity Image URL Builder - Image Optimization & Transformation
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview Helper for generating optimized image URLs from Sanity CMS
 * with automatic resizing, cropping, and format conversion.
 *
 * @description
 * This file exports the `urlFor` function for building Sanity image URLs:
 *
 * **Features**:
 * - Automatic image optimization
 * - Responsive image generation
 * - Format conversion (WebP, JPEG, PNG)
 * - Quality control (1-100)
 * - Cropping and fitting modes
 * - Dimension control (width, height)
 *
 * **Optimization Benefits**:
 * - Reduced bandwidth usage
 * - Faster page load times
 * - Improved Core Web Vitals (LCP)
 * - Automatic CDN delivery
 *
 * **Common Transformations**:
 * - Resize: `.width(800).height(600)`
 * - Crop: `.fit('crop')` or `.fit('fill')`
 * - Format: `.format('webp')` for modern browsers
 * - Quality: `.quality(85)` for balance of size/quality
 * - Auto format: `.auto('format')` for browser-specific format
 *
 * **Usage Examples**:
 * ```typescript
 * import { urlFor } from '@/lib/image'
 *
 * // Basic usage
 * const url = urlFor(image).url()
 *
 * // Responsive thumbnail
 * const thumb = urlFor(image)
 *   .width(300)
 *   .height(300)
 *   .fit('crop')
 *   .format('webp')
 *   .quality(85)
 *   .url()
 *
 * // Hero image (high quality)
 * const hero = urlFor(image)
 *   .width(1920)
 *   .height(1080)
 *   .fit('max')
 *   .format('webp')
 *   .quality(90)
 *   .url()
 * ```
 *
 * **Fit Modes**:
 * - `crop`: Crops image to exact dimensions
 * - `fill`: Fills area, may distort
 * - `max`: Fits within dimensions, preserves aspect ratio
 * - `min`: Ensures minimum dimensions
 * - `scale`: Scales to exact dimensions (no crop)
 *
 * **Format Options**:
 * - `webp`: Modern format, best compression (recommended)
 * - `jpg`/`jpeg`: Universal compatibility
 * - `png`: Lossless, transparency support
 * - `auto`: Browser-specific format selection
 *
 * @module lib/image
 * @see {@link https://www.sanity.io/docs/image-url} Sanity Image URL Documentation
 * @see {@link https://github.com/sanity-io/image-url} Image URL Builder API
 */

import imageUrlBuilder from '@sanity/image-url';
import { sanity } from './sanity';

// Image URL builder instance will be created below before export

/**
 * Generate optimized Sanity image URL with transformation options
 *
 * @function urlFor
 * @param {any} src - Sanity image reference or asset object
 * @returns {ImageUrlBuilder} Chainable builder for image transformations
 *
 * @description
 * Creates a chainable builder for generating optimized image URLs from Sanity.
 *
 * **Input Types**:
 * - Image reference: `{ _ref: 'image-abc123-400x300-jpg' }`
 * - Image object: `{ asset: { _ref: '...' } }`
 * - Asset object: Full Sanity asset with metadata
 *
 * **Chaining Methods**:
 * - `.width(pixels)`: Set max width
 * - `.height(pixels)`: Set max height
 * - `.fit(mode)`: Set fit/crop mode
 * - `.format(format)`: Output format (webp, jpg, png)
 * - `.quality(1-100)`: Compression quality
 * - `.auto(option)`: Auto optimization ('format')
 * - `.url()`: Generate final URL string
 *
 * @example
 * // Portfolio thumbnail (square, cropped)
 * <img src={urlFor(item.image)
 *   .width(600)
 *   .height(600)
 *   .fit('crop')
 *   .format('webp')
 *   .quality(85)
 *   .url()}
 * />
 *
 * @example
 * // Service card image (responsive)
 * <img src={urlFor(service.image)
 *   .width(800)
 *   .height(600)
 *   .format('webp')
 *   .quality(85)
 *   .url()}
 * />
 *
 * @example
 * // Lightbox image (high quality, full size)
 * <img src={urlFor(image)
 *   .width(1600)
 *   .format('webp')
 *   .quality(90)
 *   .url()}
 * />
 *
 * @example
 * // Auto-optimized (browser-specific format)
 * <img src={urlFor(image)
 *   .auto('format')
 *   .width(800)
 *   .url()}
 * />
 */
const builder = imageUrlBuilder(sanity);

export const urlFor = (src: any) => builder.image(src);
