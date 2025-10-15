import React from 'react'
import { render, screen } from '@testing-library/react'
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

vi.mock('@/lib/sanity', () => ({
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

    const { container, getByRole, queryByText, findByText } = render(<Portfolio />)

    expect(container.querySelectorAll('h3').length).toBe(9)
    expect(queryByText('Item 10')).not.toBeInTheDocument()

    await user.click(getByRole('link', { name: /Next/i }))

    expect(await findByText('Item 10')).toBeInTheDocument()
  })

  it('filters by category and resets pagination', async () => {
    usePortfolioMock.mockReturnValue(makePortfolioItems(12))
    const user = userEvent.setup()

    const { getByRole, queryByText, findByText } = render(<Portfolio />)

    await user.click(getByRole('link', { name: /Next/i }))
    expect(await findByText('Item 10')).toBeInTheDocument()

    const matches = await screen.findAllByText(/Business Cards/i)
    const btn = matches.map((el) => el.closest('button')).find(Boolean)
    expect(btn).toBeTruthy()
    await user.click(btn as Element)

    expect(await findByText('Item 1')).toBeInTheDocument()
    expect(queryByText('Item 10')).not.toBeInTheDocument()
  })
})
