# Contributing to Paras Graphics Website

Thank you for your interest in contributing to the Paras Graphics website! This document outlines the guidelines and setup process for contributors.

## Project Overview

This is a modern printing services website built with:
- **React** + **TypeScript** - Type-safe component development
- **Vite** - Fast build tooling
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Shadcn/ui** - Accessible component library

## Development Setup

### Prerequisites
- Node.js 20.x or higher
- npm or yarn package manager

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd paras-graphics-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:8080`

4. **Build for production**
   ```bash
   npm run build
   ```

## Code Quality Standards

### TypeScript Requirements
- **All components must use TypeScript** - No `.jsx` files
- Provide proper type annotations for props and state
- Avoid using `any` type unless absolutely necessary
- Use TypeScript utility types when appropriate

### Linting
**IMPORTANT**: Always run linting before committing:

```bash
npm run lint
```

Fix any linting errors before creating a pull request.

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use semantic HTML for accessibility
- Maintain consistent formatting (use Prettier if available)
- Keep components focused and single-purpose

## Contributing Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Add TypeScript types for all new code
   - Test your changes locally

3. **Run quality checks**
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   - Use clear, descriptive commit messages
   - Follow conventional commit format if possible

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Project Structure

```
src/
├── components/        # Reusable React components
│   ├── ui/           # Shadcn/ui components
│   └── ...           # Feature components
├── pages/            # Page-level components
├── lib/              # Utility functions
├── assets/           # Images and static assets
└── index.css         # Global styles and design tokens
```

## Architecture Overview

To maintain a clean and scalable codebase, we've introduced a few key architectural patterns:

-   **`src/config/constants.ts`**: This file is the single source of truth for any hardcoded or environment-specific values, such as phone numbers, API endpoints, or default settings. Centralizing these constants makes them easy to update and prevents magic strings from being scattered across the codebase.

-   **`createForwardRef` Utility**: Found in `src/lib/utils.ts`, this utility helps reduce boilerplate when creating new UI components that need to forward a `ref`. It standardizes the process of combining `React.forwardRef` with a display name, making component code cleaner and more consistent.

## Data Structure Guidelines (Sanity)

**Note:** This section outlines upcoming requirements for data modeling in Sanity.

To ensure consistent and predictable content rendering, all new Sanity schemas must include the following fields for data presentation control:

-   **`priority: number`**: A numerical field to control the display order of items. Lower numbers have higher priority (e.g., `1` appears before `2`).
-   **`filters: [reference]`**: A reference array that connects the data to relevant filter categories (e.g., linking a portfolio piece to "Business Cards" or "Banners").

## Design System

- Use semantic tokens from `index.css` and `tailwind.config.ts`
- Avoid hardcoded colors - use theme variables
- Maintain CMYK-inspired accent colors (cyan, magenta, yellow)
- Ensure all new UI is responsive and accessible

## Accessibility

- Use semantic HTML elements
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers when possible

## Questions?

If you have questions about contributing, feel free to open an issue or reach out to the maintainers.

Thank you for contributing to Paras Graphics! 🎨
