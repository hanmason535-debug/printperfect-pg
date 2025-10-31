/**
 * ═══════════════════════════════════════════════════════════════════════════
 * useServices Hook - Services Data Fetching
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview Custom React hook for fetching printing services from Sanity CMS
 * with automatic loading states, error handling, and type safety.
 *
 * @description
 * The useServices hook provides a simple interface to fetch service catalog:
 *
 * **Features**:
 * - Automatic data fetching on component mount
 * - Loading state management
 * - Error handling with user-friendly messages
 * - Type-safe return values (TypeScript)
 * - Development-only error logging
 *
 * **Return Values**:
 * - `data`: Array of Service objects (empty array during loading/error)
 * - `loading`: Boolean indicating fetch in progress
 * - `error`: Error object if fetch failed, null otherwise
 *
 * **Usage Pattern**:
 * ```tsx
 * const { data, loading, error } = useServices()
 *
 * if (loading) return <ServicesSkeleton />
 * if (error) return <ErrorMessage error={error} />
 * return <ServicesGrid services={data} />
 * ```
 *
 * **Error Handling**:
 * - Catches all fetch errors gracefully
 * - Logs to console in development mode only
 * - Provides Error object for user-friendly display
 * - Resets data to empty array on error
 *
 * **Performance**:
 * - useCallback prevents unnecessary refetches
 * - Single fetch on component mount
 * - No automatic refetching or polling
 * - Cached by Sanity client for subsequent mounts
 *
 * @module hooks/useServices
 * @see {@link Service} for data structure
 * @see {@link Q_SERVICES} for GROQ query
 */

import { useEffect, useState, useCallback } from 'react';
import { sanity } from '@/lib/sanity';
import { Q_SERVICES } from '@/cms/queries';
import type { Service, UseDataResult } from '@/types/cms';

/**
 * Fetch printing services from Sanity CMS
 *
 * @returns {UseDataResult<Service>} Services data, loading state, and error
 *
 * @example
 * function ServicesSection() {
 *   const { data: services, loading, error } = useServices()
 *
 *   if (loading) return <Spinner />
 *   if (error) return <div>Error: {error.message}</div>
 *
 *   return (
 *     <div className="services-grid">
 *       {services.map(service => (
 *         <ServiceCard key={service._id} service={service} />
 *       ))}
 *     </div>
 *   )
 * }
 */
export function useServices(): UseDataResult<Service> {
  // ─── State Management ─────────────────────────────────────────────────────

  /** Services array (empty during loading or on error) */
  const [data, setData] = useState<Service[]>([]);

  /** Loading state (true during initial fetch and refetch) */
  const [loading, setLoading] = useState(true);

  /** Error object if fetch failed, null otherwise */
  const [error, setError] = useState<Error | null>(null);

  // ─── Data Fetching ────────────────────────────────────────────────────────

  /**
   * Fetch services from Sanity
   *
   * @description
   * - Sets loading to true before fetch
   * - Clears previous error state
   * - Fetches data using Sanity client
   * - Updates state with results or error
   * - Always sets loading to false when complete
   *
   * Wrapped in useCallback to prevent unnecessary recreations
   */
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch services using GROQ query
      const services = await sanity.fetch<Service[]>(Q_SERVICES);
      setData(services);
      setError(null);
    } catch (e) {
      // Log errors in development mode only
      if (import.meta.env.DEV) {
        console.error('[services] sanity.fetch failed:', e);
      }

      // Convert unknown error to Error object
      const errorMessage = e instanceof Error ? e : new Error('Failed to load services');
      setError(errorMessage);
      setData([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Effect Hook ──────────────────────────────────────────────────────────

  /**
   * Fetch services data on component mount
   *
   * Dependencies: [fetchServices]
   * - Runs once on mount (fetchServices is stable via useCallback)
   * - Does not refetch on re-renders
   */
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // ─── Return Value ─────────────────────────────────────────────────────────

  return { data, loading, error };
}
