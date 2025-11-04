/**
 * Application entry — combined and conflict-resolved.
 *
 * This file initializes the React application and sets up global providers.
 * It uses React Query for data fetching and includes a dev-only toolbar
 * initializer (stagewise) and performance reporting.
 */

import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';

// Optional dev-only stagewise toolbar (safe try/catch)
function setupStagewiseToolbar() {
  if (!import.meta.env.DEV) return;
  try {
    // Import lazily so production build doesn't include the toolbar
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { initToolbar } = require('@21st-extension/toolbar');
    initToolbar({ plugins: [] });
  } catch (e) {
    // Non-blocking: toolbar is purely developer convenience
    // Keep silent to avoid noisy logs in dev if not installed
  }
}

// React Query client with sensible defaults for CMS data
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 3,
      refetchOnWindowFocus: true,
      refetchOnReconnect: false,
    },
  },
});

// Mount application
const rootElement = document.getElementById('root')!;
createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

// Setup dev toolbar and performance reporting after mount
setupStagewiseToolbar();

try {
  // Optional performance reporter if provided
  // Use dynamic import to avoid failing the app if file is missing
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const perf = require('@/lib/performance');
  if (import.meta.env.DEV && perf && typeof perf.reportWebVitals === 'function') {
    perf.reportWebVitals();
  }
} catch (e) {
  // ignore
}
