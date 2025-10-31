# Development Setup Guide

## Prerequisites

- **Node.js**: v20 or higher (recommended v20 LTS)
- **npm**: v10 or higher
- **Git**: Latest version

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd printperfect-pg
```

### 2. Install Dependencies

```bash
npm install
```

This will install all project dependencies and dev dependencies.

### 3. Environment Setup

Create a `.env.local` file in the project root:

```env
# Sanity CMS Configuration
VITE_SANITY_PROJECT_ID=your_project_id_here
VITE_SANITY_DATASET=production

# Optional: Public base URL for GitHub Pages deployment
# VITE_PUBLIC_BASE=/printperfect-pg/
```

Get your Sanity credentials:
1. Visit [sanity.io](https://www.sanity.io)
2. Log in to your project
3. Go to Settings → API
4. Copy Project ID and Dataset name

### 4. Verify Installation

```bash
# Check TypeScript compilation
npm run typecheck

# Run tests
npm run test -- --run

# Build the project
npm run build
```

## Development Workflow

### Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:8080`

### Run Tests

```bash
# Run tests once
npm run test -- --run

# Watch mode (re-run tests on file changes)
npm run test

# Run tests with coverage report
npm run test:coverage
```

### Linting & Code Quality

```bash
# Check code quality
npm run lint

# Format code with Prettier
npx prettier --write 'src/**/*.{ts,tsx,css,js}'

# Check formatting without changes
npm run format:check

# Type checking
npm run typecheck
```

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   └── magicui/         # MagicUI components (BorderBeam, etc.)
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── config/              # Configuration files
├── types/               # TypeScript type definitions
└── setupTests.ts        # Test configuration
```

## Key Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler |
| `npm run sanity:dev` | Start Sanity Studio |

## Debugging

### Browser DevTools
1. Open DevTools with F12 or Ctrl+Shift+I
2. Use React DevTools extension for component debugging
3. Use Network tab to monitor API calls

### VS Code Debugging
Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

## Git Workflow

### Creating a Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature/feature-name

# Make your changes
git add .
git commit -m "feat: add feature description"

# Push to remote
git push origin feature/feature-name
```

### Pre-commit Hooks

The project uses Husky for pre-commit hooks. Before committing:
1. ESLint runs automatically
2. Prettier formats code
3. Only staged files are affected

To bypass (not recommended):
```bash
git commit --no-verify
```

## Deployment

### GitHub Pages (Production)

The project automatically deploys to GitHub Pages on push to `main` branch.

Check `.github/workflows/deploy.yml` for deployment configuration.

### Custom Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Troubleshooting

### Port Already in Use

If port 8080 is already in use:
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8080
kill -9 <PID>
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
npm run typecheck
```

### Tests Failing

```bash
npm run test -- --reporter=verbose
```

## Performance Tips

1. **Use React DevTools Profiler** to identify slow components
2. **Check bundle size**: `npm run build` and review dist/ folder
3. **Enable source maps** for production debugging
4. **Monitor Web Vitals** in browser console

## Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Sanity CMS](https://www.sanity.io)

## Getting Help

- Check existing issues on GitHub
- Review documentation in each component file
- Run tests with verbose output: `npm run test -- --reporter=verbose`
- Check VS Code Problems panel for linting issues
