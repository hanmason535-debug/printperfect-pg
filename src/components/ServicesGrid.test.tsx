import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import ServicesGrid from './ServicesGrid'

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

describe('ServicesGrid', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    urlForMock.mockClear()
  })

  it('fetches services from Sanity and renders them', async () => {
    fetchMock.mockResolvedValueOnce([
      {
        _id: 'service-1',
        title: 'Business Cards',
        description: 'Premium card printing',
        image: undefined,
        iconName: 'Printer'
      },
      {
        _id: 'service-2',
        title: 'Large Format Banners',
        description: 'Vibrant outdoor banners',
        image: undefined,
        iconName: 'Printer'
      }
    ])

    render(<ServicesGrid />)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toContain('*[_type == "service"]')

    expect(await screen.findByText('Business Cards')).toBeInTheDocument()
    expect(screen.getByText('Large Format Banners')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('Loading services...')).toBeNull())
  })

  it('renders empty state when Sanity returns no services', async () => {
    fetchMock.mockResolvedValueOnce([])

    render(<ServicesGrid />)

    expect(await screen.findByText('No services to display.')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('Loading services...')).toBeNull())
  })

  it('logs an error when the fetch fails but still clears the loader', async () => {
    const error = new Error('Network down')
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMock.mockRejectedValueOnce(error)

    render(<ServicesGrid />)

    await waitFor(() => expect(consoleError).toHaveBeenCalledWith('Failed to fetch services:', error))
    expect(screen.getByText('No services to display.')).toBeInTheDocument()
    consoleError.mockRestore()
  })
})
