# 🎨 Data Structure Guide for Lovable - UI Improvements

## 📊 Current Data Context

This document provides context about the data available in the Services and Portfolio sections for UI enhancement.

---

## 🏢 Services Grid Data (13 Services)

Located in: `seed/data/services.json`

### Available Services:
1. **Flex Banners** - Outdoor advertising, weather-resistant vinyl
2. **Signs & Banners** - Indoor/outdoor signage solutions
3. **Foam Boards** - Lightweight displays for events
4. **Apparel** - T-shirts, hoodies, caps, bags
5. **Stickers & Labels** - Various finishes (matte, gloss, holographic)
6. **Business Cards** - Premium stocks with special finishes
7. **Roll Labels** - Industrial product labels
8. **Frame Signs** - Elegant office/retail signage
9. **Retractable Banners** - Portable trade show stands
10. **Aluminum Boards** - Durable outdoor signage
11. **Magnetic Boards** - Interactive office displays
12. **PVC Boards** - Waterproof outdoor solutions
13. **Gift & Décor** - Personalized gifts and home décor

### Data Structure:
```typescript
{
  title: string;              // Service name
  description: string;        // Detailed description (2-3 sentences)
  image: string;             // Image filename
  priority: number;          // Display order (1-13)
  filters: string[];         // Tags: ["outdoor", "large-format", "advertising"]
  hoverId: string;           // For hover effects
}
```

### Sample Service:
```json
{
  "title": "Flex Banners",
  "description": "High-quality vinyl flex banners perfect for outdoor advertising, events, and promotions. Weather-resistant with vibrant color printing. Available in various sizes up to 20x60 feet.",
  "image": "flex-banners.jpg",
  "priority": 1,
  "filters": ["outdoor", "large-format", "advertising"],
  "hoverId": "flex-banners-hover"
}
```

### Filter Tags Available:
```
outdoor, large-format, advertising, signage, indoor, branding,
display, events, lightweight, wearables, corporate, bulk-orders,
labels, small-format, premium, stationery, portable, trade-shows,
durable, interactive, office, reusable, waterproof, industrial,
gifts, personalized, décor
```

---

## 🖼️ Portfolio Gallery Data (9 Showcases)

Located in: `seed/data/portfolio.json`

### Portfolio Showcases:
1. **Matte Finish Business Cards** - TechStart Inc. (5,000 units)
2. **Large Format Flex Banner** - XYZ Company (18ft x 6ft)
3. **Custom Printed T-Shirts** - Marathon Event (500 pieces)
4. **Vinyl Stickers & Labels** - Eco Brand (10,000 units)
5. **Event Foam Board Display** - Annual Conference (6 boards)
6. **Corporate Stationery Set** - Law Firm (complete suite)
7. **Custom Hoodie Print** - Sports Team (200 pieces)
8. **Product Label Design** - Food Packaging (50,000 labels)
9. **Trade Show Retractable Banner** - Exhibition (33x80 inches)

### Data Structure:
```typescript
{
  title: string;              // Project title with client name
  description: string;        // Project details with metrics
  image: string;             // Image filename
  category: string;          // Category: Business Cards, Banners, Apparel, Stickers
  priority: number;          // Display order
  categorySlugs: string[];   // URL-friendly categories
  link: string | null;       // External link (optional)
  hoverId: string;           // For hover effects
}
```

### Sample Portfolio Item:
```json
{
  "title": "Large Format Flex Banner - XYZ Company",
  "description": "Eye-catching outdoor advertising banner. 18ft x 6ft vinyl flex banner with vibrant colors and weather-resistant finish. Perfect for storefront visibility.",
  "image": "flex-banners.jpg",
  "link": null,
  "category": "Banners",
  "priority": 2,
  "categorySlugs": ["banners"],
  "hoverId": "portfolio-2"
}
```

### Portfolio Categories:
- **Business Cards** - Stationery designs and branding
- **Banners** - Large format displays and event materials
- **Apparel** - Clothing and wearable prints
- **Stickers** - Labels and vinyl graphics

---

## 🎨 UI Enhancement Opportunities

