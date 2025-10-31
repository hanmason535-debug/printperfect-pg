/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Application Entry Point - PrintPerfect-PG
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview Main entry point for the React application. Initializes the
 * React root, renders the App component, and sets up performance monitoring.
 *
 * @description
 * This file is the first JavaScript executed when the application loads.
 * It performs the following initialization tasks:
 *
 * 1. Creates the React root using the new React 18 createRoot API
 * 2. Renders the root App component into the DOM
 * 3. Imports global styles (Tailwind CSS)
 * 4. Initializes web vitals reporting in development mode
 *
 * The React 18 createRoot API enables:
 * - Concurrent rendering features
 * - Automatic batching of state updates
 * - Better error boundaries
 * - Suspense for data fetching
 *
 * @see {@link https://react.dev/reference/react-dom/client/createRoot} React 18 createRoot
 * @see {@link https://web.dev/vitals/} Web Vitals Documentation
 */

import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';
import { reportWebVitals } from '@/lib/performance';

// ─── React Query Configuration ───────────────────────────────────────────────

// Create a QueryClient with optimized defaults for CMS data
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: Data is fresh for 5 minutes (CMS content changes infrequently)
      staleTime: 5 * 60 * 1000,
      // Cache time: Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      // Refetch on window focus for fresh data when user returns to tab
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect (staleTime handles freshness)
      refetchOnReconnect: false,
    },
  },
});

// ─── React Root Initialization ───────────────────────────────────────────────

// Get the root DOM element where React will mount
// The non-null assertion (!) is safe because this element is guaranteed to exist in index.html
const rootElement = document.getElementById('root')!;

// Create React 18 root and render the App component with React Query provider
// This uses React 18's concurrent rendering features for better performance
createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

// ─── Performance Monitoring ──────────────────────────────────────────────────

// Report Core Web Vitals in development mode only
// Tracks important performance metrics like:
// - LCP (Largest Contentful Paint): Loading performance
// - FID (First Input Delay): Interactivity
// - CLS (Cumulative Layout Shift): Visual stability
// - FCP (First Contentful Paint): Perceived load speed
// - TTFB (Time to First Byte): Server response time
if (import.meta.env.DEV) {
  reportWebVitals();
}
