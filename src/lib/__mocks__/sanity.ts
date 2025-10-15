
import { vi } from 'vitest';

const mockUrlBuilder = {
  image: vi.fn().mockReturnThis(),
  width: vi.fn().mockReturnThis(),
  height: vi.fn().mockReturnThis(),
  fit: vi.fn().mockReturnThis(),
  format: vi.fn().mockReturnThis(),
  url: vi.fn().mockReturnValue('https://cdn.sanity.io/images/project-id/dataset/image-asset-id-1200x800.jpg'),
};

export const sanityClient = {
  fetch: vi.fn(),
};

export const urlFor = vi.fn((source) => {
    if (!source || !source.asset || !source.asset._ref) {
        return mockUrlBuilder;
    }
    const [_type, assetId, dimensions, format] = source.asset._ref.split('-');
    if(!assetId || !dimensions || !format) {
        //for lightbox test
        return mockUrlBuilder;
    }
    const [width, height] = dimensions.split('x');
    mockUrlBuilder.url.mockReturnValue(`https://cdn.sanity.io/images/project-id/dataset/${assetId}-${width}x${height}.${format}`);
    return mockUrlBuilder;
});
