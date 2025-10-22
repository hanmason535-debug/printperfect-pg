import {useEffect, useState} from 'react'
import {sanity} from '@/lib/sanity'
import {Q_SERVICES} from '@/cms/queries'
import type {Service} from '@/types/cms'

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
  const [data, setData] = useState<Service[]>([])

  useEffect(() => {
    sanity.fetch(Q_SERVICES)
      .then((result) => {
        if (Array.isArray(result)) {
          setData(result)
        } else {
          setData([])
        }
      })
      .catch((e) => {
        if (import.meta.env.DEV) console.error('[services] sanity.fetch failed:', e)
        setData([])
      })
  }, [])

  return data
}
