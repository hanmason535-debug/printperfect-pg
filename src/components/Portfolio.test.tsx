import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Portfolio from './Portfolio'

const { usePortfolioMock, urlForMock } = vi.hoisted(() => {
  const builderFactory = () => {
    const builder: any = {}
    builder.width = vi.fn(() => builder)
    builder.height = vi.fn(() => builder)
    builder.fit = vi.fn(() => builder)
    builder.format = vi.fn(() => builder)
    builder.blur = vi.fn(() => builder)
    builder.url = vi.fn(() => 'https://example.com/image.webp')
    return builder
  }

  return {
    usePortfolioMock: vi.fn(),
    urlForMock: vi.fn(() => builderFactory())
  }
})

vi.mock('@/hooks/usePortfolio', () => ({
  usePortfolio: () => usePortfolioMock()
}))

vi.mock('@/lib/image', () => ({
  urlFor: urlForMock
}))

function makePortfolioItems(count: number) {
  const categories = ['Business Cards', 'Banners', 'Apparel', 'Stickers'] as const
  return Array.from({ length: count }, (_, index) => {
    const category = categories[index % categories.length]
    const slug = category.toLowerCase().replace(/\s+/g, '-')
    return {
      _id: `portfolio-${index + 1}`,
      title: `Item ${index + 1}`,
      description: `Description ${index + 1}`,
      image: { asset: { _ref: `image-${index + 1}` } },
      link: null,
      category,
      priority: index + 1,
      categorySlugs: [slug],
      hoverId: null
    }
  })
}

describe('Portfolio', () => {
  beforeEach(() => {
    usePortfolioMock.mockReset()
    urlForMock.mockClear()
  })

  it('shows the first 9 items and paginates to the next page', async () => {
    usePortfolioMock.mockReturnValue(makePortfolioItems(11))
    const user = userEvent.setup()

    render(<Portfolio />)

    // Wait for items to appear
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /Item \d+/ })).toHaveLength(9)
    })
    expect(screen.queryByText('Item 10')).not.toBeInTheDocument()

    // Click next page
    await user.click(screen.getByTestId('portfolio-page-next'))

    // Now item 10 should be visible
    await waitFor(() => {
      expect(screen.getByText('Item 10')).toBeInTheDocument()
      expect(screen.getAllByRole('button', { name: /Item \d+/ })).toHaveLength(2)
    })
  })

  it('filters by category and resets pagination', async () => {
    usePortfolioMock.mockReturnValue(makePortfolioItems(12))
    const user = userEvent.setup()

    render(<Portfolio />)

    // Go to page 2
    await user.click(screen.getByTestId('portfolio-page-next'))
    await waitFor(() => {
      expect(screen.getByText('Item 10')).toBeInTheDocument()
    })

    // Click a filter
    await user.click(screen.getByTestId('portfolio-filter-business-cards'))

    // Should reset to page 1 and show only 'Business Cards'
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 5')).toBeInTheDocument()
      expect(screen.getByText('Item 9')).toBeInTheDocument()
      expect(screen.queryByText('Item 2')).not.toBeInTheDocument() // 'Banners'
      expect(screen.queryByText('Item 10')).not.toBeInTheDocument() // Was on page 2
    })
  })
})
