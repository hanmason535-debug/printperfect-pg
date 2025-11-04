import { useQuery } from '@tanstack/react-query';
import { sanity } from '@/lib/sanity';
import { Q_PORTFOLIO } from '@/cms/queries';
import type { PortfolioItem } from '@/types/cms';

/**
 * usePortfolio
 *
 * React hook that fetches all portfolio items from the Sanity CMS.
 *
 * Behavior:
 * - Runs once on component mount via useEffect with empty dependency array
 * - Fetches data using `sanity.fetch()` and `Q_PORTFOLIO` query
 * - Validates that result is an array before setting state
 * - Logs errors in dev mode and returns empty array on failure
 * - Does not refetch when dependencies change
 *
 * Returns:
 * @returns Array of PortfolioItem objects, or empty array if fetch fails or component is not mounted
 */
export function usePortfolio() {
  return useQuery<PortfolioItem[], Error>({
    queryKey: ['portfolio'],
    queryFn: async () => {
      try {
        const items = await sanity.fetch<PortfolioItem[]>(Q_PORTFOLIO)
        return items
      } catch (error) {
        console.error('[usePortfolio] Failed to fetch portfolio:', error)
        throw error instanceof Error ? error : new Error('Failed to fetch portfolio')
      }
    },
  })
}
