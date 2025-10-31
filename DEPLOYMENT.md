# Deployment Guide

This document covers deployment procedures for the Print Perfect project.

## Deployment Options

### 1. GitHub Pages (Recommended - Free)

**Advantages:**
- Free hosting
- Automatic deployments on push to main
- CDN included
- HTTPS by default

**Setup:**
1. Repository settings → Pages
2. Set source to "GitHub Actions"
3. Deployment runs automatically on push

**Important:** Update `VITE_PUBLIC_BASE` in GitHub Actions workflows if hosting at a subdirectory.

### 2. Vercel

**Advantages:**
- Optimal Next.js/Vite support
- Preview deployments for PRs
- Easy environment variable management
- Automatic SSL

**Steps:**
1. Import project on vercel.com
2. Add environment variables:
   - `VITE_SANITY_PROJECT_ID`
   - `VITE_SANITY_DATASET`
3. Deploy

### 3. Netlify

**Advantages:**
- Generous free tier
- Form handling included
- Split testing support
- Preview deployments

**Steps:**
1. Connect GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy

### 4. Self-hosted (Docker)

**Advantages:**
- Full control
- Custom domain
- Custom server configuration

**Dockerfile:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "preview"]
```

## Pre-deployment Checklist

- [ ] All tests pass: `npm run test -- --run`
- [ ] TypeScript compiles: `npm run typecheck`
- [ ] ESLint passes: `npm run lint`
- [ ] Environment variables are set
- [ ] Build succeeds: `npm run build`
- [ ] Bundle size is acceptable
- [ ] No console errors in build

## Environment Variables

### Production

```env
VITE_SANITY_PROJECT_ID=your_production_project_id
VITE_SANITY_DATASET=production
```

### Staging

```env
VITE_SANITY_PROJECT_ID=your_staging_project_id
VITE_SANITY_DATASET=staging
```

## Build Optimization

### Analyze Bundle Size

```bash
npm run build
# Check dist/ folder size
```

### Production Build Flags

```bash
# Build with production optimizations
npm run build

# Build with source maps for debugging
npm run build -- --sourcemap
```

## Security Considerations

1. **Never commit `.env` files** - Use environment variables
2. **Enable HTTPS** - Most hosting platforms do this automatically
3. **Set security headers** - See `src/config/security-headers.ts`
4. **Validate form submissions** server-side
5. **Keep dependencies updated** - Run `npm audit` regularly

## Monitoring

### Error Tracking

Add error tracking service (e.g., Sentry):

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Analytics

Add analytics service (e.g., Google Analytics, Plausible):

```typescript
// Add to main.tsx or in a useEffect
gtag('config', 'GA_MEASUREMENT_ID');
```

### Performance Monitoring

Web Vitals are already configured in `src/main.tsx`

## Troubleshooting Deployments

### Build Fails

```bash
# Clear build cache
rm -rf dist/
npm run build

# Check for errors
npm run typecheck
npm run lint
```

### Environment Variables Not Working

1. Verify variables are set in deployment platform
2. Check variable names match `VITE_*` prefix
3. Restart deployment after updating variables

### Performance Issues

1. Check bundle size in dist/
2. Review Network tab in DevTools
3. Check images are optimized
4. Review React DevTools Profiler

## Rollback

If deployment has issues:

1. **GitHub Pages**: Push previous working commit to main
2. **Vercel/Netlify**: Use "Deployments" to revert to previous version
3. **Docker**: Restart with previous image tag

## CI/CD Pipeline

The project includes GitHub Actions workflows:

- **ci.yml**: Runs on PR and push (lint, test, build)
- **deploy.yml**: Deploys to GitHub Pages on main push
- **security.yml**: Runs security checks
- **performance.yml**: Analyzes bundle size

View workflow status: Repository → Actions tab

## Post-Deployment

1. **Verify functionality** in production environment
2. **Test all contact forms** and interactive features
3. **Check mobile responsiveness** with Chrome DevTools
4. **Monitor error tracking** for any issues
5. **Review analytics** for user interactions

## Release Notes

Document changes in CHANGELOG.md before deployment:

```markdown
## [1.4.0] - 2024-01-15

### Added
- BorderBeam animation effects
- Enhanced security headers

### Fixed
- GitHub Actions workflow errors
- Missing Tailwind animations

### Changed
- Improved test coverage
```

## Support

For deployment issues:
- Check GitHub Actions logs
- Review hosting platform documentation
- Check browser console for errors
- Verify environment variables
