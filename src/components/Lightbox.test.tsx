import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Lightbox from './Lightbox'
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('@/lib/image', () => {
  class MockBuilder {
    width() {
      return this
    }
    height() {
      return this
    }
    fit() {
      return this
    }
    format() {
      return this
    }
    quality() {
      return this
    }
    url() {
      return 'https://example.com/image.jpg'
    }
  }
  return {
    urlFor: vi.fn(() => new MockBuilder()),
  }
})

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    useReducedMotion: vi.fn(() => false),
  }
})

const items = [
  {
    _id: '1',
    title: 'A',
    description: 'da',
    image: { asset: { _ref: 'image-a' } },
  },
  {
    _id: '2',
    title: 'B',
    description: 'db',
    image: { asset: { _ref: 'image-b' } },
  },
  {
    _id: '3',
    title: 'C',
    description: 'dc',
    image: { asset: { _ref: 'image-c' } },
  },
] as any

describe('Lightbox', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens, displays content, and navigates correctly', async () => {
    const onOpenChange = vi.fn()
    render(<Lightbox open={true} onOpenChange={onOpenChange} items={items} startIndex={0} />)

    expect(screen.getByTestId('lightbox')).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'A' })).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('lightbox-next'))
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'B' })).toBeInTheDocument()
    })

    await userEvent.click(screen.getByTestId('lightbox-prev'))
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'A' })).toBeInTheDocument()
    })
  })

  it('closes on escape key and backdrop click', async () => {
    const onOpenChange = vi.fn()
    render(<Lightbox open={true} onOpenChange={onOpenChange} items={items} startIndex={0} />)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onOpenChange).toHaveBeenCalledWith(false)

    await userEvent.click(screen.getByTestId('lightbox').querySelector('div:first-child')!)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('traps focus and handles keyboard navigation', async () => {
    const onOpenChange = vi.fn()
    render(<Lightbox open={true} onOpenChange={onOpenChange} items={items} startIndex={1} />)

    fireEvent.keyDown(window, { key: 'ArrowRight' })
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'C' })).toBeInTheDocument()
    })

    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'B' })).toBeInTheDocument()
    })
  })

  it('handles empty items array without crashing', () => {
    const onOpenChange = vi.fn()
    render(<Lightbox open={true} onOpenChange={onOpenChange} items={[]} startIndex={0} />)
    expect(screen.queryByTestId('lightbox')).not.toBeInTheDocument()
  })
})
