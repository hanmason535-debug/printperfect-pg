import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Lightbox from './Lightbox'
import { vi } from 'vitest'
import type { PortfolioItem } from '@/types/cms'

vi.mock('@/lib/image', () => ({
  urlFor: vi.fn().mockReturnValue({
    width: vi.fn().mockReturnThis(),
    format: vi.fn().mockReturnThis(),
    url: vi.fn().mockReturnValue('https://example.com/image.webp')
  })
}))

const items = [
  { _id: '1', title: 'A', description: 'da', image: { asset: { _ref: 'image-a-2000x3000-jpg' } } },
  { _id: '2', title: 'B', description: 'db', image: { asset: { _ref: 'image-b-2000x3000-jpg' } } }
] as PortfolioItem[]

test('opens, shows title/desc, arrows navigate, esc closes', async () => {
  const onOpenChange = vi.fn()
  render(<Lightbox open={true} onOpenChange={onOpenChange} items={items} startIndex={0} />)

  // Wait for the lightbox to be visible
  await waitFor(() => {
    expect(screen.getByTestId('lightbox-stage')).toBeVisible()
  })

  // Heading shows current title (h3)
  expect(screen.getByRole('heading', { name: 'A', level: 3 })).toBeInTheDocument()

  // next via data-testid
  fireEvent.click(screen.getByTestId('lightbox-next'))
  await waitFor(() => {
    // The dialog's accessible name updates to the new title
    expect(screen.getByRole('dialog', { name: 'B' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'B', level: 3 })).toBeInTheDocument()
  })

  // prev via data-testid
  fireEvent.click(screen.getByTestId('lightbox-prev'))
  await waitFor(() => {
    expect(screen.getByRole('dialog', { name: 'A' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'A', level: 3 })).toBeInTheDocument()
  })

  // esc
  fireEvent.keyDown(document.body, { key: 'Escape' })
  expect(onOpenChange).toHaveBeenCalledWith(false)
})
