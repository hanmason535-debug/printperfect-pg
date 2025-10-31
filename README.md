# Print Perfect (Paras Graphics)

Premium printing solutions website built with modern web technologies.

**Website**: https://parasgraphics.com (or your deployment URL)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Development](#-development)
- [Testing](#-testing)
- [Building](#-building)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Documentation](#-documentation)

## ✨ Features

- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **High Performance** - Lazy loading, code splitting, optimized images
- ✅ **Accessible** - WCAG 2.1 AA compliant
- ✅ **SEO Optimized** - Structured data, meta tags, sitemap
- ✅ **CMS Integration** - Sanity CMS for content management
- ✅ **Beautiful UI** - Tailwind CSS + shadcn/ui components
- ✅ **Dark Mode** - Built-in dark theme support
- ✅ **Contact Forms** - Secure form handling with validation
- ✅ **Portfolio Showcase** - Filterable portfolio items
- ✅ **Service Listings** - Categorized services display

## 🛠️ Tech Stack

### Frontend
- **React** 18.3 - UI library
- **TypeScript** 5.4 - Type safety
- **Vite** 7.1 - Build tool and dev server
- **Tailwind CSS** 3.4 - Utility-first styling
- **Framer Motion** - Smooth animations

### CMS & Data
- **Sanity CMS** 4.10 - Content management
- **React Query** 5.90 - Data fetching and caching

### UI Components
- **shadcn/ui** - Accessible component library
- **Radix UI** - Unstyled, accessible components
- **Lucide Icons** - Beautiful icons

### Testing & Quality
- **Vitest** 3.2 - Unit testing
- **React Testing Library** - Component testing
- **ESLint** - Code quality
- **Prettier** - Code formatting

### DevOps
- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Hosting

## 🚀 Quick Start

### Prerequisites
- Node.js v20 or higher
- npm v10 or higher
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd printperfect-pg

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Sanity credentials

# Start development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## 📚 Development

### Available Scripts

```bash
# Development server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Testing
npm run test          # Watch mode
npm run test -- --run # Single run
npm run test:coverage # With coverage report

# Building
npm run build

# Preview production build
npm run preview

# Sanity CMS dev
npm run sanity:dev
```

### Project Structure

```
src/
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   └── magicui/     # Custom UI components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── config/          # Configuration
├── types/           # TypeScript definitions
├── assets/          # Images and static files
├── cms/             # Sanity queries
└── integrations/    # Third-party integrations
```

### Code Quality

This project includes:
- ✅ ESLint configuration for code quality
- ✅ Prettier configuration for consistent formatting
- ✅ Pre-commit hooks with Husky
- ✅ TypeScript strict mode
- ✅ Accessibility checks

```bash
# Format code
npx prettier --write 'src/**/*.{ts,tsx,css,js}'

# Check formatting
npm run format:check
```

## ✅ Testing

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- Contact.test.tsx

# Watch mode
npm run test

# Coverage report
npm run test:coverage
```

### Test Structure
- **Portfolio.test.tsx** - Portfolio component tests
- **Lightbox.test.tsx** - Lightbox component tests
- **ServicesGrid.test.tsx** - Services grid tests
- **Contact.test.tsx** - Contact form tests
- **Header.test.tsx** - Header navigation tests

## 🏗️ Building

```bash
# Production build
npm run build

# Preview build output
npm run preview

# Check bundle size
npm run build
# Review dist/ folder
```

Build output is in the `dist/` directory, optimized for production.

## 🚀 Deployment

### Quick Deploy to GitHub Pages

```bash
git push origin main
# Deployment runs automatically via GitHub Actions
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Supported Platforms
- GitHub Pages (included)
- Vercel
- Netlify
- Docker/Self-hosted

## 📖 Documentation

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development setup and workflow
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment procedures
- **[PROJECT_AUDIT_REPORT.md](./PROJECT_AUDIT_REPORT.md)** - Comprehensive project analysis

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run tests: `npm run test -- --run`
4. Run linting: `npm run lint`
5. Commit with clear message: `git commit -m 'feat: add your feature'`
6. Push and create a Pull Request

### Commit Message Format

```
type(scope): subject

feat: add new feature
fix: fix a bug
docs: update documentation
test: add tests
chore: update dependencies
```

## 📊 Performance

- **Lighthouse Score**: 90+
- **Bundle Size**: ~280KB uncompressed (~80KB gzipped)
- **Lazy Loading**: Images and components
- **Code Splitting**: Automatic route-based splitting
- **Caching**: QueryClient optimized

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader support
- Color contrast verified
- Semantic HTML

## 🔒 Security

- Content Security Policy headers
- No hardcoded secrets
- Environment variable isolation
- Form validation and sanitization
- Honeypot bot protection

## 🎨 Design System

### Colors (CMYK Brand)
- **Cyan**: Primary accent
- **Magenta**: Secondary accent
- **Yellow**: Tertiary accent
- **Charcoal**: Dark neutral

### Typography
- **Headings**: Montserrat
- **Body**: Inter, Poppins

### Spacing & Layout
- Tailwind CSS default spacing scale
- Responsive breakpoints (sm, md, lg, xl, 2xl)
- Flexible grid system

## 📞 Support & Feedback

- Report issues on GitHub Issues
- Check existing issues before creating new ones
- Include reproduction steps for bugs

## 📄 License

This project is licensed under the MIT License - see [LICENSE.md](./LICENSE.md)

## 👨‍💻 Author

**Paras Graphics**  
Ahmedabad, India

---

**Last Updated**: October 2024  
**Project Status**: Active Development
