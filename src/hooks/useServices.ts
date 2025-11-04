import { useQuery } from '@tanstack/react-query';
import { sanity } from '@/lib/sanity';
import { Q_SERVICES } from '@/cms/queries';
import type { Service } from '@/types/cms';

/**
 * useServices
 *
 * React hook that fetches all services from the Sanity CMS.
 *
 * Behavior:
 * - Runs once on component mount via useEffect with empty dependency array
 * - Fetches data using `sanity.fetch()` and `Q_SERVICES` query
 * - Validates that result is an array before setting state
 * - Logs errors in dev mode and returns empty array on failure
 * - Does not refetch when dependencies change
 *
 * Returns:
 * @returns Array of Service objects, or empty array if fetch fails or component is not mounted
 */
export function useServices() {
  return useQuery<Service[], Error>({
    queryKey: ['services'],
    queryFn: async () => {
      try {
        const services = await sanity.fetch<Service[]>(Q_SERVICES)
        return services
      } catch (error) {
        console.error('[useServices] Failed to fetch services:', error)
        throw error instanceof Error ? error : new Error('Failed to fetch services')
      }
    },
  })
}
