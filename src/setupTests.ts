/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Vitest Test Setup - Global Test Configuration
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview Global test environment configuration for Vitest.
 * Sets up DOM matchers, mocks browser APIs, and configures test utilities.
 *
 * @description
 * This file runs before every test suite to configure the testing environment:
 *
 * **Configured Features**:
 * - ✅ DOM matchers from @testing-library/jest-dom
 * - ✅ IntersectionObserver API mock (for lazy loading tests)
 * - ✅ matchMedia API mock (for responsive/reduced-motion tests)
 *
 * **Why These Mocks?**
 *
 * 1. **IntersectionObserver**: Not available in jsdom environment
 *    - Used by lazy loading components (Portfolio, ServicesGrid)
 *    - Mock prevents "IntersectionObserver is not defined" errors
 *
 * 2. **matchMedia**: Not available in jsdom environment
 *    - Used by responsive hooks (use-mobile.tsx)
 *    - Used for prefers-reduced-motion detection
 *    - Mock prevents "matchMedia is not a function" errors
 *
 * **Test Environment**:
 * - Runner: Vitest (Vite-native test runner)
 * - DOM: jsdom (simulated browser environment)
 * - Library: @testing-library/react
 * - Matchers: jest-dom custom matchers
 *
 * **Auto-Imported Features** (from vite.config.ts):
 * - describe, it, expect from vitest
 * - vi (mock utilities) from vitest
 * - render, screen, fireEvent from @testing-library/react
 *
 * @module setupTests
 * @see {@link https://vitest.dev/config/#setupfiles} Vitest Setup Files
 * @see {@link https://testing-library.com/docs/react-testing-library/setup} Testing Library Setup
 */

/**
 * Import jest-dom custom matchers
 *
 * @description
 * Extends Vitest expect() with DOM-specific matchers:
 * - toBeInTheDocument()
 * - toHaveClass()
 * - toHaveAttribute()
 * - toBeVisible()
 * - toBeDisabled()
 * - And 50+ more...
 *
 * @example
 * // Before: Generic expect
 * expect(element.classList.contains('active')).toBe(true)
 *
 * // After: Semantic matcher
 * expect(element).toHaveClass('active')
 */
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';

// Extend Vitest matchers with jest-axe
expect.extend(toHaveNoViolations);

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Mock IntersectionObserver API
 * ─────────────────────────────────────────────────────────────────────────
 *
 * @description
 * IntersectionObserver is a browser API for detecting element visibility.
 * Used by lazy loading components but not available in jsdom test environment.
 *
 * **Where It's Used**:
 * - Portfolio component (lazy load images)
 * - ServicesGrid component (lazy load service cards)
 * - Any component with intersection-based animations
 *
 * **Mock Behavior**:
 * - observe(): Does nothing (no-op)
 * - unobserve(): Does nothing (no-op)
 * - disconnect(): Does nothing (no-op)
 *
 * **Why This Works**:
 * - Components call observer.observe(element)
 * - Mock accepts the call without errors
 * - Tests can focus on rendering logic
 *
 * @example
 * // In component code:
 * const observer = new IntersectionObserver((entries) => {
 *   entries.forEach(entry => {
 *     if (entry.isIntersecting) loadImage()
 *   })
 * })
 * observer.observe(imageRef.current)
 *
 * // In tests:
 * // Mock prevents "IntersectionObserver is not defined" error
 * render(<LazyLoadedImage />)
 */
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Mock window.matchMedia API
 * ─────────────────────────────────────────────────────────────────────────
 *
 * @description
 * matchMedia is a browser API for testing CSS media queries.
 * Used for responsive design and prefers-reduced-motion detection.
 * Not available in jsdom test environment.
 *
 * **Where It's Used**:
 * - use-mobile.tsx hook (768px breakpoint detection)
 * - Lightbox component (prefers-reduced-motion)
 * - Any component with responsive behavior
 *
 * **Mock Configuration**:
 * - matches: false (desktop mode by default)
 * - media: Returns the query string passed
 * - Event listeners: No-op functions
 *
 * **Testing Responsive Behavior**:
 * To test mobile view, override in specific tests:
 * ```typescript
 * window.matchMedia = vi.fn().mockImplementation(query => ({
 *   matches: query === '(max-width: 768px)', // Mobile
 *   media: query,
 *   ...
 * }))
 * ```
 *
 * @example
 * // In component code:
 * const isMobile = window.matchMedia('(max-width: 768px)').matches
 *
 * // In tests:
 * // Mock returns { matches: false } by default
 * render(<ResponsiveComponent />)
 * // Component renders in desktop mode
 *
 * @example
 * // Testing reduced motion:
 * const prefersReducedMotion = window.matchMedia(
 *   '(prefers-reduced-motion: reduce)'
 * ).matches
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
