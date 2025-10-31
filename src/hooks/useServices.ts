import {useEffect, useState, useCallback} from 'react'
import {sanity} from '@/lib/sanity'
import {Q_SERVICES} from '@/cms/queries'
import type {Service, UseDataResult} from '@/types/cms'

/**
 * Custom hook to fetch services from Sanity CMS
 * @returns {UseDataResult<Service>} Object containing data, loading state, and error
 */
export function useServices(): UseDataResult<Service> {
  const [data, setData] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchServices = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const services = await sanity.fetch<Service[]>(Q_SERVICES)
      setData(services)
      setError(null)
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error('[services] sanity.fetch failed:', e)
      }
      const errorMessage = e instanceof Error ? e : new Error('Failed to load services')
      setError(errorMessage)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  return { data, loading, error }
}
