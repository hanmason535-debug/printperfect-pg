import { useQuery } from '@tanstack/react-query';
import { sanity } from '@/lib/sanity';
import { Q_PORTFOLIO } from '@/cms/queries';
import type { PortfolioItem } from '@/types/cms';

export function usePortfolio() {
  return useQuery<PortfolioItem[], Error>({
    queryKey: ['portfolio'],
    queryFn: async () => {
      try {
        const items = await sanity.fetch<PortfolioItem[]>(Q_PORTFOLIO);
        return items;
      } catch (error) {
        console.error('[usePortfolio] Failed to fetch portfolio:', error);
        throw error instanceof Error ? error : new Error('Failed to fetch portfolio');
      }
    },
  });
}
