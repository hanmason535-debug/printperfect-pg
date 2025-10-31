# 🤖 Agent Context: UI Improvement Sandbox

## 📋 Project Overview

**PrintPerfect PG** - Modern printing services website  
**Stack**: Vite + React 18 + TypeScript + Tailwind CSS + Framer Motion  
**CMS**: Sanity (read-only integration)  
**Branch**: `feature/ui-improvement-v1` — **Safe sandbox for AI-driven visual enhancements**

---

## 🎯 Primary Goals

This branch exists specifically for **UI/UX improvements** without affecting the stable main branch:

### Visual Enhancements
- ✨ Improve layout, spacing, and typography
- 🎨 Enhance color schemes and design consistency
- 📱 Optimize responsive design (mobile-first)
- 🌊 Add smooth animations and transitions
- 🎬 Integrate background printer video in hero section

### Component Improvements
- 🔲 **Services Grid**: Better card design, hover effects, animations
- 🖼️ **Portfolio Grid**: Improved lightbox, category filtering, layout
- 📧 **Contact Form**: Enhanced validation feedback and UX
- 🎭 **Hero Section**: Video background, better CTA placement

### Performance & Accessibility
- ⚡ Maintain/improve performance metrics
- ♿ Ensure WCAG AA compliance
- 🎮 Respect `prefers-reduced-motion`
- 📊 Keep bundle sizes optimized

---

## 🏗️ Project Structure

```
printperfect-pg/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Header.tsx      # Navigation & branding
│   │   ├── HeroSection.tsx # Hero with video background
│   │   ├── ServicesGrid.tsx # Services showcase
│   │   ├── Portfolio.tsx   # Portfolio gallery
│   │   ├── Contact.tsx     # Contact form
│   │   └── ...
│   ├── pages/              # Page-level components
│   │   ├── Index.tsx       # Homepage
│   │   └── NotFound.tsx    # 404 page
│   ├── lib/                # Utilities & helpers
│   │   ├── sanity.ts       # Sanity client
│   │   └── utils.ts        # Helper functions
│   ├── styles/             # Global styles
│   │   ├── index.css       # Tailwind imports & globals
│   │   └── App.css         # App-specific styles
│   ├── hooks/              # Custom React hooks
│   │   ├── useServices.ts  # Fetch services (React Query)
│   │   └── usePortfolio.ts # Fetch portfolio (React Query)
│   ├── cms/                # CMS queries
│   │   └── queries.ts      # GROQ queries
│   ├── types/              # TypeScript definitions
│   └── assets/             # Static images
├── sanity/                  # Sanity schema (reference only)
│   └── schemaTypes/
│       ├── service.ts      # Service schema
│       └── portfolioItem.ts # Portfolio schema
├── public/                  # Public assets
├── .env.example            # Environment template
└── package.json
```

---

## 🚫 Critical Rules - DO NOT MODIFY

### ❌ Backend & Schema
- **DO NOT** modify Sanity schemas (`sanity/schemaTypes/*`)
- **DO NOT** change CMS queries logic (read-only is fine)
- **DO NOT** alter `.env` variables or configuration
- **DO NOT** modify backend integrations or API endpoints

### ❌ Testing Infrastructure
- **DO NOT** remove `data-test-id` attributes (used by E2E tests)
- **DO NOT** break existing test selectors
- **DO NOT** change component export names

### ❌ Core Functionality
- **DO NOT** break existing features (forms, navigation, filtering)
- **DO NOT** remove accessibility attributes (`aria-*`, `role`, etc.)
- **DO NOT** change routing structure
- **DO NOT** modify build configuration without approval

---

## ✅ What You CAN Do

### Visual & Layout
- ✅ Change Tailwind classes (colors, spacing, sizing)
- ✅ Add/modify Framer Motion animations
- ✅ Improve component layouts and structure
- ✅ Add new CSS classes or styles
- ✅ Optimize images and assets

### Components
- ✅ Refactor JSX for better readability
- ✅ Add new UI components (buttons, cards, etc.)
- ✅ Improve responsive breakpoints
- ✅ Enhance hover/focus/active states

### User Experience
- ✅ Improve loading states and skeletons
- ✅ Add better error messages
- ✅ Enhance form validation feedback
- ✅ Optimize animations timing

---

## 🎨 Design Guidelines