### Services Grid
- **Grid Layout**: 13 services across responsive grid (1 col mobile, 2-3 cols tablet, 3 cols desktop)
- **Card Design**: Each service card should highlight:
  - Service title
  - Rich description (2-3 sentences)
  - Category filters/tags
  - Hover effects (use `hoverId`)
  - Call-to-action button
- **Filtering**: Use filter tags to create dynamic filtering UI
- **Animations**: Stagger animations on load, smooth hover effects

### Portfolio Gallery
- **Gallery Layout**: 9 portfolio items with category filtering
- **Categories**: 4 main categories (Business Cards, Banners, Apparel, Stickers)
- **Card Display**: Show project details with:
  - Project image
  - Project title with client
  - Detailed description with specs/metrics
  - Category tag
  - Professional styling
- **Lightbox**: Click to view larger images
- **Category Filter**: Toggle between categories
- **Animations**: Smooth transitions and entrance animations

### Shared UI Elements
- **Hover Effects**: Use `hoverId` for interactive states
- **Image Handling**: All images referenced in data (flex-banners.jpg, foam-boards.jpg, apparel.jpg, stickers-labels.jpg, business-cards.jpg, roll-labels.jpg)
- **Typography**: Titles, descriptions, and tags need clear hierarchy
- **Spacing**: Consistent padding and gaps between items
- **Responsive Design**: Mobile-first approach with breakpoints

---

## 🔄 Component Integration

### Services Component (`src/components/ServicesGrid.tsx`)
```typescript
// Uses React Query hook
const { data: services = [], isLoading, error } = useServices()

// Service data flows from Sanity CMS or seed data
// Each service has rich context for design
```

### Portfolio Component (`src/components/Portfolio.tsx`)
```typescript
// Uses React Query hook
const { data: allItems = [], isLoading, error } = usePortfolio()

// Can filter by category
// Supports lightbox viewing
```

---

## 🎯 Design Recommendations

### Color Scheme
- Use brand colors from design system
- Highlight service categories with consistent tag colors
- Portfolio categories could have their own accent colors

### Typography
- **Service Title**: Bold, prominent (24-28px)
- **Description**: Regular weight (14-16px), good line height for readability
- **Tags/Filters**: Smaller (12-14px), slightly muted

### Spacing
- Card padding: 24px
- Grid gap: 16-20px mobile, 24px desktop
- Section padding: 48px vertical, 20px horizontal mobile, 40px desktop

### Interactive Elements
- Hover scale: 1.02-1.05
- Transition duration: 300ms (respect `prefers-reduced-motion`)
- Focus states for accessibility
- Smooth animations using Framer Motion

---

## 📱 Responsive Breakpoints

```
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px

Services Grid:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

Portfolio Grid:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
```

---

## 🎬 Animation Opportunities

### Services Grid
- Staggered entrance animation on load
- Hover: Lift effect with shadow
- Filter transitions: Smooth opacity changes

### Portfolio Gallery
- Image zoom on hover
- Category filter transitions
- Lightbox open/close animations
- Smooth slide transitions between portfolio items

---

## 🔗 Related Files

- **Service Query**: `src/cms/queries.ts` - `Q_SERVICES`, `Q_SERVICE_BY_SLUG`
- **Portfolio Query**: `src/cms/queries.ts` - `Q_PORTFOLIO`, `Q_PORTFOLIO_BY_SLUG`, `Q_PORTFOLIO_BY_CATEGORY`
- **Hooks**: `src/hooks/useServices.ts`, `src/hooks/usePortfolio.ts` (React Query)
- **Sanity Schema**: `sanity/schemaTypes/service.ts`, `sanity/schemaTypes/portfolioItem.ts`

---

## 💡 Tips for Lovable

1. **Use Real Data**: All descriptions and project details are realistic printing business content
2. **Start with Services**: Build the grid first, then apply similar patterns to Portfolio
3. **Test Responsiveness**: With 13 services and 9 portfolio items, you have enough data to test layouts
4. **Leverage Hover Effects**: `hoverId` attributes are ready for interactive states
5. **Consider Animations**: Use Framer Motion for smooth, performant animations
6. **Accessibility**: Keep `data-test-id` selectors intact, maintain proper contrast ratios

---

**Happy designing! 🎨✨**
