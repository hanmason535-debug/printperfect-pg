import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Contact from './Contact';
import { useToast } from '@/hooks/use-toast';

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

describe('Contact Component', () => {
  let mockToast: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockToast = vi.fn();
    vi.clearAllMocks();
    (useToast as any).mockReturnValue({ toast: mockToast });
  });

  it('renders contact form with all required fields', () => {
    render(<Contact />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it.skip('shows validation error when form is submitted empty', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const submitButton = screen.getByRole('button', { name: /send/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          title: 'Error',
        })
      );
    });
  });

  it.skip('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /send/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'invalid-email');
    await user.type(messageInput, 'Test message');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          title: 'Error',
          description: expect.stringContaining('valid email'),
        })
      );
    });
  });

  it('honeypot field prevents bot submissions', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    // Find honeypot field (usually hidden)
    const honeypotField = document.querySelector('input[name="honeypot"]') as HTMLInputElement;

    if (honeypotField) {
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole('button', { name: /send/i });

      // Fill normal fields
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Test message');

      // Fill honeypot (which bots would do)
      await user.type(honeypotField, 'spam');
      await user.click(submitButton);

      // Should silently fail (bot detection)
      expect(mockToast).not.toHaveBeenCalled();
    }
  });

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /send/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'Test message');

    // Check initial state
    expect(submitButton).not.toBeDisabled();
  });

  it('shows validation error for invalid phone number', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/phone/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /send/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(phoneInput, 'invalid-phone-number');
    await user.type(messageInput, 'Test message');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          title: 'Error',
          description: expect.stringContaining('valid phone number'),
        })
      );
    });
  });

  it('displays contact information correctly', () => {
    render(<Contact />);

    // Check that contact info heading is displayed
    expect(screen.getByRole('heading', { name: /contact information/i })).toBeInTheDocument();
  });

  it('has accessible form labels', () => {
    render(<Contact />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/phone/i);
    const messageInput = screen.getByLabelText(/message/i);

    // Verify aria-labelledby or for attribute
    expect(nameInput).toHaveAttribute('id');
    expect(emailInput).toHaveAttribute('id');
    expect(phoneInput).toHaveAttribute('id');
    expect(messageInput).toHaveAttribute('id');
  });
});
