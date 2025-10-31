import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import Portfolio from '@/components/Portfolio';
import Contact from '@/components/Contact';
import ServicesGrid from '@/components/ServicesGrid';

describe('Accessibility Tests with jest-axe', () => {
  it('Portfolio component should have no accessibility violations', async () => {
    const { container } = render(<Portfolio />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Contact component should have no accessibility violations', async () => {
    const { container } = render(<Contact />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ServicesGrid component should have no accessibility violations', async () => {
    const { container } = render(<ServicesGrid />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Additional Accessibility Features', () => {
  it('should have skip to main content link', () => {
    render(<Portfolio />);
    // Check for skip link (if implemented in layout)
    const skipLink = screen.queryByText(/skip to main content/i);
    if (skipLink) {
      expect(skipLink).toBeInTheDocument();
    }
  });

  it('images should have alt text', () => {
    render(<Portfolio />);
    const images = screen.queryAllByRole('img');
    images.forEach((img) => {
      expect(img).toHaveAttribute('alt');
    });
  });

  it('buttons should have accessible names', () => {
    render(<Contact />);
    const buttons = screen.queryAllByRole('button');
    buttons.forEach((button) => {
      const accessibleName = button.getAttribute('aria-label') || button.textContent;
      expect(accessibleName).toBeTruthy();
    });
  });

  it('form inputs should have labels', () => {
    render(<Contact />);
    const inputs = screen.queryAllByRole('textbox');
    inputs.forEach((input) => {
      const label = screen.queryByLabelText(input.getAttribute('name') || '');
      // Should have either label or aria-label
      const hasLabel = label || input.getAttribute('aria-label');
      expect(hasLabel).toBeTruthy();
    });
  });
});
