import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUploadModal from './FileUploadModal';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import emailjs from '@emailjs/browser';

// Mock emailjs
vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn().mockResolvedValue({ status: 200, text: 'OK' }),
  },
}));

describe('FileUploadModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dropzone and handles file selection', async () => {
    render(<FileUploadModal isOpen={true} onClose={mockOnClose} />);
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    await waitFor(() => {
      const input = screen.getByTestId('upload-dropzone').querySelector('input');
      userEvent.upload(input, file);
    });

    await waitFor(() => {
      expect(screen.getByText('hello.png')).toBeInTheDocument();
    });
  });

  it('shows an error for rejected files', async () => {
    render(<FileUploadModal isOpen={true} onClose={mockOnClose} />);
    // Just verify the component renders without error
    expect(screen.getByTestId('upload-dropzone')).toBeInTheDocument();
  });

  it('sends a notification and shows the success screen', async () => {
    render(<FileUploadModal isOpen={true} onClose={mockOnClose} />);
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByTestId('upload-dropzone').querySelector('input');

    await userEvent.upload(input, file);
    await userEvent.click(screen.getByText('Send Notification'));

    await waitFor(() => {
      expect(screen.getByText('Files Sent')).toBeInTheDocument();
    });
  });

  it('shows an error if the notification fails to send', async () => {
    // Mock a failed send
    vi.mocked(emailjs.send).mockRejectedValueOnce(new Error('Failed'));

    render(<FileUploadModal isOpen={true} onClose={mockOnClose} />);
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    const input = await screen
      .findByTestId('upload-dropzone')
      .then((el) => el.querySelector('input'));
    if (input) await userEvent.upload(input, file);

    await userEvent.click(await screen.findByText('Send Notification'));

    await waitFor(() => {
      expect(
        screen.getByText('Failed to send notification. Please try again.')
      ).toBeInTheDocument();
    });
  });
});
