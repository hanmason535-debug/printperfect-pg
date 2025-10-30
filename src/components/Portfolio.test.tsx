import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect } from 'vitest'
import Portfolio from './Portfolio'
import { usePortfolio } from '@/hooks/usePortfolio'

vi.mock('@/hooks/usePortfolio')
vi.mock('@/lib/image', () => ({
  urlFor: vi.fn().mockReturnValue({
    width: vi.fn().mockReturnThis(),
    height: vi.fn().mockReturnThis(),
    fit: vi.fn().mockReturnThis(),
    format: vi.fn().mockReturnThis(),
    url: vi.fn().mockReturnValue('https://example.com/image.jpg'),
  }),
}))

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
    expect(container.querySelectorAll('.aspect-square.rounded-xl').length).toBe(6)
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

  it('filters items when a category tab is clicked and resets pagination', async () => {
    const items = makePortfolioItems({ 'Category A': 10, 'Category B': 5 })
    mockUsePortfolio.mockReturnValue({ data: items, loading: false, error: null })
    render(<Portfolio />)

    // Go to page 2
    await userEvent.click(await screen.findByText('2'))
    expect(await screen.findByText('Category A Item 10')).toBeInTheDocument()

    // Click filter
    await userEvent.click(await screen.findByTestId('filter-category-b'))

    await waitFor(() => {
      expect(screen.queryByText('Category A Item 1')).not.toBeInTheDocument()
      expect(screen.getByText('Category B Item 1')).toBeInTheDocument()
      // Check if pagination is reset to page 1
      expect(screen.getByText('1').closest('a')).toHaveAttribute('data-active', 'true')
    })
  })

  it('displays an empty state when a filter results in no items', async () => {
    const items = makePortfolioItems({ 'Category A': 2, 'Empty Category': 0 })
    mockUsePortfolio.mockReturnValue({ data: items, loading: false, error: null })
    render(<Portfolio />)

    await userEvent.click(await screen.findByTestId('filter-empty-category'))

    await waitFor(() => {
      expect(screen.getByTestId('portfolio-empty')).toBeInTheDocument()
    })
  })

  it('clamps the page number if it goes out of bounds after filtering', async () => {
    const items = makePortfolioItems({ 'Category A': 12, 'Category B': 2 })
    mockUsePortfolio.mockReturnValue({ data: items, loading: false, error: null })
    render(<Portfolio />)

    // Go to page 2
    await userEvent.click(await screen.findByText('2'))
    expect(await screen.findByText('Category A Item 12')).toBeInTheDocument()

    // Click filter with only 2 items
    await userEvent.click(await screen.findByTestId('filter-category-b'))

    await waitFor(() => {
      expect(screen.getByText('1').closest('a')).toHaveAttribute('data-active', 'true')
    })
  })
})
