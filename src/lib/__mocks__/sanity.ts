
import { vi } from 'vitest';

// Create a chainable builder that properly implements the builder pattern
class MockUrlBuilder {
  width(w: number) {
    return this;
  }
  height(h: number) {
    return this;
  }
  fit(fitMode: string) {
    return this;
  }
  format(fmt: string) {
    return this;
  }
  quality(q: number) {
    return this;
  }
  url() {
    return '/mock-image.jpg';
  }
}

export const sanityClient = {
  fetch: vi.fn(),
};

export const urlFor = vi.fn(() => new MockUrlBuilder());
