import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import ServicesGrid from './ServicesGrid'
import { useServices } from '@/hooks/useServices'

vi.mock('@/hooks/useServices')
vi.mock('@/lib/image', () => ({
  urlFor: vi.fn().mockReturnValue({
    width: vi.fn().mockReturnThis(),
    url: vi.fn().mockReturnValue('https://example.com/image.jpg'),
  }),
}))

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
    // Assuming 8 skeletons are rendered
    expect(container.querySelectorAll('.h-48.w-full.rounded-t-xl').length).toBe(8)
  })

  it('renders an empty state when no services are available', () => {
    mockUseServices.mockReturnValue({ data: [], loading: false, error: null })
    render(<ServicesGrid />)
    expect(screen.getByText('No Services Available')).toBeInTheDocument()
    expect(screen.getByText('Please check back soon to see what we offer.')).toBeInTheDocument()
  })

  it('renders an error message if fetching fails', () => {
    mockUseServices.mockReturnValue({ data: [], loading: false, error: new Error('Failed') })
    render(<ServicesGrid />)
    expect(screen.getByText("We're having trouble loading our services. Please try again later.")).toBeInTheDocument()
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

  it('renders a maximum of 12 services', async () => {
    const services = makeServices(15)
    mockUseServices.mockReturnValue({ data: services, loading: false, error: null })
    const { container } = render(<ServicesGrid />)

    await waitFor(() => {
      // Check for the rendered cards by a unique attribute, like data-test-id
      const renderedCards = container.querySelectorAll('[data-test-id^="services-card-"]')
      expect(renderedCards.length).toBe(12)
    })
  })
})
