import '@testing-library/jest-dom'
import { vi } from 'vitest'

// IntersectionObserver mock (used by some components)
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
// @ts-expect-error jsdom globals
window.IntersectionObserver = mockIntersectionObserver

// Keep framer-motion deterministic in tests
vi.mock('framer-motion', async (orig) => {
  const fm = await (orig() as any)
  return {
    ...fm,
    // Don't remove motion.* elements (preserve DOM for queries)
    AnimatePresence: ({ children }: any) => children,
    useReducedMotion: () => true,
  }
})
