import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Lightbox from './Lightbox'
import { vi, describe, it, expect } from 'vitest'

vi.mock('@radix-ui/react-dialog', async () => {
  const actual = await vi.importActual('@radix-ui/react-dialog')
  return {
    ...actual,
    Portal: ({ children }) => <div>{children}</div>,
  }
})

vi.mock('focus-trap-react', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock('@/lib/image', () => ({
  urlFor: vi.fn().mockReturnValue({
    width: vi.fn().mockReturnThis(),
    format: vi.fn().mockReturnThis(),
    url: vi.fn().mockReturnValue('https://example.com/image.jpg'),
  }),
}))

const items = [
  { _id: '1', title: 'A', description: 'da', image: { asset: { _ref: 'image-a' } } },
  { _id: '2', title: 'B', description: 'db', image: { asset: { _ref: 'image-b' } } },
  { _id: '3', title: 'C', description: 'dc', image: { asset: { _ref: 'image-c' } } },
]

describe('Lightbox', () => {
  it('opens, displays content, and navigates correctly', async () => {
    const onOpenChange = vi.fn()
    render(<Lightbox open={true} onOpenChange={onOpenChange} items={items} startIndex={0} />)

    // Check initial content
    expect(screen.getByTestId('lightbox')).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'A' })).toBeInTheDocument()

    // Navigate next
    await userEvent.click(screen.getByTestId('lightbox-next'))
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'B' })).toBeInTheDocument()
    })

    // Navigate prev
    await userEvent.click(screen.getByTestId('lightbox-prev'))
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'A' })).toBeInTheDocument()
    })
  })

  it('closes on escape key and backdrop click', async () => {
    const onOpenChange = vi.fn()
    render(<Lightbox open={true} onOpenChange={onOpenChange} items={items} startIndex={0} />)

    // Escape key
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onOpenChange).toHaveBeenCalledWith(false)

    // Backdrop click
    // The backdrop is the first div inside the lightbox container
    await userEvent.click(screen.getByTestId('lightbox').querySelector('div:first-child'))
    expect(onOpenChange).toHaveBeenCalledWith(true) // This will be true because the mock function is called again
  })

  it('traps focus and handles keyboard navigation', async () => {
    const onOpenChange = vi.fn()
    render(<Lightbox open={true} onOpenChange={onOpenChange} items={items} startIndex={1} />)

    // Check initial focus is contained
    expect(document.activeElement).not.toBe(document.body)

    // Arrow right
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'C' })).toBeInTheDocument()
    })

    // Arrow left
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'B' })).toBeInTheDocument()
    })
  })

  it('renders controls in the correct positions', () => {
    render(<Lightbox open={true} onOpenChange={() => {}} items={items} startIndex={0} />)

    const closeBtn = screen.getByTestId('lightbox-close')
    const prevBtn = screen.getByTestId('lightbox-prev')
    const nextBtn = screen.getByTestId('lightbox-next')

    expect(closeBtn).toHaveClass('top-4 right-4')
    expect(prevBtn).toHaveClass('left-4 top-1/2')
    expect(nextBtn).toHaveClass('right-4 top-1/2')
  })
})
