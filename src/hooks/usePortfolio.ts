import {useEffect, useState, useCallback} from 'react'
import {sanity} from '@/lib/sanity'
import {Q_PORTFOLIO} from '@/cms/queries'
import type {PortfolioItem, UseDataResult} from '@/types/cms'

/**
 * Custom hook to fetch portfolio items from Sanity CMS
 * @returns {UseDataResult<PortfolioItem>} Object containing data, loading state, and error
 */
export function usePortfolio(): UseDataResult<PortfolioItem> {
  const [data, setData] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPortfolio = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const items = await sanity.fetch<PortfolioItem[]>(Q_PORTFOLIO)
      setData(items)
      setError(null)
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error('[portfolio] sanity.fetch failed:', e)
      }
      const errorMessage = e instanceof Error ? e : new Error('Failed to load portfolio')
      setError(errorMessage)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPortfolio()
  }, [fetchPortfolio])

  return { data, loading, error }
}
