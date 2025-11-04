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

import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';

// Extend Vitest matchers with jest-axe
expect.extend(toHaveNoViolations);

// IntersectionObserver mock (used by some components)
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
// @ts-ignore jsdom globals
window.IntersectionObserver = mockIntersectionObserver;

// Mock window.matchMedia for responsive/animation tests
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

// Keep framer-motion deterministic in tests (no animations)
vi.mock('framer-motion', async (orig) => {
  const fm = await (orig() as any);
  return {
    ...fm,
    // Preserve DOM structure for queries
    AnimatePresence: ({ children }: any) => children,
    useReducedMotion: () => true,
  };
});
