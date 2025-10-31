# Open Graph Image Setup

## Required Image: og-image.jpg

**Location**: `public/og-image.jpg`

**Specifications**:
- **Dimensions**: 1200 × 630 pixels (required)
- **Format**: JPG or PNG
- **File Size**: < 8 MB (recommended < 300 KB)
- **Aspect Ratio**: 1.91:1

## What to Include

Create an image with:
1. **Company Logo**: "PG" logo with cyan gradient background (from favicon)
2. **Tagline**: "Professional Printing Services"
3. **Key Services**: Icons or text for:
   - Business Cards
   - Banners
   - Custom Apparel
   - Vinyl Stickers
4. **Brand Colors**: Use cyan (#0891b2), slate backgrounds
5. **Contact**: WhatsApp number or website URL

## How to Create

### Option 1: Design Tool (Recommended)
- Use Canva, Figma, or Photoshop
- Template: Social Media → Facebook Link Preview (1200×630)
- Export as JPG (high quality, 85-90%)

### Option 2: Online Generator
- [og-image-generator](https://og-image.vercel.app/)
- [Bannerbear](https://www.bannerbear.com/tools/open-graph-preview/)

### Option 3: Screenshot & Crop
- Take a screenshot of your website
- Crop to 1200×630
- Overlay text/logo

## Test Your OG Image

After adding `og-image.jpg` to `/public`, test it:

1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Inspector**: https://www.linkedin.com/post-inspector/
4. **WhatsApp**: Send your URL in a chat to see preview

## Current Status

⚠️ **MISSING**: `public/og-image.jpg` needs to be created
✅ Meta tags are configured in `index.html`
✅ References set to: `https://printperfect-pg.com/og-image.jpg`

## Quick Fix (Temporary)

If you need a placeholder immediately:
```bash
# Use favicon as temporary OG image (not ideal but works)
cp public/favicon.svg public/og-image.jpg
```

For best results, create a proper 1200×630 image with your branding.
