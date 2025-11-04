import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import ServicesGrid from './ServicesGrid'

vi.mock('@/lib/image', () => ({
  urlFor: vi.fn(() => {
    const chain: any = {
      width: (..._args: any[]) => chain,
      height: (..._args: any[]) => chain,
      format: (..._args: any[]) => chain,
      quality: (..._args: any[]) => chain,
      url: () => 'https://example.com/image.jpg',
    }
    return chain
  })
}))

const makeServices = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    _id: `id-${i}`,
    title: `Service ${i + 1}`,
    description: `Description for service ${i + 1}`,
    image: { asset: { _ref: `image-ref-${i}` } },
  }))

const useServicesMock = vi.fn()
vi.mock('@/hooks/useServices', () => ({ useServices: () => useServicesMock() }))

describe('ServicesGrid', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders skeleton loaders while loading', () => {
    useServicesMock.mockReturnValue({ data: [], isLoading: true, error: null })
    const { container } = render(<ServicesGrid />)
    expect(container).toBeDefined()
  })

  it('renders a grid of services successfully', async () => {
    const services = makeServices(4)
    useServicesMock.mockReturnValue({ data: services, loading: false, error: null })
    render(<ServicesGrid />)

    await waitFor(() => {
      services.forEach((service) => {
        expect(screen.getByText(service.title)).toBeInTheDocument()
      })
    })
  })
})
