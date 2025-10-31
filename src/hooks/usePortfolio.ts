/**
 * ═══════════════════════════════════════════════════════════════════════════
 * usePortfolio Hook - Portfolio Data Fetching
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview Custom React hook for fetching portfolio items from Sanity CMS
 * with automatic loading states, error handling, and type safety.
 *
 * @description
 * The usePortfolio hook provides a simple interface to fetch portfolio data:
 *
 * **Features**:
 * - Automatic data fetching on mount
 * - Loading state management
 * - Error handling with user-friendly messages
 * - Type-safe return values (TypeScript)
 * - Development-only error logging
 *
 * **Return Values**:
 * - `data`: Array of PortfolioItem objects (empty array during loading/error)
 * - `loading`: Boolean indicating fetch in progress
 * - `error`: Error object if fetch failed, null otherwise
 *
 * **Usage Pattern**:
 * ```tsx
 * const { data, loading, error } = usePortfolio()
 *
 * if (loading) return <Skeleton />
 * if (error) return <ErrorMessage error={error} />
 * return <PortfolioGrid items={data} />
 * ```
 *
 * **Error Handling**:
 * - Catches all fetch errors
 * - Logs to console in development mode only
 * - Provides Error object for display
 * - Resets data to empty array on error
 *
 * **Performance**:
 * - useCallback prevents unnecessary refetches
 * - Single fetch on component mount
 * - No automatic refetching (no polling)
 *
 * @module hooks/usePortfolio
 * @see {@link PortfolioItem} for data structure
 * @see {@link Q_PORTFOLIO} for GROQ query
 */

import { useEffect, useState, useCallback } from 'react';
import { sanity } from '@/lib/sanity';
import { Q_PORTFOLIO } from '@/cms/queries';
import type { PortfolioItem, UseDataResult } from '@/types/cms';

/**
 * Fetch portfolio items from Sanity CMS
 *
 * @returns {UseDataResult<PortfolioItem>} Portfolio data, loading state, and error
 *
 * @example
 * function PortfolioSection() {
 *   const { data: items, loading, error } = usePortfolio()
 *
 *   if (loading) return <Spinner />
 *   if (error) return <div>Error: {error.message}</div>
 *
 *   return (
 *     <div>
 *       {items.map(item => (
 *         <PortfolioCard key={item._id} item={item} />
 *       ))}
 *     </div>
 *   )
 * }
 */
export function usePortfolio(): UseDataResult<PortfolioItem> {
  // ─── State Management ─────────────────────────────────────────────────────

  /** Portfolio items array (empty during loading or on error) */
  const [data, setData] = useState<PortfolioItem[]>([]);

  /** Loading state (true during initial fetch and refetch) */
  const [loading, setLoading] = useState(true);

  /** Error object if fetch failed, null otherwise */
  const [error, setError] = useState<Error | null>(null);

  // ─── Data Fetching ────────────────────────────────────────────────────────

  /**
   * Fetch portfolio items from Sanity
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
  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch portfolio items using GROQ query
      const items = await sanity.fetch<PortfolioItem[]>(Q_PORTFOLIO);
      setData(items);
      setError(null);
    } catch (e) {
      // Log errors in development mode only
      if (import.meta.env.DEV) {
        console.error('[portfolio] sanity.fetch failed:', e);
      }

      // Convert unknown error to Error object
      const errorMessage = e instanceof Error ? e : new Error('Failed to load portfolio');
      setError(errorMessage);
      setData([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Effect Hook ──────────────────────────────────────────────────────────

  /**
   * Fetch portfolio data on component mount
   *
   * Dependencies: [fetchPortfolio]
   * - Runs once on mount (fetchPortfolio is stable via useCallback)
   * - Does not refetch on re-renders
   */
  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  // ─── Return Value ─────────────────────────────────────────────────────────

  return { data, loading, error };
}
