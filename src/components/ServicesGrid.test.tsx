import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ServicesGrid from './ServicesGrid'

const { useServicesMock, urlForMock } = vi.hoisted(() => {
  const builderFactory = () => {
    const builder: any = {}
    builder.width = vi.fn(() => builder)
    builder.url = vi.fn(() => 'https://example.com/image.webp')
    return builder
  }

  return {
    useServicesMock: vi.fn(),
    urlForMock: vi.fn(() => builderFactory())
  }
})

vi.mock('@/hooks/useServices', () => ({
  useServices: () => useServicesMock()
}))

vi.mock('@/lib/image', () => ({
  urlFor: urlForMock
}))

function makeServices(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    _id: `service-${index + 1}`,
    title: `Service ${index + 1}`,
    description: `Description ${index + 1}`,
    image: { asset: { _ref: `image-${index + 1}` } }
  }))
}

describe('ServicesGrid', () => {
  beforeEach(() => {
    useServicesMock.mockReset()
    urlForMock.mockClear()
  })

  it('renders up to twelve services from Sanity', () => {
    useServicesMock.mockReturnValue(makeServices(13))

    render(<ServicesGrid />)

    expect(screen.getAllByText(/Service \d+/).length).toBe(12)
    expect(screen.queryByText('Service 13')).not.toBeInTheDocument()
  })

  it('renders whatever data is returned when fewer than twelve services exist', () => {
    useServicesMock.mockReturnValue(makeServices(4))

    render(<ServicesGrid />)

    expect(screen.getAllByText(/Service \d+/).length).toBe(4)
  })
})
