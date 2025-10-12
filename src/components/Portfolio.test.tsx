import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Portfolio from './Portfolio'

const { fetchMock, urlForMock } = vi.hoisted(() => {
  const builderFactory = () => {
    const builder: any = {}
    builder.width = vi.fn(() => builder)
    builder.format = vi.fn(() => builder)
    builder.url = vi.fn(() => 'https://example.com/image.webp')
    return builder
  }

  return {
    fetchMock: vi.fn(),
    urlForMock: vi.fn(() => builderFactory())
  }
})

vi.mock('@/sanity/client', () => ({
  client: { fetch: fetchMock },
  urlFor: urlForMock
}))

const categoriesResponse = [
  { _id: 'cat-business', title: 'Business Cards' },
  { _id: 'cat-banners', title: 'Banners' }
]

const allItems = [
  {
    _id: 'item-1',
    title: 'Banner Deluxe',
    description: 'Large outdoor banner',
    category: { _id: 'cat-banners', title: 'Banners' },
    image: undefined
  },
  {
    _id: 'item-2',
    title: 'Card Essentials',
    description: 'Classic business card set',
    category: { _id: 'cat-business', title: 'Business Cards' },
    image: undefined
  }
]

describe('Portfolio', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    urlForMock.mockClear()
  })

  it('renders categories and initial portfolio items', async () => {
    fetchMock.mockImplementation((query: string, params?: { categoryRef?: string }) => {
      if (query.includes('_type == "category"')) {
        return Promise.resolve(categoriesResponse)
      }
      if (params?.categoryRef) {
        return Promise.resolve(allItems.filter((item) => item.category?._id === params.categoryRef))
      }
      return Promise.resolve(allItems)
    })

    render(<Portfolio />)

    expect(await screen.findByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'true')
    expect(await screen.findByText('Banner Deluxe')).toBeInTheDocument()
    expect(screen.getByText('Card Essentials')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('Loading portfolio...')).toBeNull())
  })

  it('filters items when a category is selected', async () => {
    fetchMock.mockImplementation((query: string, params?: { categoryRef?: string }) => {
      if (query.includes('_type == "category"')) {
        return Promise.resolve(categoriesResponse)
      }
      if (params?.categoryRef) {
        return Promise.resolve(allItems.filter((item) => item.category?._id === params.categoryRef))
      }
      return Promise.resolve(allItems)
    })

    const user = userEvent.setup()
    render(<Portfolio />)

    const bannersTab = await screen.findByRole('tab', { name: 'Banners' })
    await user.click(bannersTab)

    await waitFor(() =>
      expect(fetchMock).toHaveBeenLastCalledWith(
        expect.stringContaining('_type == "portfolioItem"'),
        { categoryRef: 'cat-banners' }
      )
    )

    expect(await screen.findByText('Banner Deluxe')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('Card Essentials')).toBeNull())
  })

  it('shows an empty state when the selected category has no items', async () => {
    fetchMock.mockImplementation((query: string, params?: { categoryRef?: string }) => {
      if (query.includes('_type == "category"')) {
        return Promise.resolve(categoriesResponse)
      }
      if (params?.categoryRef === 'cat-business') {
        return Promise.resolve([])
      }
      if (params?.categoryRef) {
        return Promise.resolve(allItems.filter((item) => item.category?._id === params.categoryRef))
      }
      return Promise.resolve(allItems)
    })

    const user = userEvent.setup()
    render(<Portfolio />)

    const businessTab = await screen.findByRole('tab', { name: 'Business Cards' })
    await user.click(businessTab)

    expect(await screen.findByText('No items to display for this category.')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('Loading portfolio...')).toBeNull())
  })
})