### Colors (Current Palette)
```css
/* Primary brand colors */
--primary: hsl(var(--primary));      /* Brand blue */
--secondary: hsl(var(--secondary));  /* Accent color */
--accent: hsl(var(--accent));

/* Neutrals */
--background: hsl(var(--background));
--foreground: hsl(var(--foreground));
--muted: hsl(var(--muted));

/* Semantic */
--destructive: hsl(var(--destructive));
--success: hsl(142, 76%, 36%);
```

### Typography
- **Headings**: Inter (font-bold, font-extrabold)
- **Body**: Inter (font-normal, font-medium)
- **Scale**: text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl

### Spacing
- Follow **8px grid system** (space-2, space-4, space-6, space-8, etc.)
- Container max-width: `max-w-7xl`
- Section padding: `py-12 md:py-20`

### Animations
```tsx
// Respect user preferences
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Use Framer Motion
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
>
```

---

## 📚 Key Technologies

### UI Framework
- **React 18** - Component library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Pre-built components
- **Framer Motion** - Animations

### Data Fetching
- **React Query** - Server state management (already configured)
- **Sanity Client** - CMS integration (read-only)

### Forms & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation

---

## 🎬 Hero Video Integration

### Requirements
1. **Video Source**: `public/printer-video.mp4` (or similar)
2. **Autoplay**: Muted, looped, no controls
3. **Fallback**: Background image if video fails
4. **Performance**: Lazy load, optimize size
5. **Accessibility**: Hidden from screen readers (decorative)

### Example Implementation
```tsx
<div className="relative h-screen overflow-hidden">
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
    aria-hidden="true"
  >
    <source src="/printer-video.mp4" type="video/mp4" />
  </video>
  <div className="relative z-10 bg-black/50">
    {/* Hero content */}
  </div>
</div>
```

---

## 🧪 Testing

### Before Committing
```bash
# Run type checking
npm run typecheck

# Run tests
npm run test

# Build production
npm run build

# Preview build
npm run preview
```

### E2E Tests
```bash
# Run Playwright tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui
```

---

## 📦 Dependencies

### Core
- `react` - UI library
- `react-dom` - React DOM renderer
- `vite` - Build tool
- `typescript` - Type system

### UI/UX
- `tailwindcss` - CSS framework
- `framer-motion` - Animations
- `lucide-react` - Icons
- `@radix-ui/*` - Headless UI primitives

### Data & State
- `@tanstack/react-query` - Server state (caching configured)
- `@sanity/client` - CMS client
- `@sanity/image-url` - Image optimization

### Forms
- `react-hook-form` - Form handling
- `zod` - Validation

---

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:8080)

# Building
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests
npm run typecheck        # TypeScript validation

# Code Quality
npm run lint             # ESLint
npm run format           # Prettier format
```

---

## 🌟 Current State (v1.4.1)

### ✅ Implemented Features
- React Query caching (40-100x faster cached responses)
- SEO-friendly URLs with slug fields
- Advanced GROQ queries (6 new queries)
- SEO metadata fields
- Consolidated Sanity clients
- Mobile-optimized (viewport, fonts, CSS)

### 🎯 Focus Areas for UI Improvement
1. **Hero Section** - Add video background, improve CTA design
2. **Services Grid** - Enhance card design, better animations
3. **Portfolio** - Improve lightbox experience, category filtering UI
4. **Contact Form** - Better validation feedback, success states
5. **Overall Polish** - Consistent spacing, improved typography, smooth transitions

---

## 🤝 Working with AI Agents

### For Lovable.dev or Similar Tools
```
"Enhance the Services Grid component with:
- Staggered entrance animations (Framer Motion)
- Improved hover effects (scale, shadow, border glow)
- Better mobile responsiveness (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Keep data-test-id attributes intact
- Respect prefers-reduced-motion"
```

### For Claude/Copilot
```
"Update HeroSection.tsx to include a background video:
- Video: autoplay, loop, muted
- Overlay: dark gradient for text readability
- Fallback: background image if video fails
- Maintain accessibility (aria-hidden on video)
- Keep existing CTA buttons functional"
```

---

## 📖 References

- [Tailwind Docs](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query/latest)
- [Sanity GROQ](https://www.sanity.io/docs/groq)

---

## 🎉 Ready to Build!

This branch is your **safe playground** for UI experiments. Make it beautiful! 🎨

**Remember**: Focus on visual enhancements, respect accessibility, and maintain performance. The backend and data layer are solid — your mission is to make the frontend shine! ✨
