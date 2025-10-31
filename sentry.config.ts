/**
 * Sentry Configuration
 * Error tracking and performance monitoring
 */

/// <reference types="vite/client" />

export const sentryConfig = {
  dsn: import.meta.env.VITE_SENTRY_DSN as string || '',
  
  // Environment detection
  environment: import.meta.env.MODE as string || 'development',
  
  // Only enable in production
  enabled: import.meta.env.PROD as boolean,
  
  // Performance Monitoring
  tracesSampleRate: 0.1, // 10% of transactions
  
  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
  
  // Integrations
  integrations: [
    // Add breadcrumbs for console logs
    // Add breadcrumbs for HTTP requests
  ],
  
  // Before sending events
  beforeSend(event: any, hint: any) {
    // Don't send events in development
    if (import.meta.env.DEV as boolean) {
      console.error('Sentry Event (dev only):', event, hint);
      return null;
    }
    
    // Filter out known errors
    if (event.exception) {
      const exceptionValue = event.exception.values?.[0]?.value;
      
      // Ignore network errors from ad blockers
      if (exceptionValue?.includes('Failed to fetch')) {
        return null;
      }
      
      // Ignore extension errors
      if (exceptionValue?.includes('chrome-extension')) {
        return null;
      }
    }
    
    return event;
  },
  
  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'chrome-extension://',
    'moz-extension://',
    
    // Random plugins/extensions
    'Can\'t find variable: ZiteReader',
    'jigsaw is not defined',
    'ComboSearch is not defined',
    
    // Facebook errors
    'fb_xd_fragment',
    
    // Network errors
    'NetworkError',
    'Network request failed',
    
    // ResizeObserver loop limit exceeded (harmless)
    'ResizeObserver loop',
  ],
};
