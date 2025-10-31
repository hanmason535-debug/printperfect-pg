/**
 * ═══════════════════════════════════════════════════════════════════════════
 * useIsMobile Hook - Mobile Device Detection
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview React hook for detecting mobile viewport using window.matchMedia
 * with automatic updates on viewport resize.
 *
 * @description
 * The useIsMobile hook provides responsive mobile detection:
 *
 * **Features**:
 * - Detects viewport width below 768px (tablet breakpoint)
 * - Reactive: Updates when window is resized
 * - SSR-safe: Returns undefined initially, then actual value
 * - Efficient: Uses native matchMedia API
 * - Auto-cleanup: Removes event listeners on unmount
 *
 * **Breakpoint**:
 * - Mobile: < 768px
 * - Desktop/Tablet: >= 768px
 * - Constant: MOBILE_BREAKPOINT = 768
 *
 * **Usage**:
 * ```tsx
 * import { useIsMobile } from '@/hooks/use-mobile'
 *
 * function ResponsiveNav() {
 *   const isMobile = useIsMobile()
 *
 *   return isMobile ? <MobileNav /> : <DesktopNav />
 * }
 * ```
 *
 * **SSR Considerations**:
 * - Returns `undefined` on first render (server-side)
 * - Returns actual boolean after hydration (client-side)
 * - Prevents hydration mismatches
 *
 * **Performance**:
 * - Uses matchMedia (native, optimized)
 * - Event listener only fires on actual breakpoint changes
 * - Automatically removes listener on unmount
 *
 * @returns {boolean} true if viewport width < 768px, false otherwise
 *
 * @example
 * function MyComponent() {
 *   const isMobile = useIsMobile()
 *
 *   if (isMobile === undefined) return null // Loading
 *
 *   return (
 *     <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
 *       {isMobile ? 'Mobile View' : 'Desktop View'}
 *     </div>
 *   )
 * }
 */

import * as React from 'react';

/** Viewport width threshold for mobile devices (pixels) */
const MOBILE_BREAKPOINT = 768;

/**
 * Hook to detect if current viewport is mobile-sized
 *
 * @returns {boolean} true if viewport < 768px, false otherwise
 *
 * @description
 * - Checks window.innerWidth against MOBILE_BREAKPOINT
 * - Updates reactively when window is resized
 * - Returns undefined during server-side rendering
 * - Safe to use in conditional rendering
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
