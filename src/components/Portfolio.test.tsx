import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Portfolio from './Portfolio'

const { usePortfolioMock, urlForMock } = vi.hoisted(() => {
  const builderFactory = () => {
    const builder: any = {}
    builder.width = vi.fn(() => builder)
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

  it('shows nine items on the first page and paginates through the rest', async () => {
    usePortfolioMock.mockReturnValue(makePortfolioItems(11))
    const user = userEvent.setup()

    render(<Portfolio />)

    expect(screen.getAllByText(/Item \d+/).length).toBe(9)
    expect(screen.queryByText('Item 10')).not.toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /Next/i }))

    expect(await screen.findByText('Item 10')).toBeInTheDocument()
  })

  it('filters by category and resets pagination', async () => {
    usePortfolioMock.mockReturnValue(makePortfolioItems(12))
    const user = userEvent.setup()

    render(<Portfolio />)

    await user.click(screen.getByRole('link', { name: /Next/i }))
    expect(await screen.findByText('Item 10')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: /Business Cards/i }))

    expect(await screen.findByText('Item 1')).toBeInTheDocument()
    expect(screen.queryByText('Item 10')).not.toBeInTheDocument()
  })
})
