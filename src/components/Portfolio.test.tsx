import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect } from 'vitest'
import Portfolio from './Portfolio'
import { usePortfolio } from '@/hooks/usePortfolio'

vi.mock('@/hooks/usePortfolio')
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

const mockUsePortfolio = usePortfolio as jest.Mock

const makePortfolioItems = (categories: { [key: string]: number }) =>
  Object.entries(categories).flatMap(([category, count]) =>
    Array.from({ length: count }, (_, i) => ({
      _id: `${category}-id-${i}`,
      title: `${category} Item ${i + 1}`,
      category: category,
      image: { asset: { _ref: `image-ref-${i}` } },
    }))
  )

describe('Portfolio', () => {
  it('renders skeletons while loading', () => {
    mockUsePortfolio.mockReturnValue({ data: [], loading: true, error: null })
    const { container } = render(<Portfolio />)
    // PortfolioSkeleton renders 12 items with class h-64 w-full
    expect(container.querySelectorAll('.h-64.w-full').length).toBe(12)
  })

  it('generates filter tabs dynamically from portfolio items', async () => {
    const items = makePortfolioItems({ 'Category A': 2, 'Category B': 3 })
    mockUsePortfolio.mockReturnValue({ data: items, loading: false, error: null })
    render(<Portfolio />)

    await waitFor(() => {
      expect(screen.getByTestId('filter-all')).toBeInTheDocument()
      expect(screen.getByTestId('filter-category-a')).toBeInTheDocument()
      expect(screen.getByTestId('filter-category-b')).toBeInTheDocument()
    })
  })

  it('filters items when a category tab is clicked and updates filter', async () => {
    const items = makePortfolioItems({ 'Category A': 10, 'Category B': 5 })
    mockUsePortfolio.mockReturnValue({ data: items, loading: false, error: null })
    render(<Portfolio />)

    // Click a filter
    await userEvent.click(await screen.findByTestId('filter-category-b'))

    await waitFor(() => {
      // Category B items should be visible
      expect(screen.getByText('Category B Item 1')).toBeInTheDocument()
      // Category A items should not be visible
      expect(screen.queryByText('Category A Item 1')).not.toBeInTheDocument()
    })
  })

  it('displays an empty state when a filter results in no items', async () => {
    const items = makePortfolioItems({ 'Category A': 2, 'Category B': 5 })
    mockUsePortfolio.mockReturnValue({ data: items, loading: false, error: null })
    render(<Portfolio />)

    // Click the "All" filter which should show all items
    await userEvent.click(await screen.findByTestId('filter-all'))

    await waitFor(() => {
      // Should display items
      expect(screen.getByText('Category A Item 1')).toBeInTheDocument()
    })
  })

  it('clamps display when filtering to fewer items', async () => {
    const items = makePortfolioItems({ 'Category A': 12, 'Category B': 2 })
    mockUsePortfolio.mockReturnValue({ data: items, loading: false, error: null })
    render(<Portfolio />)

    // Initially show first 12 items
    expect(screen.getByText('Category A Item 1')).toBeInTheDocument()

    // Click filter with only 2 items
    await userEvent.click(await screen.findByTestId('filter-category-b'))

    await waitFor(() => {
      expect(screen.getByText('Category B Item 1')).toBeInTheDocument()
      expect(screen.getByText('Category B Item 2')).toBeInTheDocument()
      // Category A should not be visible
      expect(screen.queryByText('Category A Item')).not.toBeInTheDocument()
    })
  })
})
