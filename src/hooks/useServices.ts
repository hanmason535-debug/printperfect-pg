import { useQuery } from '@tanstack/react-query';
import { sanity } from '@/lib/sanity';
import { Q_SERVICES } from '@/cms/queries';
import type { Service } from '@/types/cms';

export function useServices() {
  return useQuery<Service[], Error>({
    queryKey: ['services'],
    queryFn: async () => {
      try {
        const services = await sanity.fetch<Service[]>(Q_SERVICES);
        return services;
      } catch (error) {
        console.error('[useServices] Failed to fetch services:', error);
        throw error instanceof Error ? error : new Error('Failed to fetch services');
      }
    },
  });
}
