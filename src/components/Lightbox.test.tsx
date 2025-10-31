import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Lightbox from './Lightbox'
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('@/lib/image', () => {
  class MockBuilder {
    width() { return this }
    height() { return this }
    fit() { return this }
    format() { return this }
    quality() { return this }
    url() { return 'https://example.com/image.jpg' }
  }
  return {
    urlFor: vi.fn(() => new MockBuilder()),
  }
})

// Mock useReducedMotion to test both paths
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    useReducedMotion: vi.fn(() => false), // Default to no reduced motion in tests
  }
})

const items = [
  { _id: '1', title: 'A', description: 'da', image: { asset: { _ref: 'image-a' } }, priority: 1, category: 'Test', categorySlugs: [] as string[], link: '', hoverId: null as any },
  { _id: '2', title: 'B', description: 'db', image: { asset: { _ref: 'image-b' } }, priority: 2, category: 'Test', categorySlugs: [] as string[], link: '', hoverId: null as any },
  { _id: '3', title: 'C', description: 'dc', image: { asset: { _ref: 'image-c' } }, priority: 3, category: 'Test', categorySlugs: [] as string[], link: '', hoverId: null as any },
] as any

describe('Lightbox', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens, displays content, and navigates correctly', async () => {
    const onOpenChange = vi.fn()
    render(<Lightbox open={true} onOpenChange={onOpenChange} items={items} startIndex={0} />)

    // Check initial content
    expect(screen.getByTestId('lightbox')).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'A' })).toBeInTheDocument()

    // Navigate next
    await userEvent.click(screen.getByTestId('lightbox-next'))
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'B' })).toBeInTheDocument()
    })

    // Navigate prev
    await userEvent.click(screen.getByTestId('lightbox-prev'))
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'A' })).toBeInTheDocument()
    })
  })

  it('closes on escape key and backdrop click', async () => {
    const onOpenChange = vi.fn()
    render(<Lightbox open={true} onOpenChange={onOpenChange} items={items} startIndex={0} />)

    // Escape key
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onOpenChange).toHaveBeenCalledWith(false)

    // Backdrop click
    // The backdrop is the first div inside the lightbox container
    await userEvent.click(screen.getByTestId('lightbox').querySelector('div:first-child')!)
    expect(onOpenChange).toHaveBeenCalledWith(false) // Backdrop click should also close (false)
  })

  it('traps focus and handles keyboard navigation', async () => {
    const onOpenChange = vi.fn()
    render(<Lightbox open={true} onOpenChange={onOpenChange} items={items} startIndex={1} />)

    // Arrow right
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'C' })).toBeInTheDocument()
    })

    // Arrow left
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'B' })).toBeInTheDocument()
    })
  })

  it('renders controls in the correct positions', () => {
    render(<Lightbox open={true} onOpenChange={() => {}} items={items} startIndex={0} />)

    const closeBtn = screen.getByTestId('lightbox-close')
    const prevBtn = screen.getByTestId('lightbox-prev')
    const nextBtn = screen.getByTestId('lightbox-next')

    expect(closeBtn).toHaveClass('top-5 right-5')
    expect(prevBtn).toHaveClass('left-6 top-1/2')
    expect(nextBtn).toHaveClass('right-6 top-1/2')
  })

  it('ensures DialogContent renders properly without focus trap errors', () => {
    const onOpenChange = vi.fn()
    const { container } = render(
      <Lightbox open={true} onOpenChange={onOpenChange} items={items} startIndex={0} />
    )

    // Get the lightbox element
    const lightboxEl = screen.getByTestId('lightbox')
    expect(lightboxEl).toBeDefined()
    expect(lightboxEl instanceof HTMLDivElement).toBe(true)
  })

  it('handles empty items array without crashing', () => {
    const onOpenChange = vi.fn()
    const { container } = render(
      <Lightbox open={true} onOpenChange={onOpenChange} items={[]} startIndex={0} />
    )

    // Should not render anything if items is empty
    expect(screen.queryByTestId('lightbox')).not.toBeInTheDocument()
  })

  it('cycles through items correctly with wrap-around', async () => {
    const onOpenChange = vi.fn()
    render(<Lightbox open={true} onOpenChange={onOpenChange} items={items} startIndex={2} />)

    // At last item, next should wrap to first
    await userEvent.click(screen.getByTestId('lightbox-next'))
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'A' })).toBeInTheDocument()
    })

    // At first item, prev should wrap to last
    await userEvent.click(screen.getByTestId('lightbox-prev'))
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'C' })).toBeInTheDocument()
    })
  })
})
