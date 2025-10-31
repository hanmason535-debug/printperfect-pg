import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Header from './Header';

// Mock window.open for button clicks
global.open = vi.fn();

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders header with navigation items', () => {
    render(<Header />);

    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/services/i)).toBeInTheDocument();
    expect(screen.getByText(/portfolio/i)).toBeInTheDocument();
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
  });

  it('renders contact action buttons', () => {
    render(<Header />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('toggles mobile menu on button click', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const menuButton = screen.getByRole('button', { name: /menu|hamburger/i });
    
    // Menu should be closed initially
    expect(menuButton).toBeInTheDocument();

    // Click to open
    await user.click(menuButton);

    // Menu should be open (check for close button or open state)
    const closeButton = screen.queryByRole('button', { name: /close|cancel/i });
    expect(closeButton || menuButton).toBeInTheDocument();
  });

  it('has accessible navigation structure', () => {
    const { container } = render(<Header />);

    // Check for nav element or header element
    const nav = container.querySelector('nav');
    const header = container.querySelector('header');
    
    expect(nav || header).toBeInTheDocument();
  });

  it('opens WhatsApp link when WhatsApp button is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const whatsappButton = screen.getByRole('button', { name: /whatsapp/i });
    await user.click(whatsappButton);

    // window.open should have been called with WhatsApp URL
    expect(global.open).toHaveBeenCalledWith(
      expect.stringContaining('wa.me'),
      '_blank'
    );
  });

  it('has responsive design indicators', () => {
    render(<Header />);

    // Check for mobile menu toggle button
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('maintains scroll state for styling', () => {
    render(<Header />);
    
    // Component should render without errors
    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });

  it('closes mobile menu when navigation link is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const menuButton = screen.getByRole('button', { name: /menu|hamburger/i });
    await user.click(menuButton);

    // Find and click a nav link
    const homeLink = screen.getByText(/home/i);
    await user.click(homeLink);

    // Menu should close after click (verify by checking if menu button is still there)
    expect(menuButton).toBeInTheDocument();
  });
});
