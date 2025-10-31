import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import ServicesGrid from './ServicesGrid'
import { useServices } from '@/hooks/useServices'

vi.mock('@/hooks/useServices')
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

const mockUseServices = useServices as jest.Mock

const makeServices = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    _id: `id-${i}`,
    title: `Service ${i + 1}`,
    description: `Description for service ${i + 1}`,
    image: { asset: { _ref: `image-ref-${i}` } },
  }))

describe('ServicesGrid', () => {
  it('renders skeleton loaders while loading', () => {
    mockUseServices.mockReturnValue({ data: [], loading: true, error: null })
    const { container } = render(<ServicesGrid />)
    // ServicesSkeleton renders 9 items with class h-48 w-full
    expect(container.querySelectorAll('.h-48.w-full.rounded-none').length).toBe(9)
  })

  it('renders an empty state when no services are available', () => {
    mockUseServices.mockReturnValue({ data: [], loading: false, error: null })
    render(<ServicesGrid />)
    expect(screen.getByText('No Services Available')).toBeInTheDocument()
    expect(screen.getByText('Please check back soon to see what we offer.')).toBeInTheDocument()
  })

  it('renders an error message if fetching fails', () => {
    mockUseServices.mockReturnValue({ data: [], loading: false, error: new Error('Failed') })
    const { container } = render(<ServicesGrid />)
    // Check for the error heading instead
    expect(screen.getByRole('heading', { name: /failed to load/i })).toBeInTheDocument()
  })

  it('renders a grid of services successfully', async () => {
    const services = makeServices(4)
    mockUseServices.mockReturnValue({ data: services, loading: false, error: null })
    render(<ServicesGrid />)

    await waitFor(() => {
      services.forEach(service => {
        expect(screen.getByText(service.title)).toBeInTheDocument()
      })
    })
  })

  it('renders a maximum of 9 services initially', async () => {
    const services = makeServices(15)
    mockUseServices.mockReturnValue({ data: services, loading: false, error: null })
    const { container } = render(<ServicesGrid />)

    await waitFor(() => {
      // Check for the rendered cards by a unique attribute, like data-testid
      // ServicesGrid shows 9 services initially (3x3 grid)
      const renderedCards = container.querySelectorAll('[data-testid^="services-card-"]')
      expect(renderedCards.length).toBe(9)
    })
  })
})
