/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Root Application Component - PrintPerfect-PG
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview Main application component that sets up global providers,
 * routing, error boundaries, and loading states for the entire application.
 *
 * @description
 * The App component is the root of the React component tree. It establishes:
 *
 * **Provider Hierarchy**:
 * 1. ErrorBoundary - Catches and handles runtime errors gracefully
 * 2. QueryClientProvider - Enables React Query for data fetching/caching
 * 3. TooltipProvider - Provides tooltip context for shadcn/ui components
 * 4. Toast Providers - Enables toast notifications (dual system for compatibility)
 * 5. BrowserRouter - Enables client-side routing
 *
 * **Performance Optimizations**:
 * - Lazy loading of route components for code splitting
 * - Optimized React Query configuration (5min stale time, 10min cache)
 * - Suspense boundaries with loading fallbacks
 * - Route-based code splitting reduces initial bundle size
 *
 * **Error Handling**:
 * - ErrorBoundary catches React errors and displays fallback UI
 * - Prevents entire app crash from component errors
 * - Logs errors for debugging in development
 *
 * @see {@link https://tanstack.com/query/latest} TanStack Query Documentation
 * @see {@link https://reactrouter.com/} React Router Documentation
 */

import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { lazy, Suspense } from 'react';

// ─── Lazy-Loaded Route Components ────────────────────────────────────────────

// Lazy load page components for better code splitting
// This splits each route into a separate chunk, reducing initial bundle size
// Users only download the JavaScript they need for the current route
const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));

// ─── React Query Configuration ───────────────────────────────────────────────

/**
 * Configure TanStack Query (React Query) client with optimized defaults
 *
 * @constant queryClient
 * @description
 * Configures global defaults for all React Query hooks in the application.
 *
 * **Configuration Rationale**:
 * - **staleTime (5 minutes)**: Data stays "fresh" and won't refetch for 5 minutes
 *   Reduces unnecessary network requests for static content (portfolio, services)
 *
 * - **gcTime (10 minutes)**: Cached data kept in memory for 10 minutes
 *   Previously called `cacheTime` in React Query v4
 *   Allows fast navigation back to previously viewed pages
 *
 * - **refetchOnWindowFocus (disabled)**: Don't refetch when user returns to tab
 *   Prevents annoying refetches when switching between tabs
 *   Can be enabled per-query if needed
 *
 * - **retry (1)**: Only retry failed requests once
 *   Balances reliability with performance
 *   Prevents excessive retries on server errors
 *
 * @see {@link https://tanstack.com/query/latest/docs/react/reference/QueryClient} QueryClient API
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
      gcTime: 1000 * 60 * 10, // 10 minutes - garbage collection time (formerly cacheTime)
      refetchOnWindowFocus: false, // Disable refetch on window focus for better performance
      retry: 1, // Only retry once on failure
    },
  },
});

// ─── Loading Fallback Component ──────────────────────────────────────────────

/**
 * Loading fallback UI displayed while route components are loading
 *
 * @description
 * Shows a centered spinner and "Loading..." text during:
 * - Initial route load (lazy loaded components)
 * - Route transitions between pages
 * - Code chunk downloads
 *
 * Accessibility features:
 * - role="status" for screen readers
 * - aria-label provides context to assistive technologies
 */
const LoadingFallback = (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div
        className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"
        role="status"
        aria-label="Loading"
      />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// ─── Root App Component ──────────────────────────────────────────────────────

/**
 * Main App component - Root of the component tree
 *
 * @returns {JSX.Element} The complete application with all providers and routes
 *
 * @description
 * Provider nesting order (outer to inner):
 * 1. ErrorBoundary: Catches any React errors from children
 * 2. QueryClientProvider: Provides React Query context
 * 3. TooltipProvider: Provides tooltip functionality (shadcn/ui)
 * 4. Toaster components: Toast notification systems
 * 5. BrowserRouter: Client-side routing
 * 6. Suspense: Loading boundary for lazy-loaded routes
 * 7. Routes: Route configuration
 *
 * @example
 * // This component is rendered in main.tsx:
 * createRoot(document.getElementById("root")!).render(<App />);
 */
const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Toast notification systems - dual setup for compatibility */}
        <Toaster /> {/* shadcn/ui toaster */}
        <Sonner /> {/* Sonner toaster (alternative system) */}
        {/* Client-side routing */}
        <BrowserRouter>
          {/* Suspense boundary for lazy-loaded routes */}
          <Suspense fallback={LoadingFallback}>
            <Routes>
              {/* Home page */}
              <Route path="/" element={<Index />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}

              {/* 404 Not Found - Must be last route (catch-all) */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
