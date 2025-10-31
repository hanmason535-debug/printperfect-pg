import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FileUploadModal from './FileUploadModal'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock emailjs
vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn().mockResolvedValue({ status: 200, text: 'OK' }),
  },
}))

describe('FileUploadModal', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the dropzone and handles file selection', async () => {
    render(<FileUploadModal isOpen={true} onClose={mockOnClose} />)
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })

    await waitFor(() => {
      const input = screen.getByTestId('upload-dropzone').querySelector('input')
      userEvent.upload(input, file)
    })

    await waitFor(() => {
      expect(screen.getByText('hello.png')).toBeInTheDocument()
    })
  })

  it('shows an error for rejected files', async () => {
    render(<FileUploadModal isOpen={true} onClose={mockOnClose} />)
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' }) // Disallowed type
    const input = screen.getByTestId('upload-dropzone').querySelector('input')

    await userEvent.upload(input, file)

    await waitFor(() => {
      expect(screen.getByTestId('upload-error')).toBeInTheDocument()
    })
  })

  it('sends a notification and shows the success screen', async () => {
    render(<FileUploadModal isOpen={true} onClose={mockOnClose} />)
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })
    const input = screen.getByTestId('upload-dropzone').querySelector('input')

    await userEvent.upload(input, file)
    await userEvent.click(screen.getByText('Send Notification'))

    await waitFor(() => {
      expect(screen.getByText('Files Sent')).toBeInTheDocument()
    })
  })

  it('shows an error if the notification fails to send', async () => {
    // Mock a failed send
    const emailjs = await import('@emailjs/browser')
    ;(emailjs.default.send as jest.Mock).mockRejectedValue(new Error('Failed'))

    render(<FileUploadModal isOpen={true} onClose={mockOnClose} />)
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })

    await waitFor(async () => {
      const input = screen.getByTestId('upload-dropzone').querySelector('input')
      await userEvent.upload(input, file)
    })

    await userEvent.click(screen.getByText('Send Notification'))

    await waitFor(() => {
      expect(screen.getByText('Failed to send notification. Please try again.')).toBeInTheDocument()
    })
  })
})
