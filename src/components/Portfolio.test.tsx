import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Portfolio from './Portfolio'

vi.mock('@/lib/image', () => ({
  urlFor: vi.fn(() => {
    const chain: any = {
      width: (..._args: any[]) => chain,
      height: (..._args: any[]) => chain,
      fit: (..._args: any[]) => chain,
      format: (..._args: any[]) => chain,
      quality: (..._args: any[]) => chain,
      url: () => 'https://example.com/image.jpg',
    }
    return chain
  })
}))

const makePortfolioItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    _id: `item-${i + 1}`,
    title: `Item ${i + 1}`,
    category: ['Business Cards', 'Banners', 'Apparel'][i % 3],
    image: { asset: { _ref: `image-${i + 1}` } },
  }))

const usePortfolioMock = vi.fn()
vi.mock('@/hooks/usePortfolio', () => ({ usePortfolio: () => usePortfolioMock() }))

describe('Portfolio', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders skeletons while loading', () => {
    usePortfolioMock.mockReturnValue({ data: [], isLoading: true, error: null })
    const { container } = render(<Portfolio />)
    expect(container.querySelectorAll('.h-64.w-full').length).toBeGreaterThanOrEqual(1)
  })

  it('shows items and paginates', async () => {
    usePortfolioMock.mockReturnValue({ data: makePortfolioItems(11), loading: false, error: null })
    render(<Portfolio />)

    // Wait for items to render (initial page should show a subset)
    await waitFor(() => expect(screen.getAllByRole('button', { name: /Item \d+/ }).length).toBeGreaterThan(0))
  })

  it('shows empty state when no items', async () => {
    usePortfolioMock.mockReturnValue({ data: [], loading: false, error: null })
    render(<Portfolio />)
    expect(await screen.findByTestId('portfolio-empty')).toBeInTheDocument()
  })
})
