/**
 * Performance Monitoring Utilities
 * Helpers for tracking and optimizing application performance
 */

/**
 * Measure and log component render time
 * @param componentName - Name of the component being measured
 * @param callback - Function to measure
 */
export const measureRender = <T>(componentName: string, callback: () => T): T => {
  if (import.meta.env.DEV) {
    const start = performance.now();
    const result = callback();
    const end = performance.now();
    console.log(`[Performance] ${componentName} rendered in ${(end - start).toFixed(2)}ms`);
    return result;
  }
  return callback();
};

/**
 * Create a performance mark for measuring
 * @param markName - Name of the performance mark
 */
export const mark = (markName: string): void => {
  if ('performance' in window && 'mark' in performance) {
    performance.mark(markName);
  }
};

/**
 * Measure the duration between two marks
 * @param measureName - Name of the measurement
 * @param startMark - Start mark name
 * @param endMark - End mark name
 */
export const measure = (measureName: string, startMark: string, endMark: string): void => {
  if ('performance' in window && 'measure' in performance) {
    try {
      performance.measure(measureName, startMark, endMark);

      if (import.meta.env.DEV) {
        const measure = performance.getEntriesByName(measureName)[0];
        console.log(`[Performance] ${measureName}: ${measure.duration.toFixed(2)}ms`);
      }
    } catch (e) {
      console.warn('Performance measurement failed:', e);
    }
  }
};

/**
 * Get web vitals metrics
 * Uses the Web Vitals API to track Core Web Vitals
 */
export const reportWebVitals = (): void => {
  if (import.meta.env.DEV && 'PerformanceObserver' in window) {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('[Web Vitals] LCP:', lastEntry.startTime.toFixed(2), 'ms');
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fid = (entry as PerformanceEventTiming).processingStart - entry.startTime;
        console.log('[Web Vitals] FID:', fid.toFixed(2), 'ms');
      });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });

    // Cumulative Layout Shift (CLS)
    let clsScore = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceEntry[]) {
        if (!(entry as any).hadRecentInput) {
          clsScore += (entry as any).value;
        }
      }
      console.log('[Web Vitals] CLS:', clsScore.toFixed(4));
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  }
};

/**
 * Debounce function for performance optimization
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance optimization
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};
